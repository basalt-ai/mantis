// Loops email integration helper
const LOOPS_API_KEY = process.env.LOOPS_API_KEY!;
const BASE_URL = "https://app.loops.so/api/v1";

async function loopsPost(path: string, body: object) {
  if (!LOOPS_API_KEY) return;
  try {
    await fetch(`${BASE_URL}${path}`, {
      method: path.includes("contacts") ? "PUT" : "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error(`Loops error [${path}]:`, err);
  }
}

function parseName(name?: string) {
  if (!name) return { firstName: undefined, lastName: undefined };
  const parts = name.trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") || undefined };
}

// 1. New signup — upserts contact + fires signup_complete
export async function addContactToLoops(
  email: string,
  name?: string,
  referralCode?: string,
): Promise<void> {
  if (!LOOPS_API_KEY) return;
  const { firstName, lastName } = parseName(name);
  const cleanEmail = email.toLowerCase().trim();
  const referralLink = referralCode ? `https://trypancake.ai/signup?ref=${referralCode}` : "";

  // Upsert contact with referral info as contact properties
  await loopsPost("/contacts/update", {
    email: cleanEmail,
    firstName,
    lastName,
    source: "pancake-landing",
    userGroup: "early-access",
    referralCode,
    referralLink,
  });

  // Fire signup_complete event
  await loopsPost("/events/send", {
    email: cleanEmail,
    eventName: "signup_complete",
    eventProperties: { referralCode, referralLink },
  });
}

// 2. Invite sent — upserts invitee contact (no name yet) + fires friend_invited
//    so they receive a "your friend invited you" email
export async function sendInviteEmail(
  inviteeEmail: string,
  referrerName: string,
  referrerCode: string,
): Promise<void> {
  if (!LOOPS_API_KEY) return;
  const cleanEmail = inviteeEmail.toLowerCase().trim();
  const inviteLink = `https://trypancake.ai/signup?ref=${referrerCode}`;

  // Upsert invitee contact so Loops can send to them
  await loopsPost("/contacts/update", {
    email: cleanEmail,
    source: "referral-invite",
    userGroup: "invited",
    inviteLink,
    invitedBy: referrerName,
  });

  // Fire friend_invited event
  await loopsPost("/events/send", {
    email: cleanEmail,
    eventName: "friend_invited",
    eventProperties: {
      inviteLink,
      invitedBy: referrerName,
      referrerCode,
    },
  });
}

// 3. Early access granted — fires early_access_granted for all three
//    (the new signup + referrer + any other friend who also got unlocked)
export async function sendEarlyAccessEmail(email: string, referralCode?: string): Promise<void> {
  if (!LOOPS_API_KEY) return;
  const cleanEmail = email.toLowerCase().trim();
  const referralLink = referralCode ? `https://trypancake.ai/signup?ref=${referralCode}` : "";

  // Update contact to reflect early access status
  await loopsPost("/contacts/update", {
    email: cleanEmail,
    earlyAccess: true,
    referralCode,
    referralLink,
  });

  // Fire early_access_granted event
  await loopsPost("/events/send", {
    email: cleanEmail,
    eventName: "early_access_granted",
    eventProperties: { referralCode, referralLink },
  });
}
