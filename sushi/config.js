// Public-safe Sushi settings. EVERYTHING in this file is public: it ships to every visitor and
// sits in a public repo. Never put a spreadsheet id, email address, key, or code here.

export const SUSHI_CONFIG = {
  // The Apps Script web app URL, ending in /exec (see sushi/backend/README.md, step 6).
  // Empty means the kitchen isn't connected yet: /sushi/ says so, and offers the demo instead.
  apiUrl: '',

  // How often an open page re-reads the belt, in seconds.
  pollSeconds: 60,
};
