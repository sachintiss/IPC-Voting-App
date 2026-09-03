# Junior PPG Batch — IPC Election 2026

Clean final build for Vercel + Google Apps Script + Google Sheets.

Architecture:
Browser → Google Apps Script → Google Sheet

Apps Script Web App:
https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbwWHbZDU2_0fW_qAmYCtUBlFtRvc3H-9WV1QtX_zd960wl6On2v9_kuYk0YuOaDKYMI/exec

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
3. Deploy it as a Web app, executing as the owner.
4. Make sure the deployment is accessible to the intended TISS users.
5. Deploy this project as a fresh Vercel deployment or replace the existing project.
6. Hard-refresh the deployed page after deployment.

The frontend sends a hidden HTML form directly to the Apps Script Web App.
The response is received through a hidden iframe using postMessage.
No server-side parsing of the Apps Script response is required.
