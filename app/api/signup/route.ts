import { NextResponse } from "next/server";
import { createRecord, findRecords, updateRecord, generateReferralCode, TABLES } from "@/lib/airtable";
import { addContactToLoops } from "@/lib/loops";

export async function POST(req: Request) {
  try {
    const { email, name, ref } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Check if already signed up
    const existing = await findRecords(TABLES.signups, `{Email} = "${email}"`, 1);
    if (existing.length > 0) {
      const record = existing[0].fields;
      return NextResponse.json({
        ok: true,
        referralCode: record["Referral Code"],
        alreadySignedUp: true,
      });
    }

    // Generate referral code
    const referralCode = generateReferralCode();

    // Create signup record
    await createRecord(TABLES.signups, {
      Email: email,
      Name: name ?? "",
      "Referral Code": referralCode,
      "Referred By": ref ?? "",
      "Referral Count": 0,
      "Early Access": false,
      "Signup Date": new Date().toISOString(),
    });

    // If referred by someone, update their referral count + check early access
    if (ref) {
      const referrer = await findRecords(TABLES.signups, `{Referral Code} = "${ref}"`, 1);
      if (referrer.length > 0) {
        const r = referrer[0];
        const currentCount = ((r.fields["Referral Count"] as number) || 0) + 1;
        const earlyAccess = currentCount >= 2;

        await updateRecord(TABLES.signups, r.id, {
          "Referral Count": currentCount,
          "Early Access": earlyAccess,
        });

        // If referrer just hit 2, also grant early access to this new user
        if (earlyAccess) {
          const thisUser = await findRecords(TABLES.signups, `{Email} = "${email}"`, 1);
          if (thisUser.length > 0) {
            await updateRecord(TABLES.signups, thisUser[0].id, { "Early Access": true });
          }
        }

        // Mark invite as accepted
        const invites = await findRecords(
          TABLES.invites,
          `AND({Referrer Code} = "${ref}", {Invited Email} = "${email}")`,
          1,
        );
        if (invites.length > 0) {
          await updateRecord(TABLES.invites, invites[0].id, { Accepted: true });
        }
      }
    }

    // Sync to Loops — must await before response or Vercel kills it
    await addContactToLoops(email, name ?? undefined, referralCode);

    return NextResponse.json({ ok: true, referralCode });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Signup error:", message);
    return NextResponse.json({ error: "Server error", detail: message }, { status: 500 });
  }
}
