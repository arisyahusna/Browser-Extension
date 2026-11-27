import React from 'react';
import { FileQuestion, Mail, ShieldCheck, Check } from 'lucide-react';
import { Alert, Badge, Button, Card, EmptyState, Icon } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { RequestStatusBadge } from './RequestStatusBadge';

type StepState = 'completed' | 'active' | 'upcoming';

const STATUS_LABELS = {
  Completed: 'Fact-Check Completed',
  'Under Review': 'Under Active Review',
  Submitted: 'Submitted & Queued',
} as const;

// Stepper: the design system has no stepper, so the circles use preset classes.
const stepCircle = (state: StepState, pulse = false) =>
  `mx-auto size-avatar-sm rounded-full flex items-center justify-center text-label-sm ${
    state === 'completed'
      ? 'bg-success text-foreground-inverse'
      : state === 'active'
      ? `bg-primary text-primary-foreground ${pulse ? 'animate-pulse' : ''}`
      : 'bg-muted-strong text-muted-foreground'
  }`;

export const DashboardRequests: React.FC = () => {
  const { submittedRequests, advanceRequestStatus, openEmailPreview, clearDemoRequests } = useAifa();

  const getStepState = (currentStatus: string, step: 'Submitted' | 'Under Review' | 'Completed'): StepState => {
    const order = ['Submitted', 'Under Review', 'Completed'];
    const currentIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(step);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="flex flex-col gap-block">
      {/* Title & Actions */}
      <div className="flex flex-row md:flex-col items-end md:items-start justify-between gap-group pt-8">
        <div className="flex flex-col gap-text">
          <h1 className="text-heading-lg text-foreground">Official Fact-Check Inquiries</h1>
          <p className="text-body text-muted-foreground">
            Track claims submitted to the Sebenarnya.my editorial and verification bureau.
          </p>
        </div>

        {submittedRequests.length > 0 && (
          <Button variant="outline" onClick={clearDemoRequests}>
            Reset Requests to Default
          </Button>
        )}
      </div>

      {/* Requests List */}
      <div className="flex flex-col gap-cards">
        {submittedRequests.length === 0 ? (
          <Card variant="raised">
            <EmptyState
              icon={FileQuestion}
              title="No Fact-Check Requests"
              description={
                'You haven\'t submitted any unverified claims yet. When AIFA detects an unverified claim, use the "Request Fact-Check" button to submit it for review.'
              }
            />
          </Card>
        ) : (
          submittedRequests.map((req) => {
            const isCompleted = req.status === 'Completed';
            const isUnderReview = req.status === 'Under Review';
            const submitted = getStepState(req.status, 'Submitted');
            const review = getStepState(req.status, 'Under Review');

            return (
              <Card key={req.id} variant="raised">
                {/* Header: Ref Number & Status */}
                <div className="flex flex-row sm:flex-col items-center sm:items-start justify-between gap-12">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-inline">
                      <span className="text-label text-foreground">{req.referenceNumber}</span>
                      <Badge size="sm">Priority: Standard</Badge>
                    </div>
                    <div className="text-caption text-muted-foreground">
                      Submitted: {req.timestamp} • Last update: {req.lastUpdated || req.timestamp}
                    </div>
                  </div>

                  <RequestStatusBadge status={req.status} label={STATUS_LABELS[req.status]} size="md" />
                </div>

                {/* Progress Stepper */}
                <div className="p-card rounded-media bg-muted">
                  <ol className="grid grid-cols-3 gap-8 text-center">
                    <li className="flex flex-col gap-6">
                      <div className={stepCircle(submitted)}>
                        <Icon icon={Check} />
                      </div>
                      <div className="text-label-sm text-foreground">1. Submitted</div>
                      <div className="text-caption text-muted-foreground">Claim received & logged</div>
                    </li>

                    <li className="flex flex-col gap-6">
                      <div className={stepCircle(review, true)}>
                        {review === 'completed' ? <Icon icon={Check} /> : '2'}
                      </div>
                      <div className="text-label-sm text-foreground">2. Under Review</div>
                      <div className="text-caption text-muted-foreground">Cross-checking official records</div>
                    </li>

                    <li className="flex flex-col gap-6">
                      <div className={stepCircle(isCompleted ? 'completed' : 'upcoming')}>
                        {isCompleted ? <Icon icon={Check} /> : '3'}
                      </div>
                      <div className={`text-label-sm ${isCompleted ? 'text-success' : 'text-foreground'}`}>3. Completed</div>
                      <div className="text-caption text-muted-foreground">Findings published</div>
                    </li>
                  </ol>
                </div>

                {/* Claim Statement & Submission Context */}
                <div className="flex flex-col gap-8">
                  <h3 className="text-label-sm text-foreground">Investigated Claim</h3>
                  <p className="p-16 bg-muted rounded-media text-body-sm font-medium text-foreground italic">
                    "{req.claimText}"
                  </p>

                  <div className="flex flex-wrap items-center gap-group text-body-sm text-text-secondary">
                    <div>
                      <span className="text-muted-foreground">Context Source: </span>
                      <strong className="text-foreground">{req.title}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Platform: </span>
                      <span className="font-medium text-foreground">{req.sourcePlatform}</span>
                    </div>
                  </div>

                  {req.additionalNotes && (
                    <p className="text-body-sm text-text-secondary bg-muted p-12 rounded-media">
                      <span className="font-medium text-foreground">Submitter Notes: </span>
                      {req.additionalNotes}
                    </p>
                  )}
                </div>

                {/* Reviewer Conclusion if Completed */}
                {isCompleted && (
                  <Alert
                    icon={ShieldCheck}
                    title="Official Sebenarnya.my Determination: FALSE RUMOR"
                    action={
                      <Button variant="outline" size="sm" icon={Mail} onClick={() => openEmailPreview(req)}>
                        View Simulated Notification Email
                      </Button>
                    }
                  >
                    <p>
                      Investigation confirmed no such circular or policy exists within the Ministry of Finance or
                      Malaysian government gazette. Circulating graphics are fraudulent reproductions.
                    </p>
                    <p className="mt-4 text-caption">
                      Archive #SEB-2026-8842 · Verified by: Sebenarnya.my Editorial Desk
                    </p>
                  </Alert>
                )}

                {/* Presenter Quick Actions Footer */}
                <div className="pt-16 border-t border-border flex flex-wrap items-center justify-between gap-12">
                  <span className="text-caption text-muted-foreground">Presenter Lifecycle Simulation:</span>

                  <div className="flex flex-wrap items-center gap-inline">
                    {!isUnderReview && (
                      <Button variant="secondary" size="sm" onClick={() => advanceRequestStatus(req.id, 'Under Review')}>
                        Set Under Review
                      </Button>
                    )}

                    {req.status !== 'Completed' && (
                      <Button variant="secondary" size="sm" onClick={() => advanceRequestStatus(req.id, 'Completed')}>
                        Complete Review
                      </Button>
                    )}

                    {req.status === 'Completed' && (
                      <Button variant="outline" size="sm" icon={Mail} onClick={() => openEmailPreview(req)}>
                        View Email
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
