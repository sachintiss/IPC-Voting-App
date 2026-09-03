# Junior PPG Batch – IPC Election 2026

Minimal TISS-style ranked-preference election app for Vercel.

## Current production flow
Browser -> Vercel `/api/vote` -> Google Apps Script -> Google Sheet.

Using a Vercel server route avoids browser CORS/opaque-response problems. The browser receives the actual Apps Script success/error response, so a successful confirmation is only shown when the vote was accepted.

## Ballot logic
- TISS student email required; server accepts only `@stud.tiss.ac.in`.
- Exactly four preferences required.
- One candidate per preference.
- The same candidate cannot occupy more than one preference.
- Only the five configured candidate names are accepted by Apps Script.
- Duplicate email submissions are rejected by Apps Script.
- Simultaneous submissions are protected with Apps Script LockService.

## Google Sheet columns
Timestamp | Email | 1st Preference | 2nd Preference | 3rd Preference | 4th Preference

## Deploy
Upload this project to Vercel and deploy. No client-side Google Apps Script URL is required; the server route contains the current Apps Script web-app endpoint.

For the live election, keep the Google Sheet accessible only to the election administrators and do not publish response data.
