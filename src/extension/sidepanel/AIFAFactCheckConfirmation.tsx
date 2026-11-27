import React, { useState } from 'react';
import { CheckCircle2, Copy, Check, FileText } from 'lucide-react';
import { Badge, Button, Card, Icon } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';

export const AIFAFactCheckConfirmation: React.FC = () => {
  const { currentRequest, returnToResults, viewRequestDetail } = useAifa();
  const [copied, setCopied] = useState(false);

  if (!currentRequest) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentRequest.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rows = [
    { label: 'Claim:', value: `"${currentRequest.claimText}"` },
    { label: 'Platform:', value: currentRequest.sourcePlatform },
    { label: 'Submitted:', value: currentRequest.timestamp },
  ];

  return (
    <div className="px-4 py-16 flex flex-col gap-block">
      {/* Success Badge Banner */}
      <div className="pt-8 flex flex-col items-center gap-text text-center">
        <div className="size-avatar rounded-full bg-card text-success flex items-center justify-center">
          <Icon icon={CheckCircle2} size="xl" />
        </div>
        <h3 className="text-heading text-foreground">Fact-Check Request Submitted</h3>
        <p className="text-body-sm text-muted-foreground">
          Your request has been recorded in this demonstration. No real submission has been made.
        </p>
      </div>

      {/* Reference Code Card */}
      <Card variant="raised" className="flex flex-col gap-12">
        <div className="flex items-center justify-between gap-inline">
          <span className="text-label-sm text-foreground">Tracking Reference</span>
          <Badge size="sm" variant="outline" className="self-center">
            Status: {currentRequest.status}
          </Badge>
        </div>

        <div className="flex items-center justify-between gap-12 bg-muted pl-16 pr-4 py-4 rounded-control">
          <span className="text-label text-foreground">{currentRequest.referenceNumber}</span>
          <Button size="sm" icon={copied ? Check : Copy} onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>

        <dl className="flex flex-col gap-6">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between gap-12 text-caption">
              <dt className="shrink-0 text-muted-foreground">{row.label}</dt>
              <dd className="min-w-0 text-foreground text-right truncate">{row.value}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-8">
        <Button icon={FileText} onClick={() => viewRequestDetail(currentRequest)} className="w-full">
          View Request Status
        </Button>
        <Button variant="outline" onClick={returnToResults} className="w-full">
          Back to Verification
        </Button>
      </div>
    </div>
  );
};
