import { listAllRecords, TABLES } from "./airtable";

export type Point = { date: string; value: number };

export type Metrics = {
  /** Signups with a usable `Signup Date` (same sum as the chart’s cumulative total). */
  totalSignups: number;
  /** Rows in Airtable with no `Signup Date` — excluded from daily / cumulative series. */
  signupsWithoutDate: number;
  ambassadors: number;
  invitesSent: number;
  conversionPct: number;
  /** Sorted ASC by date, densely filled (one point per day). */
  dailySignups: Point[];
  dailyAmbassadors: Point[];
  cumulativeSignups: Point[];
  cumulativeAmbassadors: Point[];
  todaySignups: number;
  updatedAt: string;
};

/**
 * Bucket by calendar day in UTC. Plain `YYYY-MM-DD` from Airtable is used as-is
 * so we don’t shift a local-midnight instant into the previous/next UTC day.
 */
function toUtcDay(raw: string | undefined): string | null {
  if (raw == null) return null;
  const t = String(raw).trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const d = new Date(t);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function isoDay(input: string | number | Date): string {
  return new Date(input).toISOString().slice(0, 10);
}

function addDay(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

function buildDateRange(startIso: string, endIso: string): string[] {
  const out: string[] = [];
  let cursor = startIso;
  while (cursor <= endIso) {
    out.push(cursor);
    cursor = addDay(cursor);
  }
  return out;
}

export async function getMetrics(): Promise<Metrics> {
  if (!process.env.AIRTABLE_TOKEN || !process.env.AIRTABLE_BASE_ID) {
    throw new Error("AIRTABLE env vars missing");
  }

  const records = await listAllRecords(TABLES.signups, {
    fields: ["Signup Date", "Referral Count"],
    sortField: "Signup Date",
    sortDirection: "asc",
  });

  const dailySignupMap = new Map<string, number>();
  const dailyAmbassadorMap = new Map<string, number>();
  let invitesSent = 0;
  let ambassadors = 0;
  let signupsWithoutDate = 0;

  for (const r of records) {
    const refCount = Number(r.fields["Referral Count"] ?? 0);
    if (Number.isFinite(refCount) && refCount > 0) {
      invitesSent += refCount;
      ambassadors += 1;
    }

    const raw = r.fields["Signup Date"] as string | undefined;
    const day = toUtcDay(raw);
    if (!day) {
      signupsWithoutDate += 1;
      continue;
    }
    dailySignupMap.set(day, (dailySignupMap.get(day) ?? 0) + 1);
    if (Number.isFinite(refCount) && refCount > 0) {
      dailyAmbassadorMap.set(day, (dailyAmbassadorMap.get(day) ?? 0) + 1);
    }
  }

  const totalSignups = records.length - signupsWithoutDate;
  // % of *all* table rows who ever referred (unchanged from previous product sense).
  const conversionPct = records.length === 0 ? 0 : (ambassadors / records.length) * 100;

  const allDays = Array.from(dailySignupMap.keys()).sort();
  const today = isoDay(new Date());

  if (allDays.length === 0) {
    return {
      totalSignups,
      signupsWithoutDate,
      ambassadors,
      invitesSent,
      conversionPct,
      dailySignups: [],
      dailyAmbassadors: [],
      cumulativeSignups: [],
      cumulativeAmbassadors: [],
      todaySignups: 0,
      updatedAt: new Date().toISOString(),
    };
  }

  const start = allDays[0];
  const end = today > allDays[allDays.length - 1] ? today : allDays[allDays.length - 1];
  const days = buildDateRange(start, end);

  const dailySignups: Point[] = days.map((d) => ({
    date: d,
    value: dailySignupMap.get(d) ?? 0,
  }));
  const dailyAmbassadors: Point[] = days.map((d) => ({
    date: d,
    value: dailyAmbassadorMap.get(d) ?? 0,
  }));

  let cs = 0;
  const cumulativeSignups: Point[] = dailySignups.map((p) => {
    cs += p.value;
    return { date: p.date, value: cs };
  });

  let ca = 0;
  const cumulativeAmbassadors: Point[] = dailyAmbassadors.map((p) => {
    ca += p.value;
    return { date: p.date, value: ca };
  });

  return {
    totalSignups,
    signupsWithoutDate,
    ambassadors,
    invitesSent,
    conversionPct,
    dailySignups,
    dailyAmbassadors,
    cumulativeSignups,
    cumulativeAmbassadors,
    todaySignups: dailySignupMap.get(today) ?? 0,
    updatedAt: new Date().toISOString(),
  };
}
