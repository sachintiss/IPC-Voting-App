import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxexxNuq5wPiueNfS7Wbl1G4q3i18W8S0cGgTjQfgONOf5MVoRsvyZ65sQS9m1OVzL0/exec";

export async function GET() {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
    });

    const text = await response.text();

    return NextResponse.json({
      success: true,
      upstreamStatus: response.status,
      contentType: response.headers.get("content-type"),
      finalUrl: response.url,
      body: text.substring(0, 1000),
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}