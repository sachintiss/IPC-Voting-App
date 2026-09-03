import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbxexxNuq5wPiueNfS7Wbl1G4q3i18W8S0cGgTjQfgONOf5MVoRsvyZ65sQS9m1OVzL0/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const params = new URLSearchParams({
      email: String(body.email || ""),
      first: String(body.first || ""),
      second: String(body.second || ""),
      third: String(body.third || ""),
      fourth: String(body.fourth || ""),
    });

    const googleResponse = await fetch(
      `${APPS_SCRIPT_URL}?${params.toString()}`,
      {
        method: "GET",
        redirect: "follow",
        cache: "no-store",
      }
    );

    const raw = await googleResponse.text();

    console.log("GOOGLE STATUS:", googleResponse.status);
    console.log("GOOGLE FINAL URL:", googleResponse.url);
    console.log("GOOGLE BODY:", raw);

    if (!raw || !raw.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script returned an empty response.",
        },
        { status: 502 }
      );
    }

    let result;

    try {
      result = JSON.parse(raw);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script returned an invalid response.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: Boolean(result.success),
        message: String(
          result.message || "Unknown response from Google Apps Script."
        ),
      },
      {
        status: result.success ? 200 : 400,
      }
    );

  } catch (error) {
    console.error("VOTE API ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Election server error: " + error.message,
      },
      { status: 500 }
    );
  }
}