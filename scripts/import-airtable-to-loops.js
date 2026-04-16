#!/usr/bin/env node
// Import all Airtable signups into Loops
// Usage: node import-airtable-to-loops.js

const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || "";
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID || "appDGopwKZAGRW5v9";
const AIRTABLE_TABLE = process.env.AIRTABLE_TABLE || "tblXBOYUY7OfKItXz";
const LOOPS_KEY = process.env.LOOPS_API_KEY || "";

async function fetchAllAirtableRecords() {
  let records = [];
  let offset = null;
  do {
    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${AIRTABLE_TABLE}?pageSize=100${offset ? `&offset=${offset}` : ""}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` } });
    const data = await res.json();
    records = records.concat(data.records || []);
    offset = data.offset || null;
  } while (offset);
  return records;
}

async function upsertLoopsContact(email, firstName, lastName) {
  const res = await fetch("https://app.loops.so/api/v1/contacts/update", {
    method: "PUT",
    headers: { Authorization: `Bearer ${LOOPS_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.toLowerCase().trim(),
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      source: "airtable-import",
      userGroup: "early-access",
    }),
  });
  return res.json();
}

function parseName(fullName) {
  if (!fullName) return { firstName: undefined, lastName: undefined };
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") || undefined };
}

const TEST_EMAILS = ["test@trymantis.ai", "test-pancake@example.com", "test-direct@example.com", "francois@getpancake.ai"];

async function main() {
  console.log("Fetching Airtable records...");
  const records = await fetchAllAirtableRecords();
  console.log(`Found ${records.length} records`);

  let imported = 0, skipped = 0, failed = 0;

  for (const record of records) {
    const { Email, Name } = record.fields;
    if (!Email || !Email.includes("@")) { skipped++; continue; }
    if (TEST_EMAILS.includes(Email.toLowerCase())) { console.log(`  SKIP (test): ${Email}`); skipped++; continue; }

    const { firstName, lastName } = parseName(Name);
    try {
      const result = await upsertLoopsContact(Email, firstName, lastName);
      if (result.success) {
        console.log(`  OK: ${Email}`);
        imported++;
      } else {
        console.log(`  FAIL: ${Email} — ${JSON.stringify(result)}`);
        failed++;
      }
      // Respect rate limits
      await new Promise(r => setTimeout(r, 50));
    } catch (err) {
      console.log(`  ERROR: ${Email} — ${err.message}`);
      failed++;
    }
  }

  console.log(`\nDone. Imported: ${imported}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
