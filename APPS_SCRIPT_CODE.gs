const SHEET_ID = "1OSC_RBx5g5Bwy7f8CTI2NJN4UIisXRgw19smMGAnDI0";

const ALLOWED_CANDIDATES = [
  "Aishwarya Mahobiya",
  "Avantika Kumari",
  "Himanshu Lodhi",
  "M Dhanush",
  "Pranav Rajendra Dande"
];

function doGet() {
  return jsonResponse({
    success: true,
    message: "Junior PPG IPC Election API is running."
  });
}

function doPost(e) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    const p = (e && e.parameter) ? e.parameter : {};
    const email = String(p.email || "").trim().toLowerCase();
    const preferences = [
      String(p.first || "").trim(),
      String(p.second || "").trim(),
      String(p.third || "").trim(),
      String(p.fourth || "").trim()
    ];

    if (!/^[^\s@]+@stud\.tiss\.ac\.in$/i.test(email)) {
      return htmlResponse(false, "Only @stud.tiss.ac.in email addresses are allowed.");
    }

    if (preferences.some(p => !p)) {
      return htmlResponse(false, "Please select all four preferences.");
    }

    if (new Set(preferences).size !== 4) {
      return htmlResponse(false, "Each candidate can only be selected once.");
    }

    if (preferences.some(p => !ALLOWED_CANDIDATES.includes(p))) {
      return htmlResponse(false, "Invalid candidate selection.");
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
    const lastRow = sheet.getLastRow();

    if (lastRow >= 2) {
      const emails = sheet.getRange(2, 2, lastRow - 1, 1).getValues().flat()
        .map(v => String(v).trim().toLowerCase());

      if (emails.includes(email)) {
        return htmlResponse(false, "A vote has already been submitted from this email address.");
      }
    }

    sheet.appendRow([
      new Date(),
      email,
      preferences[0],
      preferences[1],
      preferences[2],
      preferences[3]
    ]);

    SpreadsheetApp.flush();

    return htmlResponse(true, "Vote recorded successfully.");

  } catch (error) {
    console.error(error);
    return htmlResponse(false, "Unable to record vote: " + error.message);
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function htmlResponse(success, message) {
  const safeMessage = JSON.stringify(String(message));
  const safeSuccess = success ? "true" : "false";

  const html = `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
(function() {
  var result = { type: 'IPC_VOTE_RESULT', success: ${safeSuccess}, message: ${safeMessage} };
  try { window.parent.postMessage(result, '*'); } catch (e) {}
})();
</script>
</body></html>`;

  return HtmlService
    .createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
