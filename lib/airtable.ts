// Shared Airtable helper for Pancake
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN!;
const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID!;

const TABLES = {
  signups: "tblXBOYUY7OfKItXz",
  invites: "tbl6cnGtnzWSIZUFp",
} as const;

function airtableUrl(table: string, extra = "") {
  const base = AIRTABLE_BASE.trim();
  return `https://api.airtable.com/v0/${base}/${encodeURIComponent(table)}${extra}`;
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

export type AirtableRecord = { id: string; fields: Record<string, unknown> };

export async function listAllRecords(
  table: string,
  options: {
    fields?: string[];
    filterFormula?: string;
    sortField?: string;
    sortDirection?: "asc" | "desc";
  } = {},
): Promise<AirtableRecord[]> {
  const all: AirtableRecord[] = [];
  let offset: string | undefined;
  do {
    const params = new URLSearchParams();
    params.set("pageSize", "100");
    if (options.filterFormula) params.set("filterByFormula", options.filterFormula);
    if (options.sortField) {
      params.append("sort[0][field]", options.sortField);
      params.append("sort[0][direction]", options.sortDirection ?? "asc");
    }
    for (const f of options.fields ?? []) params.append("fields[]", f);
    if (offset) params.set("offset", offset);

    const res = await fetch(airtableUrl(table, `?${params}`), {
      headers: headers(),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Airtable list error: ${await res.text()}`);
    const data = (await res.json()) as { records: AirtableRecord[]; offset?: string };
    all.push(...data.records);
    offset = data.offset;
  } while (offset);
  return all;
}

export { TABLES };
