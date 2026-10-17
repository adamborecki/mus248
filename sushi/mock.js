// The demo kitchen (/sushi/?demo=1): the REAL backend (backend/Code.gs) running in this browser
// against a fake Sheet, saved in localStorage. Same contract, same rules, same privacy filter as
// live. Only the storage is fake.
//
// It can also misbehave on purpose (Demo tools), so the "never claim success you can't confirm"
// paths can be seen and tested without a real outage.

import { loadBackend } from './fake-google.js';
import { otherDinerClaim, seedDemo } from './demo-data.js';
import { UnreadableReply } from './client.js';

const STATE_KEY = 'sushi.demo.kitchen';
const STATE_VERSION = 1;

export async function createDemoTransport({ store, latency = [250, 650] } = {}) {
  const response = await fetch(new URL('./backend/Code.gs', import.meta.url), { cache: 'no-store' });
  if (!response.ok) throw new Error('Couldn\'t load the demo kitchen.');
  const source = await response.text();

  let kitchen;
  const boot = (fresh) => {
    const saved = fresh ? null : store.get(STATE_KEY, null);
    const usable = saved && saved.v === STATE_VERSION ? saved : null;
    kitchen = loadBackend(source, { state: usable && usable.sheet });
    if (!usable) {
      kitchen.backend.setupSushi();
      seedDemo(kitchen.backend);
      save();
    }
  };
  const save = () => store.set(STATE_KEY, { v: STATE_VERSION, sheet: kitchen.google.serialize() });
  boot(false);

  const faults = { next: null, offline: false };
  const wait = () => new Promise((resolve) => setTimeout(resolve, latency[0] + Math.random() * (latency[1] - latency[0])));
  const unreachable = () => new TypeError('Failed to fetch');
  const post = (body) => JSON.parse(kitchen.backend.doPost({ postData: { contents: JSON.stringify(body), type: 'text/plain' } }).getContent());
  const tasksWhere = (status) => kitchen.backend.table_('Tasks').rows.filter((t) => String(t.status) === status && String(t.active) !== 'no');

  return {
    kind: 'demo',
    readMode: 'demo',
    faults,

    async get(params) {
      await wait();
      if (faults.offline) throw unreachable();
      const out = JSON.parse(kitchen.backend.doGet({ parameter: params }).getContent());
      save();
      return out;
    },

    async post(body) {
      await wait();
      if (faults.offline) throw unreachable();
      const fault = faults.next;
      faults.next = null;
      if (fault === 'drop') throw unreachable();          // never reached the kitchen
      const out = post(body);
      save();
      if (fault === 'lose-reply') throw new UnreadableReply(); // reached it, but the answer was lost
      return out;
    },

    // ---- Demo tools: what other phones and Adam would do ----
    someoneTakesOne(taskId) {
      const open = tasksWhere('available').filter((t) => !taskId || String(t.task_id) === taskId);
      if (!open.length) return null;
      const t = open[Math.floor(Math.random() * open.length)];
      post(otherDinerClaim(String(t.task_id)));
      save();
      return String(t.public_title);
    },
    adamVerifiesAll() {
      const waiting = tasksWhere('submitted');
      waiting.forEach((t) => kitchen.backend.adminAction_(String(t.task_id), 'verify', 'demo'));
      save();
      return waiting.length;
    },
    adamClearsMine(taskIds) {
      const held = kitchen.backend.table_('Tasks').rows.filter((t) => taskIds.includes(String(t.task_id))
        && ['claimed', 'help_requested', 'submitted'].includes(String(t.status)));
      held.forEach((t) => kitchen.backend.adminAction_(String(t.task_id), 'clear', 'demo'));
      save();
      return held.length;
    },
    reset() { store.remove(STATE_KEY); boot(true); },
    get backend() { return kitchen.backend; },
    save,
  };
}
