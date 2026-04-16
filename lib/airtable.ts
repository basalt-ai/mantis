// Shared Airtable helper for Pancake
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID!;

const TABLES = {
  signups: "Signups",
  invites: "Invites",
} as const;

function airtableUrl(table: string, extra = "") {
  return `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(table)}${extra}`;
}

function headers() {
  return {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
    "Content-Type": "application/json",
  };
}

export async function createRecord(table: string, fields: Record<string, unknown>) {
  const res = await fetch(airtableUrl(table), {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable create error: ${await res.text()}`);
  return res.json();
}

export async function findRecords(
  table: string,
  filterFormula: string,
  maxRecords = 10,
) {
  const params = new URLSearchParams({
    filterByFormula: filterFormula,
    maxRecords: String(maxRecords),
  });
  const res = await fetch(airtableUrl(table, `?${params}`), {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Airtable find error: ${await res.text()}`);
  const data = await res.json();
  return data.records as Array<{ id: string; fields: Record<string, unknown> }>;
}

export async function updateRecord(table: string, recordId: string, fields: Record<string, unknown>) {
  const res = await fetch(airtableUrl(table, `/${recordId}`), {
    method: "PATCH",
    headers: headers(),
    body: JSON.stringify({ fields }),
  });
  if (!res.ok) throw new Error(`Airtable update error: ${await res.text()}`);
  return res.json();
}

export function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8);
}

export { TABLES };
