import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbznTknl94iEdr0etzdHE9okUzrgNKXxDVJkalccHFmbMIXWuVQ-aYp-qqfj9cUCQ5Gm/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const params = new URLSearchParams({
      action: "submit",
      email: String(body.email || ""),
      first: String(body.first || ""),
      second: String(body.second || ""),
      third: String(body.third || ""),
      fourth: String(body.fourth || ""),
    });

    const response = await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    const text = await response.text();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { success: false, message: "Google Apps Script returned an empty response." },
        { status: 502 }
      );
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      console.error("Apps Script non-JSON response:", response.status, text.slice(0, 500));
      return NextResponse.json(
        { success: false, message: "Google Apps Script returned an invalid response." },
        { status: 502 }
      );
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to connect to the election server. Please try again." },
      { status: 500 }
    );
  }
}
