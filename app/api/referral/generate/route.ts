import { NextResponse } from "next/server";
import { findRecords, TABLES } from "@/lib/airtable";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const records = await findRecords(TABLES.signups, `{Email} = "${email}"`, 1);
    if (records.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const referralCode = records[0].fields["Referral Code"] as string;
    const link = `https://trypancake.ai/signup?ref=${referralCode}`;
    const message = `Hey! I've been exploring Pancake — an AI platform that helps you build Autonomous Companies: AI handles most of the execution and humans act as board members.\n\nIt's closed to the public, I'm able to get you early access here: ${link}`;

    return NextResponse.json({ ok: true, referralCode, link, message });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Generate error:", message);
    return NextResponse.json({ error: "Server error", detail: message }, { status: 500 });
  }
}
