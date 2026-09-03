# Junior PPG Batch – IPC Election 2026

A clean ranked-preference voting prototype designed for Vercel.

## Voting logic

- Question 1: email address — required.
- Question 2: candidate preferences — 1st, 2nd, 3rd and 4th preference.
- Each preference is required.
- A voter can choose exactly one candidate for each preference.
- A candidate can only be selected once across the four preference levels.
- The fifth candidate remains unranked.
- The interface automatically disables candidates already used in another preference.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Vercel

Import this project into Vercel. No special build settings are required.

IMPORTANT: This prototype currently validates the ballot and shows a confirmation screen but does not persist votes. For a real election, connect the submit handler in `app/page.js` to a secure database/API (e.g. Supabase) and implement server-side duplicate-vote protection and election closing controls. Do not rely on client-side validation for a live election.
