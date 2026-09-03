# Junior PPG Batch — IPC Election 2026

Clean final build for Vercel + Google Apps Script + Google Sheets.

Architecture:
Browser → Vercel (`/api/vote`) → Google Apps Script Web App → Google Sheet

The frontend (`app/page.js`) submits the ballot to the app's own
`/api/vote` API route. That route calls the Apps Script Web App as a
server-side GET request (`?action=submit&...`) and returns Apps Script's
JSON response straight to the browser. No hidden iframes or
`postMessage` are used — the fetch response is parsed directly.

Apps Script Web App:
https://script.google.com/macros/s/AKfycbznTknl94iEdr0etzdHE9okUzrgNKXxDVJkalccHFmbMIXWuVQ-aYp-qqfj9cUCQ5Gm/exec

Google Sheet ID:
1OSC_RBx5g5Bwy7f8CTI2NJN4UIisXRgw19smMGAnDI0

Sheet columns:
Timestamp | Email | 1st Preference | 2nd Preference | 3rd Preference | 4th Preference

Candidates:
Aishwarya Mahobiya
Avantika Kumari
Himanshu Lodhi
M Dhanush
Pranav Rajendra Dande

Deployment:
1. Open the Apps Script project named IPC Election.
2. Replace Code.gs with the contents of APPS_SCRIPT_CODE.gs.
3. Deploy it as a Web app, executing as the owner, accessible to "Anyone"
   with the link (the Vercel server calls it directly, so it must not be
   restricted to a Google Workspace domain — the request doesn't carry a
   signed-in Google session).
4. Confirm the deployment URL matches `APPS_SCRIPT_URL` in
   `app/api/vote/route.js`.
5. Deploy this project as a fresh Vercel deployment or replace the
   existing project.
6. Hard-refresh the deployed page after deployment.
