import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Card, Icon, IconButton } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';

export const AIFAFactCheckDetail: React.FC = () => {
  const { currentRequest, returnToResults } = useAifa();

  if (!currentRequest) return null;

  const timelineSteps = [
    { title: 'Submitted', desc: 'Inquiry received by demo system', time: currentRequest.timestamp, completed: true },
    { title: 'Under Review', desc: 'Assigned to Sebenarnya.my fact-checker queue', time: 'Queued', completed: false },
    { title: 'Completed', desc: 'Published fact-check clarification report', time: 'Pending', completed: false },
  ];

  return (
    <div className="px-4 py-8 flex flex-col gap-group">
      {/* Header */}
      <div className="flex items-center gap-12">
        <IconButton
          icon={ArrowLeft}
          size="icon-sm"
          onClick={returnToResults}
          title="Back to verification results"
          label="Back to verification results"
        />
        <div>
          <h3 className="text-title text-foreground">Request Status & Tracking</h3>
          <p className="text-caption text-muted-foreground">{currentRequest.referenceNumber}</p>
        </div>
      </div>

      {/* Progress Timeline */}
      <Card variant="raised" className="flex flex-col gap-group">
        <h4 className="text-label-sm text-foreground">Verification Review Pipeline</h4>
        <ol className="flex flex-col gap-group">
          {timelineSteps.map((step, idx) => (
            <li key={step.title} className="flex items-start gap-12 relative">
              {idx < timelineSteps.length - 1 && (
                <div
                  aria-hidden="true"
                  className={`absolute left-12 top-24 -bottom-16 w-2 rounded-full ${
                    step.completed ? 'bg-success' : 'bg-muted-strong'
                  }`}
                />
              )}
              <div className="z-1 shrink-0">
                {step.completed ? (
                  <span className="size-badge rounded-full bg-success text-foreground-inverse flex items-center justify-center">
                    <Icon icon={CheckCircle2} />
                  </span>
                ) : (
                  <span className="size-badge rounded-full bg-muted-strong text-caption text-muted-foreground flex items-center justify-center">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-center gap-inline">
                  <span className={`text-label-sm ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </span>
                  <span className="text-caption text-muted-foreground">{step.time}</span>
                </div>
                <p className="text-caption text-muted-foreground">{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* Request Details */}
      <Card variant="raised" className="flex flex-col gap-text">
        <h4 className="text-label-sm text-foreground">Inquiry Record</h4>
        <div className="flex flex-col gap-6 text-body-sm text-text-secondary">
          <div>
            <span className="font-medium text-foreground">Claim Statement: </span>
            <span>"{currentRequest.claimText}"</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Platform: </span>
            <span>{currentRequest.sourcePlatform}</span>
          </div>
          {currentRequest.additionalNotes && (
            <div>
              <span className="font-medium text-foreground">User Notes: </span>
              <span className="italic">"{currentRequest.additionalNotes}"</span>
            </div>
          )}
        </div>
      </Card>

      <Button onClick={returnToResults} className="w-full">
        Back to Verification
      </Button>
    </div>
  );
};
