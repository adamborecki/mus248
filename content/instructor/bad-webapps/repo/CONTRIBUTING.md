# How to add your bad webapp

Everything happens in the browser. No terminal, nothing to install. It takes about 30 minutes plus
however long you spend making your app gloriously bad.

## 1. Get set up (once)

1. Make a free account at github.com. A username that isn't your real name is fine.
2. Open this repo and click **Fork** (top right) → **Create fork**. You now have your own copy at
   `github.com/your-username/bad-webapps`.
3. In **your fork**: **Settings → Pages → Build and deployment → Source: Deploy from a branch →
   main → / (root) → Save.** This gives your fork its own website, so you can test your app
   before you hand it in.

## 2. Build it with AI

1. Open **[STARTER.md](STARTER.md)**, fill in your app name and idea, and paste the whole thing
   into your AI (PantherAI is fine) as your first message.
2. The AI talks it through with you first and writes a short plan. It won't write code until you
   say **"build it"**.
3. Count your prompts. Every message you send is one.
4. Make each prompt count: **one** specific change, plus what you saw when you tested.
   "The drift is too fast to notice; make it 1 BPM every 4 bars" beats "make it better."

## 3. Put it in your fork

1. In your fork: **Add file → Create new file**.
2. In the name box, type `apps/your-app-name/index.html`. Typing the `/` makes the folders.
   Use lowercase and hyphens, like `apps/insulting-tuner/index.html`.
3. Paste the AI's complete code.
4. **Commit changes…** → write a short note ("Add insulting tuner") → **Commit changes**.

To change it later, open the file and click the ✏️ pencil.

## 4. Test it for real

About a minute after each commit, your app is live at:

`https://your-username.github.io/bad-webapps/apps/your-app-name/`

Open it **on your phone** too. If something's wrong, that's your next prompt.

## 5. Hand it in: the pull request

1. In your fork, click **Contribute → Open pull request**.
2. Fill in the checklist in the description (it's already there), including your test link.
3. **Create pull request.**

The instructor reviews it and merges it. Then it's on the main Bad Webapps site.

If the pull request says there's a **conflict**, someone else already used your folder name.
Rename your folder and try again.
