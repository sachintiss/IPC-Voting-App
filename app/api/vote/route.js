import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = "https://script.google.com/a/macros/stud.tiss.ac.in/s/AKfycbxAZbTbSNNnnkwQRzLgJvzTGrHAN14L3EI3QovGFV28sGzOyt6MdkmeJwYxrsMnlk0x/exec";

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body: new URLSearchParams({
        email: String(body.email || ""),
        first: String(body.first || ""),
        second: String(body.second || ""),
        third: String(body.third || ""),
        fourth: String(body.fourth || "")
      }).toString(),
      redirect: "follow",
      cache: "no-store"
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, message: "Google Sheets connection failed. Please check the Apps Script deployment access settings." },
        { status: 502 }
      );
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Unable to connect to the election server. Please try again." },
      { status: 500 }
    );
  }
}
