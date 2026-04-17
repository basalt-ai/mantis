import { NextResponse } from "next/server";
import { createRecord, findRecords, TABLES } from "@/lib/airtable";
import { sendInviteEmail } from "@/lib/loops";

export async function POST(req: Request) {
  try {
    const { referrerCode, email } = await req.json();

    if (!referrerCode || !email || !email.includes("@")) {
      return NextResponse.json({ error: "Missing referrerCode or valid email" }, { status: 400 });
    }

    // Get referrer's name for the invite email
    const referrers = await findRecords(TABLES.signups, `{Referral Code} = "${referrerCode}"`, 1);
    const referrerName = referrers.length > 0
      ? ((referrers[0].fields["Name"] as string) || "A friend")
      : "A friend";

    // Create invite record in Airtable
    await createRecord(TABLES.invites, {
      "Referrer Code": referrerCode,
      "Invited Email": email,
      Accepted: false,
      "Sent At": new Date().toISOString(),
    });

    // Send invite email via Loops
    await sendInviteEmail(email, referrerName, referrerCode);

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Invite error:", message);
    return NextResponse.json({ error: "Server error", detail: message }, { status: 500 });
  }
}
