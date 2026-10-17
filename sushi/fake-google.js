// Fake Google Apps Script services: just enough of SpreadsheetApp, LockService, CacheService,
// PropertiesService, ContentService, Utilities, Session, and MailApp to run
// sushi/backend/Code.gs unchanged, outside Google.
//
// Used by:
//   sushi/tests/run.mjs  the backend tests, in Node
//   sushi/mock.js        the browser demo (?demo=1), which is the real Code.gs over a fake Sheet
//
// It models data, not formatting: any formatting call (setBackground, setDataValidation…) is
// accepted and ignored. If Code.gs starts calling a data method this file doesn't have, the tests
// fail loudly, which is the point.

/** Runs Code.gs source against fresh fakes and returns its global functions. */
export function loadBackend(source, options = {}) {
  const google = createFakeGoogle(options);
  const names = Object.keys(google.globals);
  const exported = ['doGet', 'doPost', 'setupSushi', 'adminAction_', 'runUpkeep', 'ensureRecurringTasks_',
    'publicFeed_', 'privacyReport_', 'table_', 'appendObject_', 'newId_', 'PUBLIC_TASK_KEYS', 'TASK_COLUMNS',
    'TEMPLATE_COLUMNS', 'recurrenceWindow_', 'secretHash_', 'onEdit'];
  // Code.gs reads the clock through now_(); the wrapper lets a test or the demo move time.
  const wrapped = `${source}\n;now_ = function () { return __clock(); };\nreturn { ${exported.map((n) => `${n}: typeof ${n} === 'undefined' ? undefined : ${n}`).join(', ')} };`;
  // eslint-disable-next-line no-new-func
  const backend = new Function(...names, '__clock', wrapped)(...names.map((n) => google.globals[n]), () => google.clock());
  return { backend, google };
}

export function createFakeGoogle({ timeZone = 'America/Los_Angeles', now = () => new Date(), state = null, scriptProperties = {} } = {}) {
  let clock = now;
  const spreadsheet = new FakeSpreadsheet(state);
  const props = { ...scriptProperties };
  const cacheStore = new Map();
  const mail = [];
  const lock = { held: false, heldElsewhere: false };
  let mailQuota = 100;
  let mailFails = false;

  const cache = {
    get(key) {
      const hit = cacheStore.get(key);
      if (!hit) return null;
      if (hit.expires <= clock().getTime()) { cacheStore.delete(key); return null; }
      return hit.value;
    },
    put(key, value, seconds = 600) { cacheStore.set(key, { value: String(value), expires: clock().getTime() + seconds * 1000 }); },
    remove(key) { cacheStore.delete(key); },
  };

  const chain = () => new Proxy(function chained() {}, { get: (target, key) => (key === 'build' ? () => ({}) : () => chain()) });

  const globals = {
    SpreadsheetApp: {
      getActiveSpreadsheet: () => spreadsheet,
      openById: () => spreadsheet,
      getUi: () => { throw new Error('No UI in the fake'); },
      newDataValidation: chain,
      newConditionalFormatRule: chain,
      ProtectionType: { SHEET: 'SHEET', RANGE: 'RANGE' },
    },
    LockService: {
      getScriptLock: () => ({
        tryLock() { if (lock.held || lock.heldElsewhere) return false; lock.held = true; return true; },
        waitLock() { if (!this.tryLock()) throw new Error('Lock timeout'); },
        releaseLock() { lock.held = false; },
        hasLock() { return lock.held; },
      }),
    },
    CacheService: { getScriptCache: () => cache },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (key) => (key in props ? props[key] : null),
        setProperty(key, value) { props[key] = String(value); return this; },
        deleteProperty(key) { delete props[key]; return this; },
        getProperties: () => ({ ...props }),
      }),
    },
    ContentService: {
      MimeType: { JSON: 'application/json', JAVASCRIPT: 'application/javascript', TEXT: 'text/plain' },
      createTextOutput: (content) => ({
        content, mimeType: 'text/plain',
        setMimeType(type) { this.mimeType = type; return this; },
        getContent() { return this.content; },
        getMimeType() { return this.mimeType; },
      }),
    },
    HtmlService: { createHtmlOutput: () => chain() },
    ScriptApp: { getProjectTriggers: () => [], newTrigger: () => chain() },
    Utilities: {
      DigestAlgorithm: { SHA_256: 'SHA_256' },
      Charset: { UTF_8: 'UTF_8' },
      getUuid: () => uuid(),
      // Apps Script returns signed bytes (-128..127). Code.gs has to cope with that, so we do it too.
      computeDigest: (algorithm, text) => sha256Bytes(String(text)).map((b) => (b > 127 ? b - 256 : b)),
      formatDate: (date, tz, pattern) => formatDate(date, tz, pattern),
      sleep: () => {},
    },
    Session: { getScriptTimeZone: () => timeZone },
    MailApp: {
      getRemainingDailyQuota: () => mailQuota,
      sendEmail(message) { if (mailFails) throw new Error('Mail service down'); mailQuota -= 1; mail.push(message); },
    },
    console,
  };

  return {
    globals,
    spreadsheet,
    props,
    mail,
    cache,
    lock,
    clock: () => clock(),
    setClock(fn) { clock = fn; },
    setMailFails(value) { mailFails = value; },
    serialize: () => spreadsheet.serialize(),
  };
}

// ---------------------------------------------------------------------------
// Spreadsheet model: plain 2-D arrays, one per sheet.
// ---------------------------------------------------------------------------

class FakeSpreadsheet {
  constructor(state) {
    this.sheets = [];
    if (state) state.sheets.forEach((s) => { const sheet = this.insertSheet(s.name); sheet.data = s.data.map((row) => row.map(revive)); });
  }
  getId() { return 'fake-spreadsheet'; }
  getUrl() { return 'https://example.invalid/fake-sushi-sheet'; }
  getSheetByName(name) { return this.sheets.find((s) => s.name === name) || null; }
  getSheets() { return [...this.sheets]; }
  insertSheet(name, index) {
    if (this.getSheetByName(name)) throw new Error(`A sheet named ${name} already exists`);
    const sheet = withFormattingNoops(new FakeSheet(this, name));
    if (index === undefined) this.sheets.push(sheet); else this.sheets.splice(index, 0, sheet);
    return sheet;
  }
  getActiveSheet() { return this.activeSheet || this.sheets[0] || null; }
  serialize() { return { sheets: this.sheets.map((s) => ({ name: s.name, data: s.data.map((row) => row.map(freeze)) })) }; }
}

class FakeSheet {
  constructor(book, name) { this.book = book; this.name = name; this.data = []; this.protections = []; }
  getName() { return this.name; }
  getLastRow() {
    for (let r = this.data.length - 1; r >= 0; r -= 1) if (this.data[r].some((v) => v !== '' && v !== null && v !== undefined)) return r + 1;
    return 0;
  }
  getLastColumn() { return this.data.reduce((max, row) => { let c = row.length; while (c > 0 && (row[c - 1] === '' || row[c - 1] == null)) c -= 1; return Math.max(max, c); }, 0); }
  getMaxRows() { return Math.max(1000, this.data.length); }
  getMaxColumns() { return Math.max(26, this.getLastColumn()); }
  getRange(row, col, numRows = 1, numCols = 1) {
    if (!(row >= 1 && col >= 1 && numRows >= 1 && numCols >= 1)) throw new Error(`Bad range ${row},${col},${numRows},${numCols}`);
    return withFormattingNoops(new FakeRange(this, row, col, numRows, numCols));
  }
  getDataRange() { return this.getRange(1, 1, Math.max(1, this.getLastRow()), Math.max(1, this.getLastColumn())); }
  appendRow(values) {
    const r = this.getLastRow();
    this.data.length = r;
    this.data.push([...values]);
    return this;
  }
  getFilter() { return null; }
  getProtections() { return this.protections; }
  protect() { const p = withFormattingNoops({}); this.protections.push(p); return p; }
  // Test helpers (not Apps Script API).
  cell(row, col) { return (this.data[row - 1] || [])[col - 1]; }
}

class FakeRange {
  constructor(sheet, row, col, numRows, numCols) { Object.assign(this, { sheet, row, col, numRows, numCols }); }
  getRow() { return this.row; }
  getValues() {
    const out = [];
    for (let r = 0; r < this.numRows; r += 1) {
      const src = this.sheet.data[this.row - 1 + r] || [];
      const line = [];
      for (let c = 0; c < this.numCols; c += 1) { const v = src[this.col - 1 + c]; line.push(v === undefined || v === null ? '' : v); }
      out.push(line);
    }
    return out;
  }
  getValue() { return this.getValues()[0][0]; }
  setValues(values) {
    if (values.length !== this.numRows || values.some((row) => row.length !== this.numCols)) throw new Error('setValues: dimensions do not match the range');
    values.forEach((row, r) => row.forEach((v, c) => this.write(this.row + r, this.col + c, v)));
    return this;
  }
  setValue(value) {
    for (let r = 0; r < this.numRows; r += 1) for (let c = 0; c < this.numCols; c += 1) this.write(this.row + r, this.col + c, value);
    return this;
  }
  write(row, col, value) {
    // Real Sheets turns a string starting with "=" into a formula. Code.gs must never let that
    // happen with typed text; this makes the mistake visible in tests.
    if (typeof value === 'string' && value.startsWith('=')) throw new Error(`Formula written to ${this.sheet.name}!R${row}C${col}: ${value}`);
    while (this.sheet.data.length < row) this.sheet.data.push([]);
    const line = this.sheet.data[row - 1];
    while (line.length < col) line.push('');
    line[col - 1] = value instanceof Date ? new Date(value.getTime()) : value;
  }
}

/** Any method the real API has but this fake doesn't model returns the object itself, for chaining. */
function withFormattingNoops(target) {
  return new Proxy(target, {
    get(obj, key, receiver) {
      if (key in obj) {
        const value = Reflect.get(obj, key, receiver);
        return typeof value === 'function' ? value.bind(receiver) : value;
      }
      if (typeof key === 'symbol' || key === 'then' || key === 'toJSON') return undefined;
      return () => receiver;
    },
  });
}

const freeze = (v) => (v instanceof Date ? { $date: v.toISOString() } : v);
const revive = (v) => (v && typeof v === 'object' && '$date' in v ? new Date(v.$date) : v);

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

export function uuid() {
  if (globalThis.crypto && globalThis.crypto.randomUUID) return globalThis.crypto.randomUUID();
  const b = new Uint8Array(16);
  globalThis.crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40; b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** The subset of Utilities.formatDate patterns Code.gs uses: yyyy MM dd HH mm ss u Z, plus quoted text. */
export function formatDate(date, timeZone, pattern) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'short',
  }).formatToParts(date).map((p) => [p.type, p.value]));
  const local = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour % 24, +parts.minute, +parts.second);
  const offset = Math.round((local - Math.floor(date.getTime() / 1000) * 1000) / 60000);
  const sign = offset < 0 ? '-' : '+';
  const abs = Math.abs(offset);
  const tokens = {
    yyyy: parts.year, MM: parts.month, dd: parts.day, HH: String(+parts.hour % 24).padStart(2, '0'), mm: parts.minute, ss: parts.second,
    u: String(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(parts.weekday) + 1),
    Z: `${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}${String(abs % 60).padStart(2, '0')}`,
  };
  return pattern.replace(/'[^']*'|yyyy|MM|dd|HH|mm|ss|u|Z/g, (t) => (t.startsWith("'") ? t.slice(1, -1) : tokens[t]));
}

/** Synchronous SHA-256 (Apps Script's computeDigest is synchronous; WebCrypto is not). Returns 0..255 bytes. */
export function sha256Bytes(text) {
  const bytes = [...new TextEncoder().encode(text)];
  const K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01,
    0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f,
    0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70,
    0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
    0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  const H = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const bitLength = bytes.length * 8;
  bytes.push(0x80);
  while (bytes.length % 64 !== 56) bytes.push(0);
  for (let i = 7; i >= 0; i -= 1) bytes.push(i >= 4 ? 0 : (bitLength >>> (i * 8)) & 0xff);
  const rotr = (x, n) => (x >>> n) | (x << (32 - n));
  const w = new Array(64);
  for (let off = 0; off < bytes.length; off += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = (bytes[off + i * 4] << 24) | (bytes[off + i * 4 + 1] << 16) | (bytes[off + i * 4 + 2] << 8) | bytes[off + i * 4 + 3];
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) | 0;
    }
    let [a, b, c, d, e, f, g, h] = H;
    for (let i = 0; i < 64; i += 1) {
      const t1 = (h + (rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)) + ((e & f) ^ (~e & g)) + K[i] + w[i]) | 0;
      const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
      h = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
    }
    [a, b, c, d, e, f, g, h].forEach((v, i) => { H[i] = (H[i] + v) | 0; });
  }
  return H.flatMap((v) => [(v >>> 24) & 0xff, (v >>> 16) & 0xff, (v >>> 8) & 0xff, v & 0xff]);
}
