import React, { useMemo, useState } from 'react';
import { AlertTriangle, ArrowRight, ClipboardList, Clock, ListChecks, ScanSearch } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { ClaimVerdict, OverallAssessment, VerificationHistoryRecord } from '../../types/aifa';
import { FactCheckRequest, FactCheckRequestStatus } from '../../types/social';
import { DashboardNavigate } from './dashboardTypes';
import { DAY_MS, PERIODS, PeriodKey, getPeriod, getRange, parseAppDate, rangeText } from './analyticsUtils';
import {
  ACTIVITY_COLOR,
  ChartTooltip as Tooltip,
  VerificationActivityCard,
  chartCard as card,
  chartGhostButton as ghostButton,
} from './VerificationActivityCard';

/* ------------------------------------------------------------------ */
/* Palette                                                             */
/* ------------------------------------------------------------------ */

// Validated with the dataviz palette checker against the white card surface
// (CVD separation and normal-vision floor pass in this adjacency order). The gray is
// deliberately neutral: "unverified" means no verdict, so it should not read as a hue.
// Every verdict is also named in a legend, so identity never rests on color alone.
type Verdict = OverallAssessment;

const VERDICTS: { key: Verdict; label: string; color: string; ink: string }[] = [
  { key: 'supported', label: 'Supported', color: '#5774BC', ink: '#FFFFFF' },
  { key: 'mixed', label: 'Mixed', color: '#3FA58F', ink: '#1F1F1F' },
  { key: 'misleading', label: 'Misleading', color: '#E0A526', ink: '#1F1F1F' },
  { key: 'false', label: 'False', color: '#C8343F', ink: '#FFFFFF' },
  { key: 'unverified', label: 'Unverified', color: '#8C8A84', ink: '#FFFFFF' },
];

const cardTitle = 'text-[15px] font-semibold text-[#2A2A2A]';
const cardSubtitle = 'text-xs text-[#6F6D69] mt-0.5';

const EmptyNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="py-8 text-center text-xs text-[#6F6D69]">{children}</p>
);

/** Tall segmented bar: one whole split into verdict parts, share printed inside when it fits. */
const VerdictBar: React.FC<{ title: string; counts: Record<Verdict, number>; unit: string }> = ({
  title,
  counts,
  unit,
}) => {
  const [hovered, setHovered] = useState<Verdict | null>(null);
  const total = VERDICTS.reduce((sum, v) => sum + counts[v.key], 0);
  const parts = VERDICTS.filter((v) => counts[v.key] > 0);

  let offset = 0;
  const placed = parts.map((v) => {
    const share = counts[v.key] / total;
    const left = offset;
    offset += share;
    return { ...v, share, left };
  });
  const active = placed.find((p) => p.key === hovered);

  const summary = placed
    .map((p) => `${p.label} ${counts[p.key]} (${Math.round(p.share * 100)}%)`)
    .join(', ');

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-[13px] font-semibold text-[#2A2A2A]">{title}</h3>
        <span className="text-xs text-[#6F6D69]">
          {total} {unit}
          {total === 1 ? '' : 's'}
        </span>
      </div>

      {total === 0 ? (
        <div className="mt-2 h-7 rounded bg-[#F4F3F1]" aria-label={`${title}: no data`} role="img" />
      ) : (
        <div className="relative mt-2">
          {active && (
            <Tooltip
              leftPct={(active.left + active.share / 2) * 100}
              value={`${counts[active.key]} · ${Math.round(active.share * 100)}%`}
              label={active.label}
            />
          )}
          <div role="img" aria-label={`${title}: ${summary}`} className="flex h-7 gap-[2px]">
            {placed.map((p) => (
              <div
                key={p.key}
                onPointerEnter={() => setHovered(p.key)}
                onPointerLeave={() => setHovered(null)}
                className="h-full rounded transition-opacity flex items-center px-2 min-w-[4px]"
                style={{
                  flexGrow: counts[p.key],
                  flexBasis: 0,
                  backgroundColor: p.color,
                  opacity: hovered && hovered !== p.key ? 0.55 : 1,
                }}
              >
                {p.share >= 0.14 && (
                  <span className="text-[11px] font-semibold leading-none" style={{ color: p.ink }}>
                    {Math.round(p.share * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

interface DashboardAnalyticsProps {
  onSwitchTab: DashboardNavigate;
  onOpenHistory: (assessmentFilter: string) => void;
}

export const DashboardAnalytics: React.FC<DashboardAnalyticsProps> = ({ onSwitchTab, onOpenHistory }) => {
  const { verificationHistory, submittedRequests } = useAifa();
  const [period, setPeriod] = useState<PeriodKey>('30d');

  const data = useMemo(() => {
    const now = new Date();
    const records = verificationHistory.map((r) => ({ record: r, at: parseAppDate(r.verifiedAt, now) }));
    const requests = submittedRequests.map((r) => ({ request: r, at: parseAppDate(r.timestamp, now) }));

    const { days } = getPeriod(period);
    const { start: rangeStart, end: tomorrow } = getRange(period, records.map((r) => r.at), now);

    const inRange = (at: Date) => at >= rangeStart && at < tomorrow;
    const periodRecords: VerificationHistoryRecord[] = records.filter((r) => inRange(r.at)).map((r) => r.record);
    const periodRequests: FactCheckRequest[] = requests.filter((r) => inRange(r.at)).map((r) => r.request);

    // Same-length window immediately before this one, for the change figure.
    let previousCount: number | null = null;
    if (days) {
      const prevStart = new Date(rangeStart.getTime() - days * DAY_MS);
      previousCount = records.filter((r) => r.at >= prevStart && r.at < rangeStart).length;
    }

    // Verdict mixes.
    const overall = Object.fromEntries(VERDICTS.map((v) => [v.key, 0])) as Record<Verdict, number>;
    const claims = Object.fromEntries(VERDICTS.map((v) => [v.key, 0])) as Record<Verdict, number>;
    let claimTotal = 0;
    periodRecords.forEach((r) => {
      overall[r.overallAssessment] += 1;
      const list = r.result?.claims ?? [];
      list.forEach((c) => {
        claims[c.verdict as ClaimVerdict] += 1;
      });
      claimTotal += list.length || r.claimsCount;
    });

    // Sources, ranked; past five fold into "Other".
    const sourceMap = new Map<string, number>();
    periodRecords.forEach((r) => sourceMap.set(r.platformName, (sourceMap.get(r.platformName) ?? 0) + 1));
    const ranked = [...sourceMap.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
    const sources = ranked.slice(0, 5).map(([name, count]) => ({ name, count }));
    const otherCount = ranked.slice(5).reduce((sum, [, c]) => sum + c, 0);
    if (otherCount > 0) sources.push({ name: 'Other', count: otherCount });

    const statusCounts: Record<FactCheckRequestStatus, number> = {
      Submitted: 0,
      'Under Review': 0,
      Completed: 0,
    };
    periodRequests.forEach((r) => {
      statusCounts[r.status] += 1;
    });

    return {
      days,
      rangeStart,
      total: periodRecords.length,
      previousCount,
      articles: periodRecords.filter((r) => r.contentType === 'article').length,
      socialPosts: periodRecords.filter((r) => r.contentType === 'social-post').length,
      flagged: overall.false + overall.misleading,
      claimTotal,
      overall,
      claims,
      sources,
      requestsTotal: periodRequests.length,
      statusCounts,
    };
  }, [verificationHistory, submittedRequests, period]);

  const periodLabel = getPeriod(period);
  const rangeLabel = rangeText(period, data.rangeStart);

  /* ---- Stat tiles ---- */
  const delta = data.previousCount === null ? null : data.total - data.previousCount;
  const flaggedPct = data.total ? Math.round((data.flagged / data.total) * 100) : 0;
  const avgClaims = data.total ? (data.claimTotal / data.total).toFixed(1) : '0';

  const tiles = [
    {
      label: 'Verifications',
      value: String(data.total),
      detail: `${data.articles} article${data.articles === 1 ? '' : 's'} · ${data.socialPosts} social post${
        data.socialPosts === 1 ? '' : 's'
      }`,
      icon: ScanSearch,
      tone: 'bg-[#DFE6F5] text-[#3F5C9E]',
      foot:
        delta === null
          ? null
          : delta === 0
          ? `No change vs previous ${periodLabel.label}`
          : `${delta > 0 ? '+' : '−'}${Math.abs(delta)} vs previous ${periodLabel.label}`,
    },
    {
      label: 'Claims analysed',
      value: String(data.claimTotal),
      detail: `${avgClaims} per verification on average`,
      icon: ListChecks,
      tone: 'bg-[#E2E4EA] text-[#2A2A2A]',
      foot: null,
    },
    {
      label: 'Flagged content',
      value: `${flaggedPct}%`,
      detail: `${data.flagged} of ${data.total} rated false or misleading`,
      icon: AlertTriangle,
      tone: 'bg-[#F7DEDB] text-[#9B3D36]',
      foot: null,
    },
    {
      label: 'Fact-check inquiries',
      value: String(data.requestsTotal),
      detail: `${data.statusCounts.Completed} completed · ${
        data.requestsTotal - data.statusCounts.Completed
      } pending`,
      icon: Clock,
      tone: 'bg-[#F4EBCB] text-[#715C1C]',
      foot: null,
    },
  ];

  /* ---- Pipeline ---- */
  const pipeline: { status: FactCheckRequestStatus; hint: string }[] = [
    { status: 'Submitted', hint: 'Waiting to be picked up' },
    { status: 'Under Review', hint: 'Being checked by Sebenarnya.my' },
    { status: 'Completed', hint: 'Verdict published to you' },
  ];

  const sourceMax = Math.max(1, ...data.sources.map((s) => s.count));

  return (
    <div className="space-y-5">
      {/* Title + period filter (one row, scopes everything below) */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 py-2">
        <div>
          <h1 className="text-3xl md:text-[36px] md:leading-[1.15] font-bold tracking-tight text-[#2A2A2A]">
            Analytics
          </h1>
          <p className="mt-2 text-sm text-[#6F6D69] leading-relaxed">
            How you've been fact-checking: activity, verdicts, sources and inquiry progress.
          </p>
        </div>
        <div
          role="radiogroup"
          aria-label="Time period"
          className="self-start sm:self-auto shrink-0 inline-flex rounded-full bg-white border border-[#E0DED9] p-1"
        >
          {PERIODS.map((p) => {
            const selected = p.key === period;
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setPeriod(p.key)}
                className={`h-8 px-3.5 rounded-full text-xs font-semibold transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40 ${
                  selected ? 'bg-[#2A2A2A] text-white' : 'text-[#5C5A56] hover:bg-[#E2E4EA]'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Stat tiles */}
      <section aria-label={`Summary, ${rangeLabel.toLowerCase()}`} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {tiles.map(({ label, value, detail, icon: Icon, tone, foot }) => (
          <div key={label} className="rounded-[28px] p-5 min-h-[150px] flex flex-col gap-4 bg-white border border-[#E0DED9]">
            <div className="flex items-start justify-between gap-2">
              <div className="text-[13px] font-semibold leading-snug text-[#2A2A2A]">{label}</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="mt-auto min-w-0">
              <div className="flex items-baseline gap-2 min-w-0">
                <span className="text-[34px] font-bold tracking-tight leading-none text-[#2A2A2A]">{value}</span>
                {foot && <span className="text-[11px] font-medium text-[#6F6D69] truncate">{foot}</span>}
              </div>
              <div className="mt-2 text-[11px] font-medium text-[#6F6D69] leading-snug">{detail}</div>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity */}
        <VerificationActivityCard period={period} className="lg:col-span-2" />

        {/* Inquiry pipeline */}
        <section className={`${card} flex flex-col`}>
          <h2 className={cardTitle}>Inquiry progress</h2>
          <p className={cardSubtitle}>Fact-checks you requested · {rangeLabel.toLowerCase()}</p>

          {data.requestsTotal === 0 ? (
            <EmptyNote>No inquiries submitted in this period.</EmptyNote>
          ) : (
            <ol className="mt-4 space-y-2.5">
              {pipeline.map(({ status, hint }, i) => {
                const count = data.statusCounts[status];
                return (
                  <li key={status} className="flex items-center gap-3 rounded-2xl bg-[#F7F7F5] px-4 py-3">
                    <span className="w-6 h-6 shrink-0 rounded-full bg-white border border-[#E0DED9] text-[11px] font-semibold text-[#5C5A56] flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#2A2A2A]">{status}</div>
                      <div className="text-[11px] text-[#6F6D69] truncate">{hint}</div>
                    </div>
                    <span className="text-xl font-bold text-[#2A2A2A]">{count}</span>
                  </li>
                );
              })}
            </ol>
          )}

          <div className="mt-auto pt-4">
            <button type="button" onClick={() => onSwitchTab('requests')} className={ghostButton}>
              <ClipboardList className="w-3.5 h-3.5" />
              <span>View inquiries</span>
            </button>
          </div>
        </section>

        {/* Verdict mix */}
        <section className={`${card} lg:col-span-2`}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className={cardTitle}>Verdict breakdown</h2>
              <p className={cardSubtitle}>Overall result per verification, and per individual claim</p>
            </div>
            <button type="button" onClick={() => onOpenHistory('all')} className={ghostButton}>
              <span>View history</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {data.total === 0 ? (
            <EmptyNote>No verifications in this period.</EmptyNote>
          ) : (
            <>
              <div className="mt-5 space-y-5">
                <VerdictBar title="Verifications" counts={data.overall} unit="verification" />
                <VerdictBar title="Claims" counts={data.claims} unit="claim" />
              </div>

              {/* Legend: names in block order, counts per row */}
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#5C5A56]">
                {VERDICTS.filter((v) => data.overall[v.key] + data.claims[v.key] > 0).map((v) => (
                  <li key={v.key} className="flex items-center gap-1.5">
                    <span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: v.color }} />
                    <span className="font-semibold text-[#2A2A2A]">{v.label}</span>
                    <span>
                      {data.overall[v.key]} verification{data.overall[v.key] === 1 ? '' : 's'} ·{' '}
                      {data.claims[v.key]} claim{data.claims[v.key] === 1 ? '' : 's'}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Top sources */}
        <section className={card}>
          <h2 className={cardTitle}>Most-checked sources</h2>
          <p className={cardSubtitle}>Where the content you verified came from</p>

          {data.sources.length === 0 ? (
            <EmptyNote>No sources in this period.</EmptyNote>
          ) : (
            <ul className="mt-4 space-y-3.5">
              {data.sources.map((s) => (
                <li key={s.name}>
                  <div className="flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-medium text-[#2A2A2A] truncate">{s.name}</span>
                    <span className="tabular-nums text-[#6F6D69] shrink-0">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 rounded-full bg-[#F1F0EE]">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(s.count / sourceMax) * 100}%`, backgroundColor: ACTIVITY_COLOR }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
};
