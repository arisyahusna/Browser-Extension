/* Shared date and period helpers for the Analytics page and the Overview activity card. */

export const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/**
 * The app stores display strings: seeded records look like "11 Nov 2026, 11:25 AM",
 * while records created this session only carry a time ("11:25 AM") or "Just now".
 * Anything without a date part happened today.
 */
export const parseAppDate = (value: string, now: Date): Date => {
  const m = value.match(/(\d{1,2})\s+([A-Za-z]{3})[a-z]*\s+(\d{4})(?:,?\s*(\d{1,2}):(\d{2})\s*(AM|PM)?)?/i);
  if (!m) return now;
  const month = MONTHS[m[2].toLowerCase()];
  if (month === undefined) return now;
  let hours = m[4] ? Number(m[4]) : 0;
  const ampm = m[6]?.toUpperCase();
  if (ampm === 'PM' && hours < 12) hours += 12;
  if (ampm === 'AM' && hours === 12) hours = 0;
  return new Date(Number(m[3]), month, Number(m[1]), hours, m[5] ? Number(m[5]) : 0);
};

export const shortDate = (d: Date) => d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

export type PeriodKey = '7d' | '30d' | '90d' | 'all';

export const PERIODS: { key: PeriodKey; label: string; days: number | null }[] = [
  { key: '7d', label: '7 days', days: 7 },
  { key: '30d', label: '30 days', days: 30 },
  { key: '90d', label: '90 days', days: 90 },
  { key: 'all', label: 'All time', days: null },
];

export const getPeriod = (key: PeriodKey) => PERIODS.find((p) => p.key === key)!;

/**
 * Start of the period (inclusive) and the start of tomorrow (exclusive end).
 * "All time" starts at the earliest date given, but never spans fewer than 7 days.
 */
export const getRange = (key: PeriodKey, dates: Date[], now: Date) => {
  const today = startOfDay(now);
  const end = new Date(today.getTime() + DAY_MS);
  const { days } = getPeriod(key);
  let start: Date;
  if (days) {
    start = new Date(today.getTime() - (days - 1) * DAY_MS);
  } else {
    start = startOfDay(dates.reduce((min, d) => (d < min ? d : min), today));
    const minStart = new Date(today.getTime() - 6 * DAY_MS);
    if (start > minStart) start = minStart;
  }
  return { start, end };
};

export const rangeText = (key: PeriodKey, start: Date) => {
  const { days, label } = getPeriod(key);
  return days ? `Last ${label}` : `Since ${shortDate(start)}`;
};
