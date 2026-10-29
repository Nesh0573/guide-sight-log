# Gamewatchers Field Log (offline PWA -> Google Sheet)
Free stack: GitHub Pages (app) + Google Apps Script (API, email) + emailed one-time code sign-in.

1. **Sheet**: use the Google Sheet your Form writes to (tab `Form Responses 3`; change `SHEET` in Code.gs if named differently).
2. **Script**: Sheet > Extensions > Apps Script > paste `apps-script/Code.gs`. Run `setup()` once and authorise. Deploy > New deployment > Web app > Execute as *Me*, Access *Anyone* > copy the URL.
3. **Guides**: in the `Guides` sheet list each guide's email (column A) and name (B). Only these can sign in. Empty = anyone with an email.
4. **App**: put the Web app URL in `config.js` (`SCRIPT_URL`). Push the files to GitHub > Settings > Pages > deploy from `main` / root.
5. **Guides**: open the Pages link, enter email, type the 6-digit code from the email, then Add to Home screen. Open once online; afterwards it works offline. Sign-in lasts 30 days.

**Form changes**: add the new question to `config.js` (`trip` = once per safari, `day` = every day) using the exact column header.
Each day is one row in `Form Responses 3` with Trip ID, Day No., Total Days, Submitted By added at the end. Re-sending a trip updates its rows.
After editing Code.gs: Deploy > Manage deployments > Edit > New version (keeps the same URL).
