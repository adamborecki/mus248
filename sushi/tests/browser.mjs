// Sushi in a real browser: the demo kitchen driven end to end with Playwright.
//
//   node sushi/tests/browser.mjs            (needs Playwright + Chromium; skips cleanly without them)
//   SUSHI_SHOTS=/some/dir node sushi/tests/browser.mjs   also saves screenshots there
//
// The site is served from a deep path (/mus248/branch/sushi-test/), like a branch preview, so a
// stray absolute URL fails here. Not part of CI (no browser there); run it after UI changes.

import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, dirname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const PREFIX = '/mus248/branch/sushi-test/';
const shots = process.env.SUSHI_SHOTS || '';

let playwright;
for (const candidate of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) {
  try { playwright = await import(candidate); break; } catch { /* try the next */ }
}
if (!playwright) { console.log('skip: Playwright is not installed'); process.exit(0); }
const executablePath = [process.env.SUSHI_CHROMIUM, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => p && existsSync(p));

const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.json': 'application/json', '.gs': 'application/octet-stream' };
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (!url.pathname.startsWith(PREFIX)) { res.writeHead(404); res.end(); return; }
  let path = normalize(join(root, decodeURIComponent(url.pathname.slice(PREFIX.length))));
  if (!path.startsWith(root)) { res.writeHead(403); res.end(); return; }
  if (existsSync(path) && statSync(path).isDirectory()) path = join(path, 'index.html');
  if (!existsSync(path)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': TYPES[extname(path)] || 'application/octet-stream' });
  res.end(readFileSync(path));
});
await new Promise((resolve) => server.listen(0, resolve));
const base = `http://localhost:${server.address().port}${PREFIX}`;

const browser = await playwright.chromium.launch(executablePath ? { executablePath } : {});
let failures = 0;
async function step(name, fn) {
  try { await fn(); console.log(`ok    ${name}`); } catch (error) { failures += 1; console.error(`FAIL  ${name}\n${error.stack}`); }
}
const shot = async (page, name, fullPage = false) => { if (shots) await page.screenshot({ path: join(shots, `${name}.png`), fullPage }); };

const PHONE = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

// Page helpers -----------------------------------------------------------------
const card = (page, title, where = '#belt-list') => page.locator(`${where} .plate-open`, { hasText: title }).first();
const toastSays = (page, re) => page.waitForFunction((src) => new RegExp(src).test(document.querySelector('#toast').textContent)
  && !document.querySelector('#toast').hidden, re.source, { timeout: 15000 });
const idOf = (page, title) => page.evaluate((t) => window.sushiDemo.transport.backend.table_('Tasks').rows.find((r) => r.public_title === t).task_id, title);
const statusOf = (page, title) => page.evaluate((t) => String(window.sushiDemo.transport.backend.table_('Tasks').rows.find((r) => r.public_title === t).status), title);
const settle = (page) => page.waitForFunction(() => !document.querySelector('#refresh').disabled && !document.querySelector('#task-dialog .button[disabled][data-action^="confirm"], #task-dialog .button[disabled][data-action^="submit"]'));
async function openPlate(page, title, where) {
  await card(page, title, where).click();
  await page.waitForSelector('#task-dialog[open]');
  await page.waitForFunction((t) => document.querySelector('#task-dialog-title')?.textContent === t, title);
}
async function take(page, title) {
  await openPlate(page, title);
  await page.click('#task-dialog [data-action="take"]');
  await page.click('#task-dialog [data-action="confirm-take"]');
}

// ------------------------------------------------------------------------------

const config = readFileSync(join(root, 'sushi', 'config.js'), 'utf8');
if (/apiUrl:\s*''/.test(config)) {
  await step('not connected: says so, and offers the demo instead of fake work', async () => {
    const page = await browser.newPage();
    await page.goto(`${base}sushi/`);
    await page.waitForSelector('.closed-card');
    assert.match(await page.textContent('.closed-card'), /kitchen opens soon/i);
    assert.equal(await page.getAttribute('.closed-card a', 'href'), '?demo=1');
    await page.close();
  });
}

await step('home page links to Sushi with a relative URL', async () => {
  const page = await browser.newPage();
  await page.goto(base);
  await page.click('a.ops-card');
  await page.waitForURL(/\/mus248\/branch\/sushi-test\/sushi\/$/);
  await page.close();
});

const ctx = await browser.newContext(PHONE);
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });

await step('demo loads on a phone with no sideways scroll', async () => {
  await page.goto(`${base}sushi/?demo=1`);
  await page.waitForSelector('#belt-list .plate-open');
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  assert.ok(width <= 390, `page is ${width}px wide`);
  assert.ok(await page.isVisible('#welcome'));
  await shot(page, 'phone-belt', true);
});

await step('first use: name and work mode are asked once and survive a reload', async () => {
  await page.click('#welcome [data-action="open-profile"]');
  await page.fill('#profile-form [name=name]', 'Browser Tester');
  await page.check('#profile-form [name=mode][value="MUS 248"]', { force: true });
  await page.click('#profile-form button[type=submit]');
  await page.waitForFunction(() => document.querySelector('#profile-label').textContent.includes('Browser Tester'));
  await page.reload();
  await page.waitForSelector('#belt-list .plate-open');
  assert.equal(await page.textContent('#profile-label'), 'Browser Tester · MUS 248');
  assert.equal(await page.isVisible('#welcome'), false);
});

await step('opening a plate never claims it', async () => {
  await openPlate(page, 'Clear the SD cards for Saturday');
  await shot(page, 'phone-details');
  assert.equal(await statusOf(page, 'Clear the SD cards for Saturday'), 'available');
  await page.click('#task-dialog [data-action="close-task"]');
});

await step('take → My Table, with one claim even after a double tap', async () => {
  const title = 'Wipe down the OH B01 keyboards';
  await openPlate(page, title);
  await page.click('#task-dialog [data-action="take"]');
  assert.match(await page.textContent('#task-dialog .confirm'), /Browser Tester/);
  await page.dblclick('#task-dialog [data-action="confirm-take"]');
  await toastSays(page, /on your table/);
  await settle(page);
  const id = await idOf(page, title);
  const claims = await page.evaluate((i) => window.sushiDemo.transport.backend.table_('Events').rows.filter((e) => e.task_id === i && e.event_type === 'claim').length, id);
  assert.equal(claims, 1);
  assert.ok(await card(page, title, '#table-list').isVisible());
});

await step('call the chef → unstuck → finished eating (self-cleared)', async () => {
  const title = 'Wipe down the OH B01 keyboards';
  await page.click('#task-dialog [data-action="call-chef"]');
  await page.fill('#task-note', 'Out of wipes');
  await page.click('#task-dialog [data-action="submit-help"]');
  await toastSays(page, /chef has been called/);
  await settle(page);
  assert.match(await page.textContent('#task-dialog .sheet-status'), /Chef called/);
  await page.click('#task-dialog [data-action="resume"]');
  await toastSays(page, /Back at it/);
  await settle(page);
  await page.click('#task-dialog [data-action="finish"]');
  await page.click('#task-dialog [data-action="submit-finish"]');
  await toastSays(page, /Cleared/);
  await settle(page);
  await page.click('#task-dialog [data-action="close-task"]');
  assert.equal(await statusOf(page, title), 'completed');
  assert.equal(await card(page, title, '#table-list').count(), 0);
  await page.click('#history-section summary');
  assert.match(await page.textContent('#my-history'), /Wipe down the OH B01 keyboards/);
  await page.click('#history-section summary');
});

await step('admin-verified plate: a required note, waiting for Adam, then cleared', async () => {
  const title = 'Salmon recording: data transfer';
  await take(page, title);
  await toastSays(page, /on your table/);
  await settle(page);
  await page.click('#task-dialog [data-action="finish"]');
  await page.click('#task-dialog [data-action="submit-finish"]');
  assert.match(await page.textContent('#task-dialog .form-error'), /needs a short note/);
  assert.equal(await statusOf(page, title), 'claimed');
  await page.fill('#task-note', 'All files copied; counts match.');
  await page.click('#task-dialog [data-action="submit-finish"]');
  await toastSays(page, /Sent to Adam/);
  await settle(page);
  await page.click('#task-dialog [data-action="close-task"]');
  assert.match(await card(page, title, '#table-list').textContent(), /Waiting for Adam/);
  await page.evaluate(() => { window.sushiDemo.transport.adamVerifiesAll(); return window.sushiDemo.refresh(); });
  await toastSays(page, /Adam cleared/);
  assert.equal(await card(page, title, '#table-list').count(), 0);
});

await step('put it back: the plate returns to the belt', async () => {
  const title = 'Straighten the cable storage';
  await take(page, title);
  await toastSays(page, /on your table/);
  await settle(page);
  await page.click('#task-dialog [data-action="put-back"]');
  await page.click('#task-dialog [data-action="confirm-release"]');
  await toastSays(page, /Back on the belt/);
  await settle(page);
  await page.click('#task-dialog [data-action="close-task"]');
  assert.equal(await statusOf(page, title), 'available');
  assert.ok(await card(page, title).isVisible());
});

await step('losing a race says so and leaves nothing at my table', async () => {
  const title = 'Check the batteries in the demo mic kit';
  await openPlate(page, title);
  await page.click('#task-dialog [data-action="take"]');
  const id = await idOf(page, title);
  await page.evaluate((i) => window.sushiDemo.transport.someoneTakesOne(i), id);
  await page.click('#task-dialog [data-action="confirm-take"]');
  await page.waitForSelector('#task-dialog .form-error:has-text("Someone else just took this plate")');
  await settle(page);
  await page.click('#task-dialog [data-action="close-task"]');
  assert.equal(await card(page, title, '#table-list').count(), 0);
  assert.equal(await card(page, title).count(), 0, 'gone from the belt');
});

await step('a lost reply is confirmed by receipt; a dropped request is never called success', async () => {
  await page.evaluate(() => { window.sushiDemo.transport.faults.next = 'lose-reply'; });
  await take(page, 'QC an exported concert video');
  await toastSays(page, /on your table/);
  await settle(page);
  await page.click('#task-dialog [data-action="close-task"]');
  assert.ok(await card(page, 'QC an exported concert video', '#table-list').isVisible());

  const title = 'Reset the Salmon booth after the weekend';
  await page.evaluate(() => { window.sushiDemo.transport.faults.next = 'drop'; });
  await take(page, title);
  await toastSays(page, /Couldn't confirm/);
  await settle(page);
  assert.match(await page.textContent('#task-dialog .form-error'), /Couldn't confirm/);
  assert.equal(await statusOf(page, title), 'available');
  await page.click('#task-dialog [data-action="close-task"]');
  assert.equal(await card(page, title, '#table-list').count(), 0);
});

await step('offline: stale banner, cached belt, actions paused', async () => {
  await page.evaluate(() => { window.sushiDemo.transport.faults.offline = true; return window.sushiDemo.refresh(); });
  await page.waitForSelector('.banner.warn');
  assert.match(await page.textContent('.banner.warn'), /Couldn't reach the kitchen/);
  assert.ok(await page.locator('#belt-list .plate-open').count() > 0, 'cached plates still shown');
  await openPlate(page, 'Clear the SD cards for Saturday');
  assert.ok(await page.isDisabled('#task-dialog [data-action="take"]'));
  await shot(page, 'phone-offline');
  await page.click('#task-dialog [data-action="close-task"]');
  await page.evaluate(() => { window.sushiDemo.transport.faults.offline = false; return window.sushiDemo.refresh(); });
  await page.waitForSelector('.banner.warn', { state: 'detached' });
});

await step('sheet text is shown as text, never run as HTML', async () => {
  await page.evaluate(() => {
    const { backend, save } = window.sushiDemo.transport;
    const t = backend.table_('Tasks');
    backend.appendObject_(t, { task_id: 'S-XSS01', active: 'yes', status: 'available', public_title: '<img src=x onerror="window.__pwned=1">', public_location: 'OH B01', category: 'Maintenance', effort_size: 'small' });
    window.sushiDemo.transport.backend.adminAction_('S-XSS01', 'enable');
    save();
    return window.sushiDemo.refresh();
  });
  await page.waitForSelector('#belt-list .plate-open:has-text("<img")');
  assert.equal(await page.evaluate(() => window.__pwned), undefined);
});

await step('the feed the page reads never carries names or notes', async () => {
  const json = await page.evaluate(async () => JSON.stringify(await window.sushiDemo.transport.get({ action: 'list' })));
  assert.doesNotMatch(json, /Browser Tester|Demo diner|All files copied|Out of wipes|private context/i);
});

await step('a #task link opens that plate', async () => {
  const id = await idOf(page, 'Clear the SD cards for Saturday');
  await page.goto(`${base}sushi/?demo=1#${id}`);
  await page.waitForSelector('#task-dialog[open]');
  assert.equal(await page.textContent('#task-dialog-title'), 'Clear the SD cards for Saturday');
});

await step('no console errors on the phone run', async () => { assert.deepEqual(errors, []); });
await ctx.close();

await step('taking a plate before adding a name asks for the name, then returns to the confirmation', async () => {
  const fresh = await browser.newPage(PHONE);
  await fresh.goto(`${base}sushi/?demo=1`);
  await fresh.waitForSelector('#belt-list .plate-open');
  await openPlate(fresh, 'Clear the SD cards for Saturday');
  await fresh.click('#task-dialog [data-action="take"]');
  await fresh.waitForSelector('#profile-dialog[open]');
  await fresh.fill('#profile-form [name=name]', 'Late Namer');
  await fresh.check('#profile-form [name=mode][value="Student employee"]', { force: true });
  await fresh.click('#profile-form button[type=submit]');
  await fresh.waitForSelector('#task-dialog .confirm');
  assert.match(await fresh.textContent('#task-dialog .confirm'), /Late Namer.*Student employee/s);
  assert.equal(await statusOf(fresh, 'Clear the SD cards for Saturday'), 'available', 'still not taken until confirmed');
  await fresh.close();
});

await step('desktop: the belt is a horizontal conveyor with scroll buttons', async () => {
  const desk = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await desk.goto(`${base}sushi/?demo=1`);
  await desk.waitForSelector('#belt-list .plate-open');
  assert.equal(await desk.evaluate(() => getComputedStyle(document.querySelector('#belt-list')).overflowX), 'auto');
  await desk.waitForSelector('.belt-nudge.next:not([hidden])');
  assert.notEqual(await desk.evaluate(() => getComputedStyle(document.querySelector('.belt')).animationName), 'none');
  await shot(desk, 'desktop');
  await desk.close();
});

await step('reduced motion: the belt stands still', async () => {
  const calm = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
  await calm.goto(`${base}sushi/?demo=1`);
  await calm.waitForSelector('#belt-list .plate-open');
  assert.equal(await calm.evaluate(() => getComputedStyle(document.querySelector('.belt')).animationName), 'none');
  await calm.close();
});

await browser.close();
server.close();
if (failures) { console.error(`\n${failures} browser check(s) failed`); process.exit(1); }
console.log('\nAll Sushi browser checks passed');
