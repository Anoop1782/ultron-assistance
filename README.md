# ULTRON Personal Assistant — Starter v1.0

A responsive browser-based personal dashboard for tasks, schedule, daily habits, goals, and a simple offline rule-based assistant. No paid API key is required.

## Requirements
- A laptop or desktop computer
- Node.js 20 or newer (free): https://nodejs.org/
- Internet for the initial package installation. The app itself uses browser local storage.
- No credit card or paid subscription is required.

## Start it on your laptop
1. Install Node.js LTS from https://nodejs.org/ if it is not already installed.
2. Extract the `ultron-starter.zip` folder.
3. Open a terminal/command prompt inside the extracted `ultron-starter` folder.
4. Run:
   ```bash
   npm install
   npm run dev
   ```
5. Vite prints a local address, usually `http://localhost:5173`. Open it in your browser.

To stop the local server, press `Ctrl+C` in the terminal.

## Open it on Android on the same Wi-Fi
1. Start the dev server with `npm run dev`.
2. Find your laptop's local IPv4 address:
   - Windows: run `ipconfig` and look for IPv4 Address.
   - macOS: System Settings > Wi-Fi > Details, or use `ipconfig getifaddr en0`.
   - Linux: run `hostname -I`.
3. On Android, open `http://YOUR-LAPTOP-IP:5173` (replace the example with the real IP).
4. If it does not load, ensure both devices are on the same Wi-Fi and allow Node/Vite through your computer's firewall if prompted.
5. To install as an app-like shortcut, use the browser menu > Add to Home screen. The dev server must be running and reachable.

## Build the production files
```bash
npm run build
npm run preview
```
The generated static site is in `dist/`. You can deploy `dist/` to a free static hosting provider if you want access away from home; check that provider's current free plan and privacy terms first.

## Files
- `package.json` — app dependencies and commands
- `index.html` — browser entry page
- `public/manifest.webmanifest` — basic install metadata
- `src.jsx` — app screens, tasks, habits, goals, schedule, local assistant
- `style.css` — responsive styling

## Important limits
- This starter uses local browser storage. Data does not automatically sync between your laptop and Android.
- Use **Export backup** in the footer to download `ultron-backup.json`.
- Clearing browser data can erase the saved data.
- The chat is a basic rule-based helper, not a full AI model. It does not control your device, send messages, access accounts, or create real reminders/notifications.
- The included manifest is a basic install metadata file; production-grade PWA offline caching and push notifications are not implemented yet.
- The schedule is editable, but it does not yet send notifications.
- Never put private passwords or API keys in front-end code.
