import { NextResponse } from "next/server";
import { createRecord, TABLES } from "@/lib/airtable";

export async function POST(req: Request) {
  try {
    const { referrerCode, email } = await req.json();

    if (!referrerCode || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Missing referrerCode or valid email" }, { status: 400 });
    }

    await createRecord(TABLES.invites, {
      "Referrer Code": referrerCode,
      "Invited Email": email,
      Accepted: false,
      "Sent At": new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Invite error:", message);
    return NextResponse.json({ error: "Server error", detail: message }, { status: 500 });
  }
}
