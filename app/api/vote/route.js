import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbxexxNuq5wPiueNfS7Wbl1G4q3i18W8S0cGgTjQfgONOf5MVoRsvyZ65sQS9m1OVzL0/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: new URLSearchParams({
        email: String(body.email || ""),
        first: String(body.first || ""),
        second: String(body.second || ""),
        third: String(body.third || ""),
        fourth: String(body.fourth || ""),
      }).toString(),
      redirect: "follow",
      cache: "no-store",
    });

    const text = await upstream.text();

    console.log("Apps Script status:", upstream.status);
    console.log("Apps Script response:", text);

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script did not return a valid response. Check the Apps Script deployment access.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });

  } catch (error) {
    console.error("Vote API error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to connect to the election server.",
      },
      { status: 500 }
    );
  }
}