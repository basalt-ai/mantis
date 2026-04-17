// Loops email integration helper
const LOOPS_API_KEY = process.env.LOOPS_API_KEY!;

export async function addContactToLoops(
  email: string,
  name?: string,
  referralCode?: string,
): Promise<void> {
  if (!LOOPS_API_KEY) return;

  const firstName = name?.split(/\s+/)[0];
  const lastName = name?.split(/\s+/).slice(1).join(" ") || undefined;

  try {
    // Upsert contact
    await fetch("https://app.loops.so/api/v1/contacts/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        firstName,
        lastName,
        source: "pancake-landing",
        userGroup: "early-access",
        referralCode,
        referralLink: referralCode ? `https://trypancake.ai/signup?ref=${referralCode}` : "",
      }),
    });

    // Fire signup_complete event (triggers welcome email automation)
    await fetch("https://app.loops.so/api/v1/events/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        eventName: "signup_complete",
        eventProperties: {
          referralCode,
          referralLink: referralCode ? `https://trypancake.ai/signup?ref=${referralCode}` : "",
        },
      }),
    });
  } catch (err) {
    // Non-blocking — don't fail the signup if Loops is down
    console.error("Loops sync error:", err);
  }
}
