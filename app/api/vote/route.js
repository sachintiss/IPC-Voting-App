import { NextResponse } from "next/server";

const APPS_SCRIPT_URL =
  "https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbxexxNuq5wPiueNfS7Wbl1G4q3i18W8S0cGgTjQfgONOf5MVoRsvyZ65sQS9m1OVzL0/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const formData = new URLSearchParams();

    formData.set("email", String(body.email || ""));
    formData.set("first", String(body.first || ""));
    formData.set("second", String(body.second || ""));
    formData.set("third", String(body.third || ""));
    formData.set("fourth", String(body.fourth || ""));

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: formData.toString(),
      redirect: "follow",
      cache: "no-store",
    });

    const text = await response.text();

    console.log("Apps Script HTTP status:", response.status);
    console.log("Apps Script response:", text);

    let result;

    try {
      result = JSON.parse(text);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script returned an unexpected response.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result, {
      status: result.success ? 200 : 400,
    });

  } catch (error) {
    console.error("Vote submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to connect to the election server. Please try again.",
      },
      { status: 500 }
    );
  }
}