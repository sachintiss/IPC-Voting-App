import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxexxNuq5wPiueNfS7Wbl1G4q3i18W8S0cGgTjQfgONOf5MVoRsvyZ65sQS9m1OVzL0/exec";

export async function POST(request) {

  try {

    const body = await request.json();

    const params = new URLSearchParams();

    params.set("action", "submit");
    params.set("email", String(body.email || ""));
    params.set("first", String(body.first || ""));
    params.set("second", String(body.second || ""));
    params.set("third", String(body.third || ""));
    params.set("fourth", String(body.fourth || ""));

    const url =
      `${APPS_SCRIPT_URL}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });

    const text = await response.text();

    console.log(
      "Apps Script status:",
      response.status
    );

    console.log(
      "Apps Script response:",
      text
    );

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Apps Script returned an invalid response.",
          debug:
            text.substring(0, 300)
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      result,
      {
        status:
          result.success
            ? 200
            : 400
      }
    );

  } catch (error) {

    console.error(
      "Election API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to connect to the election server."
      },
      { status: 500 }
    );
  }
}