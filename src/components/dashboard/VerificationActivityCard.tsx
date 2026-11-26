import React, { useMemo, useState } from 'react';
import { ChartColumn, Table2 } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { DAY_MS, PeriodKey, getRange, parseAppDate, rangeText, shortDate } from './analyticsUtils';

// Single-series bars carry one fixed color; the gridlines sit one step off the white card.
export const ACTIVITY_COLOR = '#5774BC';
const GRID = '#ECEBE8';

export const chartCard = 'bg-white rounded-[28px] border border-[#E0DED9] p-5 sm:p-6';
export const chartGhostButton =
  'h-9 px-3.5 rounded-full border border-[#2A2A2A]/15 text-xs font-semibold text-[#2A2A2A] flex items-center gap-1.5 hover:bg-[#E2E4EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40';

export const ChartTooltip: React.FC<{ leftPct: number; value: string; label: string }> = ({
  leftPct,
  value,
  label,
}) => (
  <div
    role="presentation"
    className="pointer-events-none absolute bottom-full mb-2 -translate-x-1/2 whitespace-nowrap rounded-xl bg-[#2A2A2A] px-3 py-2 text-white shadow-lg z-10"
    style={{ left: `${Math.min(Math.max(leftPct, 8), 92)}%` }}
  >
    <div className="text-sm font-semibold leading-none">{value}</div>
    <div className="mt-1 text-[11px] text-white/70 leading-none">{label}</div>
  </div>
);

interface Bucket {
  start: Date;
  label: string;
  count: number;
}

interface VerificationActivityCardProps {
  period: PeriodKey;
  className?: string;
  /** Extra control shown beside the Table/Chart toggle, e.g. a link to the Analytics page. */
  action?: React.ReactNode;
}

/** Column chart of verifications per day (weekly past 45 days), with a table view twin. */
export const VerificationActivityCard: React.FC<VerificationActivityCardProps> = ({
  period,
  className = '',
  action,
}) => {
  const { verificationHistory } = useAifa();
  const [showTable, setShowTable] = useState(false);
  const [hoveredBucket, setHoveredBucket] = useState<number | null>(null);

  const { buckets, bucketDays, rangeLabel } = useMemo(() => {
    const now = new Date();
    const dates = verificationHistory.map((r) => parseAppDate(r.verifiedAt, now));
    const { start: rangeStart, end: rangeEnd } = getRange(period, dates, now);

    const spanDays = Math.round((rangeEnd.getTime() - rangeStart.getTime()) / DAY_MS);
    const size = spanDays > 45 ? 7 : 1;
    const list: Bucket[] = [];
    for (let end = rangeEnd; end > rangeStart; ) {
      const start = new Date(Math.max(end.getTime() - size * DAY_MS, rangeStart.getTime()));
      const lastDay = new Date(end.getTime() - DAY_MS);
      list.unshift({
        start,
        label: size === 1 ? shortDate(start) : `${shortDate(start)} – ${shortDate(lastDay)}`,
        count: dates.filter((d) => d >= start && d < end).length,
      });
      end = start;
    }
    return { buckets: list, bucketDays: size, rangeLabel: rangeText(period, rangeStart).toLowerCase() };
  }, [verificationHistory, period]);

  const unit = bucketDays === 1 ? 'day' : 'week';
  const maxCount = Math.max(0, ...buckets.map((b) => b.count));
  const step = [1, 2, 5, 10, 20, 50, 100, 200, 500].find((s) => Math.ceil(maxCount / s) <= 4) ?? 1000;
  const top = Math.max(step, Math.ceil(maxCount / step) * step);
  const ticks = Array.from({ length: top / step + 1 }, (_, i) => i * step).reverse();
  const last = buckets.length - 1;
  const xLabelIdx = new Set([0, Math.floor(last / 2), last]);
  const hovered = hoveredBucket !== null ? buckets[hoveredBucket] : null;

  return (
    <section className={`${chartCard} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold text-[#2A2A2A]">Verification activity</h2>
          <p className="text-xs text-[#6F6D69] mt-0.5">
            Verifications per {unit} · {rangeLabel}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowTable((v) => !v)}
            aria-pressed={showTable}
            className={chartGhostButton}
          >
            {showTable ? <ChartColumn className="w-3.5 h-3.5" /> : <Table2 className="w-3.5 h-3.5" />}
            <span>{showTable ? 'Chart' : 'Table'}</span>
          </button>
          {action}
        </div>
      </div>

      {showTable ? (
        <div className="mt-4 max-h-[220px] overflow-y-auto rounded-2xl border border-[#ECEBE8]">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-[#F7F7F5] text-left text-xs text-[#6F6D69]">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold">
                  {bucketDays === 1 ? 'Day' : 'Week'}
                </th>
                <th scope="col" className="px-4 py-2 font-semibold text-right">
                  Verifications
                </th>
              </tr>
            </thead>
            <tbody>
              {[...buckets].reverse().map((b) => (
                <tr key={b.start.getTime()} className="border-t border-[#ECEBE8]">
                  <td className="px-4 py-2 text-[#2A2A2A]">{b.label}</td>
                  <td className="px-4 py-2 text-right tabular-nums text-[#2A2A2A]">{b.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-5 flex gap-3">
          {/* Y axis */}
          <div className="h-[200px] flex flex-col justify-between text-[11px] tabular-nums text-[#6F6D69] text-right -my-[7px]">
            {ticks.map((t) => (
              <span key={t} className="leading-[14px]">
                {t}
              </span>
            ))}
          </div>

          <div className="flex-1 min-w-0">
            {/* Plot */}
            <div className="relative h-[200px]">
              {ticks.map((t) => (
                <div
                  key={t}
                  aria-hidden="true"
                  className="absolute inset-x-0 h-px"
                  style={{ bottom: `${(t / top) * 100}%`, backgroundColor: GRID }}
                />
              ))}
              {hovered && hoveredBucket !== null && (
                <ChartTooltip
                  leftPct={((hoveredBucket + 0.5) / buckets.length) * 100}
                  value={`${hovered.count} verification${hovered.count === 1 ? '' : 's'}`}
                  label={hovered.label}
                />
              )}
              <div
                role="img"
                aria-label={`Verifications per ${unit}, ${rangeLabel}. Peak ${maxCount}. Use the Table button for every value.`}
                className="absolute inset-0 flex items-end gap-[2px]"
                onPointerLeave={() => setHoveredBucket(null)}
              >
                {buckets.map((b, i) => (
                  <div
                    key={b.start.getTime()}
                    onPointerEnter={() => setHoveredBucket(i)}
                    className="flex-1 h-full flex items-end justify-center"
                  >
                    <div
                      className="w-full max-w-[24px] rounded-t transition-opacity"
                      style={{
                        height: b.count ? `${(b.count / top) * 100}%` : 0,
                        backgroundColor: ACTIVITY_COLOR,
                        opacity: hoveredBucket !== null && hoveredBucket !== i ? 0.45 : 1,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* X axis */}
            <div className="relative h-5 mt-2 text-[11px] text-[#6F6D69]" aria-hidden="true">
              {buckets.map((b, i) =>
                xLabelIdx.has(i) ? (
                  <span
                    key={b.start.getTime()}
                    className={`absolute top-0 whitespace-nowrap ${
                      i === 0 ? 'left-0' : i === last ? 'right-0' : '-translate-x-1/2'
                    }`}
                    style={i === 0 || i === last ? undefined : { left: `${((i + 0.5) / buckets.length) * 100}%` }}
                  >
                    {i === last && bucketDays === 1 ? 'Today' : shortDate(b.start)}
                  </span>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
