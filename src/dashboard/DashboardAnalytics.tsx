import React, { useMemo, useState } from 'react';
import { ArrowRight, ClipboardList } from 'lucide-react';
import { BarList, Button, Card, Stat, Tabs } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { ClaimVerdict, OverallAssessment, VerificationHistoryRecord } from '../types/aifa';
import { FactCheckRequest, FactCheckRequestStatus } from '../types/social';
import { DashboardNavigate } from './dashboardTypes';
import { DAY_MS, PERIODS, PeriodKey, getPeriod, getRange, parseAppDate, rangeText } from './analyticsUtils';
import { VerificationActivityCard } from './VerificationActivityCard';

/* ------------------------------------------------------------------ */
/* Verdicts                                                            */
/* ------------------------------------------------------------------ */

// Design-system charts are monochrome (one ink series), so verdicts are told apart by name,
// with every count and share printed, never by colour.
type Verdict = OverallAssessment;

const VERDICTS: { key: Verdict; label: string }[] = [
  { key: 'supported', label: 'Supported' },
  { key: 'mixed', label: 'Mixed' },
  { key: 'misleading', label: 'Misleading' },
  { key: 'false', label: 'False' },
  { key: 'unverified', label: 'Unverified' },
];

const cardTitle = 'text-label text-foreground';
const cardSubtitle = 'text-caption text-muted-foreground';

const EmptyNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="py-32 text-center text-body-sm text-muted-foreground">{children}</p>
);

/** One verdict mix as a ranked bar list: count and share on every row. */
const VerdictList: React.FC<{ title: string; counts: Record<Verdict, number>; unit: string }> = ({
  title,
  counts,
  unit,
}) => {
  const total = VERDICTS.reduce((sum, v) => sum + counts[v.key], 0);
  const data = VERDICTS.filter((v) => counts[v.key] > 0).map((v) => ({ label: v.label, value: counts[v.key] }));

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-baseline justify-between gap-12">
        <h3 className="text-label-sm text-foreground">{title}</h3>
        <span className="text-caption text-muted-foreground">
          {total} {unit}
          {total === 1 ? '' : 's'}
        </span>
      </div>
      {total === 0 ? (
        <p className="text-caption text-muted-foreground">No data</p>
      ) : (
        <BarList data={data} format={(value) => `${value} · ${Math.round((value / total) * 100)}%`} />
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
      // A count change, not a percentage, so it is printed as text (Stat's delta is a %).
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
      foot: null,
    },
    {
      label: 'Flagged content',
      value: `${flaggedPct}%`,
      detail: `${data.flagged} of ${data.total} rated false or misleading`,
      foot: null,
    },
    {
      label: 'Fact-check inquiries',
      value: String(data.requestsTotal),
      detail: `${data.statusCounts.Completed} completed · ${data.requestsTotal - data.statusCounts.Completed} pending`,
      foot: null,
    },
  ];

  /* ---- Pipeline ---- */
  const pipeline: { status: FactCheckRequestStatus; hint: string }[] = [
    { status: 'Submitted', hint: 'Waiting to be picked up' },
    { status: 'Under Review', hint: 'Being checked by Sebenarnya.my' },
    { status: 'Completed', hint: 'Verdict published to you' },
  ];

  return (
    <div className="flex flex-col gap-block">
      {/* Title + period filter (one row, scopes everything below) */}
      <section className="flex flex-row sm:flex-col items-end sm:items-start justify-between gap-group py-8">
        <div className="flex flex-col gap-text">
          <h1 className="text-display text-foreground">Analytics</h1>
          <p className="text-body text-muted-foreground">
            How you've been fact-checking: activity, verdicts, sources and inquiry progress.
          </p>
        </div>
        <Tabs
          mode="toggle"
          label="Time period"
          value={period}
          onChange={(value) => setPeriod(value as PeriodKey)}
          items={PERIODS.map((p) => ({ value: p.key, label: p.label }))}
          className="shrink-0 whitespace-nowrap"
        />
      </section>

      {/* Stat tiles */}
      <section aria-label={`Summary, ${rangeLabel.toLowerCase()}`} className="grid grid-cols-4 lg:grid-cols-2 gap-cards">
        {tiles.map(({ label, value, detail, foot }) => (
          <Card key={label} variant="raised" className="gap-8">
            <Stat label={label} value={value} />
            <div className="flex flex-col gap-2 text-caption text-muted-foreground">
              {foot && <span className="text-text-secondary">{foot}</span>}
              <span>{detail}</span>
            </div>
          </Card>
        ))}
      </section>

      <div className="grid grid-cols-3 lg:grid-cols-1 gap-cards">
        {/* Activity */}
        <VerificationActivityCard period={period} className="col-span-2 lg:col-span-1" />

        {/* Inquiry pipeline */}
        <Card variant="raised">
          <div>
            <h2 className={cardTitle}>Inquiry progress</h2>
            <p className={cardSubtitle}>Fact-checks you requested · {rangeLabel.toLowerCase()}</p>
          </div>

          {data.requestsTotal === 0 ? (
            <EmptyNote>No inquiries submitted in this period.</EmptyNote>
          ) : (
            <ol className="flex flex-col gap-8">
              {pipeline.map(({ status, hint }, i) => (
                <li key={status} className="flex items-center gap-12 rounded-media bg-muted px-16 py-12">
                  <span className="size-badge shrink-0 rounded-full bg-card border border-border text-caption text-text-secondary flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-label-sm text-foreground">{status}</div>
                    <div className="text-caption text-muted-foreground truncate">{hint}</div>
                  </div>
                  <span className="text-title text-foreground">{data.statusCounts[status]}</span>
                </li>
              ))}
            </ol>
          )}

          <div className="mt-auto">
            <Button variant="outline" size="sm" icon={ClipboardList} onClick={() => onSwitchTab('requests')}>
              View inquiries
            </Button>
          </div>
        </Card>

        {/* Verdict mix */}
        <Card variant="raised" className="col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between gap-12">
            <div>
              <h2 className={cardTitle}>Verdict breakdown</h2>
              <p className={cardSubtitle}>Overall result per verification, and per individual claim</p>
            </div>
            <Button variant="outline" size="sm" iconEnd={ArrowRight} onClick={() => onOpenHistory('all')}>
              View history
            </Button>
          </div>

          {data.total === 0 ? (
            <EmptyNote>No verifications in this period.</EmptyNote>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-1 gap-block">
              <VerdictList title="Verifications" counts={data.overall} unit="verification" />
              <VerdictList title="Claims" counts={data.claims} unit="claim" />
            </div>
          )}
        </Card>

        {/* Top sources */}
        <Card variant="raised">
          <div>
            <h2 className={cardTitle}>Most-checked sources</h2>
            <p className={cardSubtitle}>Where the content you verified came from</p>
          </div>

          {data.sources.length === 0 ? (
            <EmptyNote>No sources in this period.</EmptyNote>
          ) : (
            <BarList data={data.sources.map((s) => ({ label: s.name, value: s.count }))} />
          )}
        </Card>
      </div>
    </div>
  );
};
