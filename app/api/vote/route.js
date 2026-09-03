import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxexxNuq5wPiueNfS7Wbl1G4q3i18W8S0cGgTjQfgONOf5MVoRsvyZ65sQS9m1OVzL0/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const params = new URLSearchParams();

    params.append("email", String(body.email || ""));
    params.append("first", String(body.first || ""));
    params.append("second", String(body.second || ""));
    params.append("third", String(body.third || ""));
    params.append("fourth", String(body.fourth || ""));

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      redirect: "follow",
      cache: "no-store",
    });

    const text = await upstream.text();

    console.log("Apps Script HTTP status:", upstream.status);
    console.log("Apps Script response:", text);

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script returned a non-JSON response.",
          debug: text.substring(0, 300),
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });

  } catch (error) {
    console.error("Election API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to connect to the election server.",
      },
      { status: 500 }
    );
  }
}