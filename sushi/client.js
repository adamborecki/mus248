// The Sushi client: talks to a transport (live Apps Script or the demo kitchen), remembers this
// browser's claims, and never reports success it can't confirm.
//
// A transport has:
//   get(params)     → Promise<object>  a public read (list, receipt). Throws if unreachable.
//   post(body)      → Promise<object>  a mutation. Throws UnreadableReply when the request may
//                                      have arrived but the reply couldn't be read (CORS, a dropped
//                                      connection). The client then asks for the request's receipt.
//   postBlind(body) → Promise<void>    optional: resend without needing a readable reply. Safe
//                                      because the backend applies each request_id at most once.

import { newId, newSecret, reconcileClaims } from './logic.js';

export class UnreadableReply extends Error {
  constructor(message = 'The kitchen did not answer in a way this page could read.') { super(message); this.name = 'UnreadableReply'; }
}

const UNCONFIRMED = {
  ok: false,
  code: 'unconfirmed',
  message: 'Couldn\'t confirm that with the kitchen. Nothing has been marked as done on this screen; the belt will update when the kitchen answers.',
};

/** localStorage, wrapped: private windows and blocked storage must not break the page. */
export function createStore(storage = globalThis.localStorage) {
  return {
    get(key, fallback) {
      try { const raw = storage.getItem(key); return raw === null ? fallback : JSON.parse(raw); } catch { return fallback; }
    },
    set(key, value) { try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } },
    remove(key) { try { storage.removeItem(key); } catch { /* ignore */ } },
  };
}

export class SushiClient {
  /**
   * namespace keeps demo and live data apart ("demo" / "live"). The profile is shared: it is the
   * same person either way.
   */
  constructor({ transport, store, namespace, confirmDelays = [700, 1500, 3000], sleep }) {
    this.transport = transport;
    this.store = store;
    this.ns = namespace;
    this.confirmDelays = confirmDelays;
    this.sleep = sleep || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    this.inFlight = new Set();
  }

  key(name) { return `sushi.${this.ns}.${name}`; }

  get profile() { return this.store.get('sushi.profile', null); }
  set profile(value) { if (value) this.store.set('sushi.profile', value); else this.store.remove('sushi.profile'); }

  get claims() { return this.store.get(this.key('claims'), {}); }
  set claims(value) { this.store.set(this.key('claims'), value); }

  get history() { return this.store.get(this.key('history'), []); }
  addHistory(entries) {
    const list = this.history;
    entries.forEach((entry) => { if (!list.some((h) => h.id === entry.id && h.at === entry.at)) list.unshift(entry); });
    this.store.set(this.key('history'), list.slice(0, 40));
  }

  get cached() { return this.store.get(this.key('cache'), null); }

  /**
   * Reads the belt. On success, caches it and reconciles this browser's claims. On failure,
   * returns the cached copy marked stale (or nothing) and never touches claims.
   */
  async refresh() {
    let feed;
    try {
      feed = await this.transport.get({ action: 'list' });
    } catch (error) {
      const cached = this.cached;
      return { ok: false, stale: true, feed: cached ? cached.feed : null, fetchedAt: cached ? cached.at : null, error: error.message || String(error) };
    }
    if (!feed || feed.ok !== true || !Array.isArray(feed.tasks)) {
      const cached = this.cached;
      return { ok: false, stale: true, feed: cached ? cached.feed : null, fetchedAt: cached ? cached.at : null,
        error: (feed && feed.message) || 'The kitchen sent something this page doesn\'t understand.', code: feed && feed.code };
    }
    const at = new Date().toISOString();
    this.store.set(this.key('cache'), { feed, at });
    const result = reconcileClaims(this.claims, feed.tasks, Date.now());
    this.claims = result.claims;
    if (result.finished.length) this.addHistory(result.finished);
    return { ok: true, stale: false, feed, fetchedAt: at, notices: result.notices };
  }

  /**
   * Sends one mutation and finds out what really happened. Order of trust:
   *   1. a readable reply,
   *   2. the request's receipt (asked for a few times),
   *   3. nothing: "unconfirmed". Never success.
   */
  async mutate(body) {
    const request = { ...body, request_id: body.request_id || newId() };
    try {
      const reply = await this.transport.post(request);
      if (reply && typeof reply.ok === 'boolean') return reply;
    } catch {
      // Any failure here (CORS, timeout, dropped connection) leaves the outcome unknown: the
      // request may have landed. Only the receipt can say.
    }
    if (this.transport.postBlind) {
      try { await this.transport.postBlind(request); } catch { /* the receipt check below decides */ }
    }
    for (const delay of this.confirmDelays) {
      await this.sleep(delay);
      try {
        const answer = await this.transport.get({ action: 'receipt', request_id: request.request_id });
        if (answer && answer.ok && answer.receipt) return { ...answer.receipt, confirmedBy: 'receipt' };
      } catch { /* still unreachable; try again */ }
    }
    return { ...UNCONFIRMED };
  }

  /** One action per task at a time: a double tap must not become two requests. */
  async guarded(taskId, fn) {
    if (this.inFlight.has(taskId)) return { ok: false, code: 'in_flight', message: 'Already working on that…' };
    this.inFlight.add(taskId);
    try { return await fn(); } finally { this.inFlight.delete(taskId); }
  }

  claim(task) {
    return this.guarded(task.id, async () => {
      const profile = this.profile;
      if (!profile || !profile.name || !profile.mode) return { ok: false, code: 'no_profile', message: 'Add your name first.' };
      // Remember the claim BEFORE sending. If the reply is lost but the claim landed, the next
      // read recognises the plate as ours. If it didn't land, reconcile drops it.
      const claim = { claim_id: newId(), claim_secret: newSecret(), title: task.title, at: new Date().toISOString(), pending: true };
      this.claims = { ...this.claims, [task.id]: claim };
      const result = await this.mutate({ action: 'claim', task_id: task.id, claim_id: claim.claim_id, claim_secret: claim.claim_secret,
        actor_name: profile.name, actor_mode: profile.mode });
      const claims = this.claims;
      if (result.ok) claims[task.id] = { ...claim, pending: false, status: 'claimed' };
      else if (result.code !== 'unconfirmed') delete claims[task.id];
      this.claims = claims;
      return result;
    });
  }

  ownerAction(task, action, note) {
    return this.guarded(task.id, async () => {
      const claim = this.claims[task.id];
      if (!claim) return { ok: false, code: 'not_yours', message: 'This browser has no claim on that plate.' };
      const body = { action, task_id: task.id, claim_id: claim.claim_id, claim_secret: claim.claim_secret };
      if (note !== undefined) body.note = note;
      const result = await this.mutate(body);
      const claims = this.claims;
      if (result.ok) {
        const status = result.task && result.task.status;
        if (action === 'release' || status === 'completed') {
          delete claims[task.id];
          if (status === 'completed') this.addHistory([{ id: task.id, title: task.title, at: result.task.completed_at || new Date().toISOString() }]);
        } else if (claims[task.id] && status) {
          claims[task.id] = { ...claims[task.id], status };
        }
      } else if (result.code === 'not_yours' && claims[task.id]) {
        delete claims[task.id];
      }
      this.claims = claims;
      return result;
    });
  }

  release(task) { return this.ownerAction(task, 'release'); }
  help(task, note) { return this.ownerAction(task, 'help', note || ''); }
  resume(task) { return this.ownerAction(task, 'resume'); }
  complete(task, note) { return this.ownerAction(task, 'complete', note || ''); }

  myClaimIds() { return Object.values(this.claims).map((c) => c.claim_id); }
}
