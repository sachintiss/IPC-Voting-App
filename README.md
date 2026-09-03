# Junior PPG IPC Election 2026

Minimal TISS-style ranked ballot for Vercel.

## Google Sheet integration
The Vercel API posts to the exact Google Apps Script Web App URL supplied for the TISS Workspace deployment. The payload uses URL-encoded parameters because Apps Script reliably exposes these as `e.parameter`.

### Apps Script
Paste `APPS_SCRIPT_CODE.gs` into Code.gs, save, and deploy the Web App as:
- Execute as: Me
- Who has access: Anyone (or the appropriate TISS Workspace setting that allows the Vercel server to call it)

The Sheet columns must be row 1:
Timestamp | Email | 1st Preference | 2nd Preference | 3rd Preference | 4th Preference

The backend validates the TISS student domain, four distinct approved candidates, and one vote per email.
