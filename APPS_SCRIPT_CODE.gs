const SHEET_ID = "1OSC_RBx5g5Bwy7f8CTI2NJN4UIisXRgw19smMGAnDI0";

const ALLOWED_CANDIDATES = [
  "Aishwarya Mahobiya",
  "Avantika Kumari",
  "Himanshu Lodhi",
  "M Dhanush",
  "Pranav Rajendra Dande"
];

function doGet() {
  return response(true, "Junior PPG IPC Election API is running.");
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    if (!e || !e.parameter) return response(false, "Invalid request.");

    const email = String(e.parameter.email || "").trim().toLowerCase();
    if (!/^[^\s@]+@stud\.tiss\.ac\.in$/.test(email)) {
      return response(false, "Only @stud.tiss.ac.in email addresses are allowed.");
    }

    const preferences = [
      String(e.parameter.first || "").trim(),
      String(e.parameter.second || "").trim(),
      String(e.parameter.third || "").trim(),
      String(e.parameter.fourth || "").trim()
    ];

    if (preferences.some(x => !x)) return response(false, "Please select all four preferences.");
    if (new Set(preferences).size !== 4) return response(false, "Each candidate can only be selected once.");
    if (preferences.some(x => !ALLOWED_CANDIDATES.includes(x))) return response(false, "Invalid candidate selection.");

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const lastRow = sheet.getLastRow();

    if (lastRow >= 2) {
      const emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat().map(x => String(x).trim().toLowerCase());
      if (emails.includes(email)) return response(false, "A vote has already been submitted from this email address.");
    }

    sheet.appendRow([new Date(), email, preferences[0], preferences[1], preferences[2], preferences[3]]);
    SpreadsheetApp.flush();
    return response(true, "Vote recorded successfully.");
  } catch (error) {
    console.error(error);
    return response(false, "Unable to record vote. Please try again.");
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function response(success, message) {
  return ContentService.createTextOutput(JSON.stringify({success, message}))
    .setMimeType(ContentService.MimeType.JSON);
}
