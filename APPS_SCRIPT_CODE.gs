const SHEET_ID = "1OSC_RBx5g5Bwy7f8CTI2NJN4UIisXRgw19smMGAnDI0";

const ALLOWED_CANDIDATES = [
  "Aishwarya Mahobiya",
  "Avantika Kumari",
  "Himanshu Lodhi",
  "M Dhanush",
  "Pranav Rajendra Dande"
];

function doGet(e) {
  // Health check
  if (!e || !e.parameter || e.parameter.action !== "submit") {
    return jsonResponse({
      success: true,
      message: "Junior PPG IPC Election API is running."
    });
  }

  return processVote(
    e.parameter.email,
    e.parameter.first,
    e.parameter.second,
    e.parameter.third,
    e.parameter.fourth
  );
}

function doPost(e) {
  try {
    let body = {};

    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (_) {
        body = {};
      }
    }

    const params = e && e.parameter ? e.parameter : {};

    return processVote(
      body.email || params.email,
      body.first || params.first,
      body.second || params.second,
      body.third || params.third,
      body.fourth || params.fourth
    );
  } catch (error) {
    console.error(error);
    return jsonResponse({
      success: false,
      message: "Unable to process vote: " + error.message
    });
  }
}

function processVote(email, first, second, third, fourth) {
  const lock = LockService.getScriptLock();

  try {
    lock.waitLock(15000);

    email = String(email || "").trim().toLowerCase();

    const preferences = [
      String(first || "").trim(),
      String(second || "").trim(),
      String(third || "").trim(),
      String(fourth || "").trim()
    ];

    if (!/^[^\s@]+@stud\.tiss\.ac\.in$/i.test(email)) {
      return jsonResponse({
        success: false,
        message: "Only @stud.tiss.ac.in email addresses are allowed."
      });
    }

    if (preferences.some(p => !p)) {
      return jsonResponse({
        success: false,
        message: "Please select all four preferences."
      });
    }

    if (new Set(preferences).size !== 4) {
      return jsonResponse({
        success: false,
        message: "Each candidate can only be selected once."
      });
    }

    if (preferences.some(p => !ALLOWED_CANDIDATES.includes(p))) {
      return jsonResponse({
        success: false,
        message: "Invalid candidate selection."
      });
    }

    const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheets()[0];

    const lastRow = sheet.getLastRow();

    if (lastRow >= 2) {
      const emails = sheet
        .getRange(2, 2, lastRow - 1, 1)
        .getValues()
        .flat()
        .map(v => String(v).trim().toLowerCase());

      if (emails.includes(email)) {
        return jsonResponse({
          success: false,
          message: "A vote has already been submitted from this email address."
        });
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

    return jsonResponse({
      success: true,
      message: "Vote recorded successfully."
    });

  } catch (error) {
    console.error(error);
    return jsonResponse({
      success: false,
      message: "Unable to record vote: " + error.message
    });
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
