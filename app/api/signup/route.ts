import { NextResponse } from "next/server";
import { google } from "googleapis";

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SHEET_NAME = "Signups";

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const sheets = await getSheets();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:C`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[new Date().toISOString(), email, name ?? ""]],
      },
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Signup error:", message);
    return NextResponse.json({ error: "Server error", detail: message }, { status: 500 });
  }
}
