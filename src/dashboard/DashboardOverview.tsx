import React from 'react';
import { CheckCircle2, AlertTriangle, Clock, ArrowRight, TrendingUp, ExternalLink, FileSearch } from 'lucide-react';
import { Button, Card, EmptyState, Icon } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { OverallAssessment } from '../types/aifa';
import { AssessmentLabel } from '../extension/shared/AssessmentLabel';
import { RequestStatusBadge } from './RequestStatusBadge';
import { VerificationActivityCard } from './VerificationActivityCard';

interface DashboardOverviewProps {
  onSwitchTab: (tab: 'analytics' | 'history' | 'requests' | 'notifications' | 'settings') => void;
  /** Opens History pre-filtered by verdict ('all', 'supported', 'false-or-misleading', …). */
  onOpenHistory: (assessmentFilter: string) => void;
}

const ASSESSMENT_WORDS: Record<OverallAssessment, string> = {
  supported: 'Supported',
  false: 'False',
  misleading: 'Misleading',
  mixed: 'Unverified',
  unverified: 'Unverified',
};

// A clickable row inside a list card: the design system has no list-item component.
const listRow = 'w-full text-left p-12 rounded-media hover:bg-muted transition-colors duration-fast ease-out';

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSwitchTab, onOpenHistory }) => {
  const { verificationHistory, submittedRequests, userProfile, openEmailPreview } = useAifa();

  // Metrics
  const totalVerified = verificationHistory.length;
  const supportedCount = verificationHistory.filter((h) => h.overallAssessment === 'supported').length;
  const falseOrMisleadingCount = verificationHistory.filter(
    (h) => h.overallAssessment === 'false' || h.overallAssessment === 'misleading'
  ).length;
  const pendingRequests = submittedRequests.filter((r) => r.status !== 'Completed').length;
  const completedRequests = submittedRequests.filter((r) => r.status === 'Completed').length;

  const metrics = [
    {
      label: 'All',
      value: totalVerified,
      icon: TrendingUp,
      onClick: () => onOpenHistory('all'),
      actionLabel: 'View all verifications',
    },
    {
      label: 'Supported',
      value: supportedCount,
      icon: CheckCircle2,
      onClick: () => onOpenHistory('supported'),
      actionLabel: 'View supported verifications',
    },
    {
      label: 'False or misleading',
      value: falseOrMisleadingCount,
      icon: AlertTriangle,
      onClick: () => onOpenHistory('false-or-misleading'),
      actionLabel: 'View false or misleading verifications',
    },
    {
      label: 'Fact-check inquiries',
      value: submittedRequests.length,
      detail: `${completedRequests} completed · ${pendingRequests} pending`,
      icon: Clock,
      onClick: () => onSwitchTab('requests'),
      actionLabel: 'View fact-check inquiries',
    },
  ];

  return (
    <div className="flex flex-col gap-block">
      {/* 1. Welcome hero */}
      <section className="relative overflow-hidden py-8">
        <img
          src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="md:hidden absolute right-0 -top-16 size-120 opacity-5 -rotate-6 select-none pointer-events-none"
        />
        <div className="relative flex flex-col gap-text">
          <h1 className="text-display text-foreground whitespace-nowrap lg:whitespace-normal">
            {userProfile.isConnected ? <>Welcome back, {userProfile.name}!</> : <>Welcome to Sebenarnya.my!</>}
          </h1>
          <p className="text-body text-muted-foreground">
            Stay informed and verify online information with Sebenarnya.my, your AI-powered fact-checking assistant.
          </p>
        </div>
      </section>

      {/* 2. At-a-glance metrics (each opens the matching list) */}
      <section aria-label="Summary" className="grid grid-cols-4 lg:grid-cols-2 gap-cards">
        {metrics.map(({ label, value, detail, icon, onClick, actionLabel }) => (
          <button
            type="button"
            key={label}
            onClick={onClick}
            title={actionLabel}
            className="text-left rounded-card p-card flex flex-col gap-group border bg-card text-foreground border-border hover:border-border-strong transition-colors duration-fast ease-out cursor-pointer"
          >
            <div className="flex items-start justify-between gap-inline">
              <div className="min-w-0">
                <div className="text-label-sm">{label}</div>
                {detail && <div className="text-caption text-muted-foreground truncate">{detail}</div>}
              </div>
              <div className="size-avatar-sm rounded-full flex items-center justify-center shrink-0 bg-muted text-foreground">
                <Icon icon={icon} />
              </div>
            </div>
            <div className="mt-auto text-stat">{value}</div>
          </button>
        ))}
      </section>

      {/* 3. Verification activity (same card as the Analytics page, fixed to 30 days) */}
      <VerificationActivityCard
        period="30d"
        action={
          <Button variant="outline" size="sm" iconEnd={ArrowRight} onClick={() => onSwitchTab('analytics')}>
            View analytics
          </Button>
        }
      />

      {/* 4. Recent activity */}
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-cards">
        {/* Recent verifications */}
        <Card variant="raised" size="sm" className="gap-4">
          <div className="px-8 pt-4 pb-8 flex items-center justify-between gap-12">
            <div>
              <h2 className="text-label text-foreground">Recent verifications</h2>
              <p className="text-caption text-muted-foreground">Articles and posts you checked</p>
            </div>
            <Button variant="outline" size="sm" iconEnd={ArrowRight} onClick={() => onSwitchTab('history')}>
              View all
            </Button>
          </div>

          {verificationHistory.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No verifications yet"
              description="Results appear here after you verify an article or post."
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {verificationHistory.slice(0, 3).map((hist) => (
                <li key={hist.id}>
                  <button type="button" onClick={() => onSwitchTab('history')} className={`${listRow} flex flex-col gap-4 cursor-pointer`}>
                    <div className="w-full flex items-center justify-between gap-inline">
                      <AssessmentLabel assessment={hist.overallAssessment} label={ASSESSMENT_WORDS[hist.overallAssessment]} />
                      <span className="text-caption text-muted-foreground shrink-0">{hist.verifiedAt}</span>
                    </div>
                    <h3 className="text-label-sm text-foreground line-clamp-1">{hist.headline}</h3>
                    <p className="text-caption text-muted-foreground line-clamp-1">{hist.summary}</p>
                    <p className="text-caption text-muted-foreground">
                      {hist.platformName} · {hist.claimsCount} claims
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Fact-check inquiries */}
        <Card variant="raised" size="sm" className="gap-4">
          <div className="px-8 pt-4 pb-8 flex items-center justify-between gap-12">
            <div>
              <h2 className="text-label text-foreground">Fact-check inquiries</h2>
              <p className="text-caption text-muted-foreground">
                {pendingRequests > 0
                  ? `${pendingRequests} awaiting review by Sebenarnya.my`
                  : 'Claims you submitted to Sebenarnya.my'}
              </p>
            </div>
            <Button variant="outline" size="sm" iconEnd={ArrowRight} onClick={() => onSwitchTab('requests')}>
              View all
            </Button>
          </div>

          {submittedRequests.length === 0 ? (
            <EmptyState
              icon={FileSearch}
              title="No inquiries yet"
              description="When a claim can't be verified, request a fact-check from the verification panel."
            />
          ) : (
            <ul className="flex flex-col gap-4">
              {submittedRequests.slice(0, 3).map((req) => (
                <li key={req.id} className={`${listRow} flex flex-col gap-4`}>
                  <div className="flex items-center justify-between gap-inline">
                    <span className="text-label-sm text-foreground">{req.referenceNumber}</span>
                    <RequestStatusBadge status={req.status} />
                  </div>
                  <p className="text-body-sm text-text-secondary line-clamp-2">"{req.claimText}"</p>
                  <div className="flex items-center justify-between gap-inline text-caption text-muted-foreground">
                    <span>Submitted {req.timestamp}</span>
                    {req.status === 'Completed' && (
                      <Button variant="link" size="sm" iconEnd={ExternalLink} onClick={() => openEmailPreview(req)}>
                        Preview notification
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
};
