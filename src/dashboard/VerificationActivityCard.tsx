import React, { useMemo, useState } from 'react';
import { ChartColumn, Table2 } from 'lucide-react';
import {
  BarChart,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { DAY_MS, PeriodKey, getRange, parseAppDate, rangeText, shortDate } from './analyticsUtils';

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
  // BarChart prints every label on its x axis, so a week is named by its first day there.
  const chartData = buckets.map((b) => ({ label: shortDate(b.start), value: b.count }));

  return (
    <Card variant="raised" className={className}>
      <div className="flex items-start justify-between gap-12">
        <div>
          <h2 className="text-label text-foreground">Verification activity</h2>
          <p className="text-caption text-muted-foreground">
            Verifications per {unit} · {rangeLabel}
          </p>
        </div>
        <div className="flex items-center gap-inline shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={showTable ? ChartColumn : Table2}
            onClick={() => setShowTable((v) => !v)}
            aria-pressed={showTable}
          >
            {showTable ? 'Chart' : 'Table'}
          </Button>
          {action}
        </div>
      </div>

      {showTable ? (
        <div className="max-h-chart overflow-y-auto">
          <Table label={`Verifications per ${unit}`}>
            <TableHeader>
              <TableRow>
                <TableHead>{bucketDays === 1 ? 'Day' : 'Week'}</TableHead>
                <TableHead align="num">Verifications</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...buckets].reverse().map((b) => (
                <TableRow key={b.start.getTime()}>
                  <TableCell>{b.label}</TableCell>
                  <TableCell align="num">{b.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <BarChart data={chartData} format={(v) => `${v} verification${v === 1 ? '' : 's'}`} />
      )}
    </Card>
  );
};
