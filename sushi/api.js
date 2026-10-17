// Live transport: GitHub Pages ⇄ the Apps Script web app.
//
// Apps Script answers a web-app request with a redirect to googleusercontent.com, and whether a
// browser lets this page read the result has varied over time. So nothing here assumes it:
//   reads      try fetch first; if that fails, fall back to JSONP (a <script> tag) and stay on
//              JSONP for the rest of the visit.
//   mutations  POST as text/plain (no CORS preflight). If the reply can't be read, the client
//              resends blind (no-cors) and asks for the request's receipt; see client.js. The
//              backend applies each request_id at most once, so the resend is safe.

import { UnreadableReply } from './client.js';

export function createLiveTransport(apiUrl, { timeoutMs = 15000 } = {}) {
  let readMode = 'fetch';

  const withTimeout = async (url, init = {}) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal, credentials: 'omit', redirect: 'follow', cache: 'no-store' });
    } finally {
      clearTimeout(timer);
    }
  };

  const urlFor = (params) => {
    const url = new URL(apiUrl);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    return url;
  };

  async function readByFetch(params) {
    const response = await withTimeout(urlFor(params));
    const text = await response.text();
    try { return JSON.parse(text); } catch {
      // Usually a Google sign-in page: the web app isn't deployed for "Anyone".
      throw new Error('The kitchen answered with a web page instead of data. Is the web app deployed with access "Anyone"?');
    }
  }

  function readByJsonp(params) {
    return new Promise((resolve, reject) => {
      const name = `__sushi_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      const done = (fn, value) => { clearTimeout(timer); delete window[name]; script.remove(); fn(value); };
      const timer = setTimeout(() => done(reject, new Error('The kitchen took too long to answer.')), timeoutMs);
      window[name] = (data) => done(resolve, data);
      script.onerror = () => done(reject, new Error('Couldn\'t reach the kitchen.'));
      script.src = urlFor({ ...params, callback: name }).toString();
      document.head.append(script);
    });
  }

  return {
    kind: 'live',
    get readMode() { return readMode; },

    async get(params) {
      if (readMode === 'fetch') {
        try {
          return await readByFetch(params);
        } catch (error) {
          if (typeof navigator !== 'undefined' && navigator.onLine === false) throw error;
          const data = await readByJsonp(params);
          readMode = 'jsonp';
          return data;
        }
      }
      return readByJsonp(params);
    },

    async post(body) {
      let response;
      try {
        response = await withTimeout(apiUrl, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
      } catch {
        throw new UnreadableReply();
      }
      const text = await response.text().catch(() => '');
      try { return JSON.parse(text); } catch { throw new UnreadableReply(); }
    },

    async postBlind(body) {
      await fetch(apiUrl, { method: 'POST', mode: 'no-cors', credentials: 'omit', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) });
    },
  };
}
