// Portable quiz state. Students carry it week to week by pasting it into Canvas.
// The checksum catches copy/paste damage and casual edits. It is not security:
// anyone can read this file and recompute it.

export const STATE_SCHEMA = 1;
const PREFIX = 'M248Q';
const CODE_PATTERN = /M248Q(\d+)\.v(\d+)\.([A-Za-z0-9_-]+)\.([0-9a-f]{12})/g;
const INVISIBLE = /[\s​-‍⁠﻿]+/g;

const rotr = (x, n) => (x >>> n) | (x << (32 - n));
const fraction = (x) => ((x - Math.floor(x)) * 0x100000000) >>> 0;
const PRIMES = [];
for (let n = 2; PRIMES.length < 64; n += 1) if (PRIMES.every((p) => n % p)) PRIMES.push(n);
const K = PRIMES.map((p) => fraction(Math.cbrt(p)));
const H0 = PRIMES.slice(0, 8).map((p) => fraction(Math.sqrt(p)));

// Synchronous SHA-256 so it works everywhere (file://, older Node) without crypto.subtle.
export function sha256Hex(text) {
  const bytes = new TextEncoder().encode(text);
  const length = Math.ceil((bytes.length + 9) / 64) * 64;
  const padded = new Uint8Array(length);
  padded.set(bytes);
  padded[bytes.length] = 0x80;
  const view = new DataView(padded.buffer);
  view.setUint32(length - 8, Math.floor(bytes.length / 0x20000000));
  view.setUint32(length - 4, (bytes.length * 8) >>> 0);

  const hash = [...H0];
  const w = new Uint32Array(64);
  for (let offset = 0; offset < length; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4);
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let i = 0; i < 64; i += 1) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) >>> 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) >>> 0;
      [h, g, f, e, d, c, b, a] = [g, f, e, (d + t1) >>> 0, c, b, a, (t1 + t2) >>> 0];
    }
    [a, b, c, d, e, f, g, h].forEach((value, i) => { hash[i] = (hash[i] + value) >>> 0; });
  }
  return hash.map((value) => value.toString(16).padStart(8, '0')).join('');
}

function toBase64Url(text) {
  let binary = '';
  new TextEncoder().encode(text).forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(body) {
  const binary = atob(body.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((body.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(binary, (character) => character.charCodeAt(0)));
}

const checksum = (head, body) => sha256Hex(`${head}.${body}`).slice(0, 12);

export function encodeStateCode(payload) {
  const head = `${PREFIX}${payload.q}.v${payload.s}`;
  const body = toBase64Url(JSON.stringify(payload));
  return `${head}.${body}.${checksum(head, body)}`;
}

// Finds every code in pasted text: a bare code, a whole Canvas submission, or many of them.
export function findStateCodes(text) {
  return [...String(text ?? '').replace(INVISIBLE, '').matchAll(CODE_PATTERN)].map((match) => match[0]);
}

export function decodeStateCode(text) {
  const compact = String(text ?? '').replace(INVISIBLE, '');
  const match = new RegExp(CODE_PATTERN.source).exec(compact);
  if (!match) return { ok: false, reason: compact.includes(PREFIX) ? 'incomplete' : 'missing' };
  const [code, quiz, schema, body, sum] = match;
  if (Number(schema) > STATE_SCHEMA) return { ok: false, reason: 'newer' };
  if (checksum(`${PREFIX}${quiz}.v${schema}`, body) !== sum) return { ok: false, reason: 'checksum' };
  let state;
  try { state = JSON.parse(fromBase64Url(body)); } catch { return { ok: false, reason: 'format' }; }
  if (!state || state.q !== Number(quiz) || state.s !== Number(schema)) return { ok: false, reason: 'format' };
  return { ok: true, code, state };
}
