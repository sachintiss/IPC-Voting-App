import { NextResponse } from "next/server";
import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

const ALLOWED_CANDIDATES = [
  "Aishwarya Mahobiya",
  "Avantika Kumari",
  "Himanshu Lodhi",
  "M Dhanush",
  "Pranav Rajendra Dande",
];

function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
    ],
  });

  return google.sheets({
    version: "v4",
    auth,
  });
}

export async function POST(request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const preferences = [
      String(body.first || "").trim(),
      String(body.second || "").trim(),
      String(body.third || "").trim(),
      String(body.fourth || "").trim(),
    ];

    // Email validation
    if (!/^[^\s@]+@stud\.tiss\.ac\.in$/i.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only @stud.tiss.ac.in email addresses are allowed.",
        },
        { status: 400 }
      );
    }

    // Four preferences required
    if (preferences.some((p) => !p)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select all four preferences.",
        },
        { status: 400 }
      );
    }

    // No duplicate candidate
    if (new Set(preferences).size !== 4) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Each candidate can only be selected once.",
        },
        { status: 400 }
      );
    }

    // Candidate whitelist
    if (
      preferences.some(
        (candidate) =>
          !ALLOWED_CANDIDATES.includes(candidate)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid candidate selection.",
        },
        { status: 400 }
      );
    }

    const sheets = getSheetsClient();

    // Read existing emails
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: "A2:F",
    });

    const rows = existing.data.values || [];

    const existingEmails = rows
      .map((row) =>
        String(row[1] || "")
          .trim()
          .toLowerCase()
      )
      .filter(Boolean);

    // One-person-one-vote
    if (existingEmails.includes(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A vote has already been submitted from this email address.",
        },
        { status: 400 }
      );
    }

    // Append vote
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "A:F",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            email,
            preferences[0],
            preferences[1],
            preferences[2],
            preferences[3],
          ],
        ],
      },
    });

    return NextResponse.json({
      success: true,
      message: "Vote recorded successfully.",
    });

  } catch (error) {
    console.error("VOTE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to record your vote. Please try again.",
      },
      { status: 500 }
    );
  }
}