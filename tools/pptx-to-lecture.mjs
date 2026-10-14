#!/usr/bin/env node
// Turns a PowerPoint deck into lecture Markdown for content/lectures/, in the shape the lecture page
// and its slide deck read: one "### Slide N: Title" per slide, in the deck's own order, with its
// text, bullets (nested by level), tables, and a placeholder where a picture was.
//
//   node tools/pptx-to-lecture.mjs "248 Slides.pptx" > content/lectures/2026-10-19-live-sound-3.md
//   node tools/pptx-to-lecture.mjs deck.pptx --from 4 --to 22     # just part of a long deck
//
// No dependencies: a .pptx is a zip of XML, read here with Node's own zlib.
// It can't tell a student's name from any other word. Read the output and redact before committing
// (see CLAUDE.md → Lectures); the checker catches quiz access codes and form/Drive links, not names.

import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { basename } from 'node:path';

export function unzip(buffer) {
  // Find the end-of-central-directory record, then walk the central directory.
  let end = buffer.length - 22;
  while (end >= 0 && buffer.readUInt32LE(end) !== 0x06054b50) end -= 1;
  if (end < 0) throw new Error('Not a zip file (is this really a .pptx?)');
  const count = buffer.readUInt16LE(end + 10);
  let at = buffer.readUInt32LE(end + 16);
  const files = new Map();
  for (let index = 0; index < count; index += 1) {
    const method = buffer.readUInt16LE(at + 10);
    const size = buffer.readUInt32LE(at + 20);
    const nameLength = buffer.readUInt16LE(at + 28);
    const extraLength = buffer.readUInt16LE(at + 30);
    const commentLength = buffer.readUInt16LE(at + 32);
    const local = buffer.readUInt32LE(at + 42);
    const name = buffer.toString('utf8', at + 46, at + 46 + nameLength);
    const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
    const raw = buffer.subarray(start, start + size);
    files.set(name, () => (method === 8 ? inflateRawSync(raw) : raw).toString('utf8'));
    at += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

const decode = (text) => text
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#x([0-9a-f]+);/gi, (match, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (match, number) => String.fromCodePoint(Number(number)))
  .replace(/&amp;/g, '&');

const all = (xml, pattern) => [...xml.matchAll(pattern)];

// One paragraph's text, with Markdown's own characters left alone (slides rarely use them).
function paragraphText(paragraph) {
  return decode(all(paragraph, /<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>|<a:br\/>/g)
    .map((match) => (match[0] === '<a:br/>' ? ' ' : match[1])).join('')).replace(/\s+/g, ' ').trim();
}

function table(xml) {
  const rows = all(xml, /<a:tr\b[\s\S]*?<\/a:tr>/g).map((row) => all(row[0], /<a:tc\b[\s\S]*?<\/a:tc>/g)
    .map((cell) => all(cell[0], /<a:p\b[\s\S]*?<\/a:p>/g).map((p) => paragraphText(p[0])).filter(Boolean).join(' ').replace(/\|/g, '/')));
  if (!rows.length) return '';
  const width = Math.max(...rows.map((row) => row.length));
  const line = (row) => `| ${Array.from({ length: width }, (_, at) => row[at] || '').join(' | ')} |`;
  return [line(rows[0]), `|${' --- |'.repeat(width)}`, ...rows.slice(1).map(line)].join('\n');
}

export function slideMarkdown(xml, number) {
  let title = '';
  const blocks = [];
  // Shapes, tables, and pictures in document order.
  all(xml, /<p:sp\b[\s\S]*?<\/p:sp>|<p:graphicFrame\b[\s\S]*?<\/p:graphicFrame>|<p:pic\b[\s\S]*?<\/p:pic>/g).forEach(([shape]) => {
    if (shape.startsWith('<p:pic')) { blocks.push('*🖼️ Image in original slide.*'); return; }
    if (shape.startsWith('<p:graphicFrame')) { const markdown = table(shape); if (markdown) blocks.push(markdown); return; }
    const placeholder = (shape.match(/<p:ph\b[^>]*type="([^"]+)"/) || [])[1] || '';
    const paragraphs = all(shape, /<a:p\b[\s\S]*?<\/a:p>/g).map(([paragraph]) => ({
      text: paragraphText(paragraph),
      level: Number((paragraph.match(/<a:pPr\b[^>]*\blvl="(\d)"/) || [])[1] || 0),
      bullet: /<a:bu(Char|AutoNum)\b/.test(paragraph),
      numbered: /<a:buAutoNum\b/.test(paragraph),
      noBullet: /<a:buNone\/>/.test(paragraph),
    })).filter((paragraph) => paragraph.text);
    if (!paragraphs.length) return;
    if (!title && /title|ctrTitle/.test(placeholder)) { title = paragraphs.map((p) => p.text).join(' '); return; }
    // Body placeholders bullet by default; plain text boxes don't, unless they say so.
    const listy = placeholder === 'body' || placeholder === '' && /<p:ph\b/.test(shape);
    const lines = paragraphs.map((paragraph) => {
      // The site's renderer doesn't nest lists, so a sub-bullet becomes "- ↳ text".
      const sub = '↳ '.repeat(paragraph.level);
      if (paragraph.numbered && !paragraph.level) return `1. ${paragraph.text}`;
      if (paragraph.bullet || (listy && !paragraph.noBullet) || paragraph.level > 0) return `- ${sub}${paragraph.text}`;
      return paragraph.text;
    });
    // Plain paragraphs need a blank line between them; list items stay together.
    blocks.push(lines.reduce((text, line, at) => {
      if (!at) return line;
      const isItem = /^\s*(-|\d+\.)\s/.test(line);
      const wasItem = /^\s*(-|\d+\.)\s/.test(lines[at - 1]);
      return `${text}${isItem && wasItem ? '\n' : '\n\n'}${line}`;
    }, ''));
  });
  return `### Slide ${number}: ${title || '(untitled)'}\n\n${blocks.join('\n\n')}`.trim();
}

export function deckMarkdown(files, name, { from = 1, to = Infinity } = {}) {
  const presentation = files.get('ppt/presentation.xml');
  const rels = files.get('ppt/_rels/presentation.xml.rels');
  if (!presentation || !rels) throw new Error('No ppt/presentation.xml: not a PowerPoint file?');
  const targets = Object.fromEntries(all(rels(), /<Relationship\b[^>]*\bId="([^"]+)"[^>]*\bTarget="([^"]+)"/g).map((match) => [match[1], match[2]]));
  // Slide order is presentation.xml's list, not the file names.
  const order = all(presentation(), /<p:sldId\b[^>]*\br:id="([^"]+)"/g).map((match) => `ppt/${targets[match[1]].replace(/^\/?ppt\//, '')}`);
  const today = new Date().toISOString().slice(0, 10);
  const slides = order
    .map((path, at) => ({ path, number: at + 1 }))
    .filter(({ number }) => number >= from && number <= to)
    .map(({ path, number }) => slideMarkdown(files.get(path)(), number));
  return `> 📽️ **From the class slides** (*${name}*, slides ${Math.max(from, 1)}–${Math.min(to, order.length)}). Converted ${today} by
> \`tools/pptx-to-lecture.mjs\`: slide order and wording kept; images aren't reproduced.
> **Redacted for this public site:** [list what you removed: student names, access codes, Drive/form links].

## 🎤 Lecture: [title]

${slides.join('\n\n')}
`;
}

if (process.argv[1] && process.argv[1].endsWith('pptx-to-lecture.mjs')) {
  const args = process.argv.slice(2);
  const file = args.find((arg) => !arg.startsWith('--') && !/^\d+$/.test(arg));
  const option = (flag) => { const at = args.indexOf(flag); return at >= 0 ? Number(args[at + 1]) : undefined; };
  if (!file) {
    console.error('usage: node tools/pptx-to-lecture.mjs deck.pptx [--from N] [--to N] > content/lectures/<id>.md');
    process.exit(1);
  }
  process.stdout.write(deckMarkdown(unzip(readFileSync(file)), basename(file), { from: option('--from') || 1, to: option('--to') || Infinity }));
  console.error('Converted. Now: read it end to end, redact names/codes/links, fill in the header and ## title,\nadd the lecture to data/lectures.json, copy a lectures/<id>/index.html shell, and run the checks.');
}
