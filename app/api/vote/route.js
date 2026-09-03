import { NextResponse } from 'next/server';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxAZbTbSNNnnkwQRzLgJvzTGrHAN14L3EI3QovGFV28sGzOyt6MdkmeJwYxrsMnlk0x/exec';

export async function POST(request) {
  try {
    const body = await request.json();

    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow',
      cache: 'no-store'
    });

    const text = await response.text();

    let result;
    try {
      result = JSON.parse(text);
    } catch {
      result = { success: false, message: 'Election server returned an unexpected response.' };
    }

    return NextResponse.json(result, { status: result.success ? 200 : 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Unable to connect to the election server. Please try again.' },
      { status: 500 }
    );
  }
}
