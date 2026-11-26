import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileQuestion,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  FileSearch,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { OverallAssessment } from '../../types/aifa';
import { VerificationActivityCard } from './VerificationActivityCard';

interface DashboardOverviewProps {
  onSwitchTab: (tab: 'analytics' | 'history' | 'requests' | 'notifications' | 'settings') => void;
  /** Opens History pre-filtered by verdict ('all', 'supported', 'false-or-misleading', …). */
  onOpenHistory: (assessmentFilter: string) => void;
}

const getAssessmentBadge = (assessment: OverallAssessment) => {
  switch (assessment) {
    case 'supported':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#DFE6F5] text-[#3F5C9E]">
          <CheckCircle2 className="w-3 h-3" />
          Supported
        </span>
      );
    case 'false':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F7DEDB] text-[#9B3D36]">
          <AlertTriangle className="w-3 h-3" />
          False
        </span>
      );
    case 'misleading':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F4EBCB] text-[#715C1C]">
          <AlertTriangle className="w-3 h-3" />
          Misleading
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E2E4EA] text-[#5C5A56]">
          <FileQuestion className="w-3 h-3" />
          Unverified
        </span>
      );
  }
};

const getStatusPill = (status: string) => (
  <span
    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
      status === 'Completed'
        ? 'bg-[#DCEFE2] text-[#2F6B45]'
        : status === 'Under Review'
        ? 'bg-[#F4EBCB] text-[#715C1C]'
        : 'bg-[#DFE6F5] text-[#3F5C9E]'
    }`}
  >
    {status}
  </span>
);

const viewAllButton =
  'h-9 px-3.5 rounded-full border border-[#2A2A2A]/15 text-xs font-semibold text-[#2A2A2A] flex items-center gap-1.5 hover:bg-[#E2E4EA] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40';

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSwitchTab, onOpenHistory }) => {
  const {
    verificationHistory,
    submittedRequests,
    userProfile,
    openEmailPreview,
  } = useAifa();

  // Metrics
  const totalVerified = verificationHistory.length;
  const supportedCount = verificationHistory.filter(
    (h) => h.overallAssessment === 'supported'
  ).length;
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
      tone: 'bg-white text-[#D93043]',
      featured: true,
      onClick: () => onOpenHistory('all'),
      actionLabel: 'View all verifications',
    },
    {
      label: 'Supported',
      value: supportedCount,
      icon: CheckCircle2,
      tone: 'bg-[#DFE6F5] text-[#3F5C9E]',
      onClick: () => onOpenHistory('supported'),
      actionLabel: 'View supported verifications',
    },
    {
      label: 'False or misleading',
      value: falseOrMisleadingCount,
      icon: AlertTriangle,
      tone: 'bg-[#F7DEDB] text-[#9B3D36]',
      onClick: () => onOpenHistory('false-or-misleading'),
      actionLabel: 'View false or misleading verifications',
    },
    {
      label: 'Fact-check inquiries',
      value: submittedRequests.length,
      detail: `${completedRequests} completed · ${pendingRequests} pending`,
      icon: Clock,
      tone: 'bg-[#F4EBCB] text-[#715C1C]',
      onClick: () => onSwitchTab('requests'),
      actionLabel: 'View fact-check inquiries',
    },
  ];


  return (
    <div className="space-y-5">
      {/* 1. Welcome hero */}
      <section className="relative overflow-hidden py-2">
        <img
          src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="hidden md:block absolute right-0 -top-4 w-40 h-40 opacity-[0.06] rotate-[-8deg] select-none pointer-events-none"
        />
        <div className="relative">
          <h1 className="text-3xl md:text-[36px] xl:text-[42px] md:leading-[1.15] font-bold tracking-tight text-[#2A2A2A] lg:whitespace-nowrap">
            {userProfile.isConnected ? (
              <>
                Welcome back, <span className="text-[#5774BC]">{userProfile.name}</span>!
              </>
            ) : (
              <>
                Welcome to <span className="text-[#5774BC]">Sebenarnya.my</span>!
              </>
            )}
          </h1>
          <p className="mt-2 text-sm text-[#6F6D69] leading-relaxed">
            Stay informed and verify online information with Sebenarnya.my, your AI-powered
            fact-checking assistant.
          </p>
        </div>
      </section>

      {/* 2. At-a-glance metrics */}
      <section aria-label="Summary" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {metrics.map(({ label, value, detail, icon: Icon, tone, featured, onClick, actionLabel }) => (
          <button
            type="button"
            key={label}
            onClick={onClick}
            title={actionLabel}
            className={`text-left rounded-[28px] p-5 min-h-[150px] flex flex-col gap-4 border transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEFF3] focus-visible:ring-[#5774BC]/50 ${
              featured
                ? 'bg-[#FBE4E6] border-[#F5C9CE] text-[#A31F30] hover:border-[#D93043]/40'
                : 'bg-white border-[#E0DED9] text-[#2A2A2A] hover:border-[#2A2A2A]/25'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div
                  className={`text-[13px] font-semibold leading-snug ${
                    featured ? 'text-[#A31F30]' : 'text-[#2A2A2A]'
                  }`}
                >
                  {label}
                </div>
                {detail && (
                  <div className="mt-0.5 text-[11px] font-medium text-[#6F6D69] truncate">{detail}</div>
                )}
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tone}`}>
                <Icon className="w-[18px] h-[18px]" />
              </div>
            </div>
            <div className="mt-auto min-w-0">
              <div className="text-[34px] font-bold tracking-tight leading-none">{value}</div>
            </div>
          </button>
        ))}
      </section>

      {/* 3. Verification activity (same card as the Analytics page, fixed to 30 days) */}
      <VerificationActivityCard
        period="30d"
        action={
          <button type="button" onClick={() => onSwitchTab('analytics')} className={viewAllButton}>
            <span>View analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        }
      />

      {/* 4. Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent verifications */}
        <section className="bg-white rounded-[28px] border border-[#E0DED9] p-2 flex flex-col">
          <div className="px-4 pt-3.5 pb-2 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-[#2A2A2A]">Recent verifications</h2>
              <p className="text-xs text-[#6F6D69] mt-0.5">Articles and posts you checked</p>
            </div>
            <button type="button" onClick={() => onSwitchTab('history')} className={viewAllButton}>
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {verificationHistory.length === 0 ? (
            <div className="flex-1 px-5 py-10 text-center">
              <TrendingUp className="w-7 h-7 text-[#6F6D69]/50 mx-auto" />
              <p className="mt-2 text-sm font-semibold text-[#2A2A2A]">No verifications yet</p>
              <p className="mt-1 text-xs text-[#6F6D69]">
                Results appear here after you verify an article or post.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {verificationHistory.slice(0, 3).map((hist) => (
                <li key={hist.id}>
                  <button
                    type="button"
                    onClick={() => onSwitchTab('history')}
                    className="w-full text-left px-4 py-3.5 rounded-[20px] hover:bg-[#E2E4EA] transition-colors cursor-pointer focus:outline-none focus-visible:bg-[#F4F3F1]"
                  >
                    <div className="flex items-center justify-between gap-2">
                      {getAssessmentBadge(hist.overallAssessment)}
                      <span className="text-[11px] text-[#6F6D69] shrink-0">{hist.verifiedAt}</span>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-[#2A2A2A] line-clamp-1">
                      {hist.headline}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#6F6D69] line-clamp-1">{hist.summary}</p>
                    <p className="mt-1.5 text-[11px] text-[#6F6D69]">
                      {hist.platformName} · {hist.claimsCount} claims
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Fact-check inquiries */}
        <section className="bg-white rounded-[28px] border border-[#E0DED9] p-2 flex flex-col">
          <div className="px-4 pt-3.5 pb-2 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-[#2A2A2A]">Fact-check inquiries</h2>
              <p className="text-xs text-[#6F6D69] mt-0.5">
                {pendingRequests > 0
                  ? `${pendingRequests} awaiting review by Sebenarnya.my`
                  : 'Claims you submitted to Sebenarnya.my'}
              </p>
            </div>
            <button type="button" onClick={() => onSwitchTab('requests')} className={viewAllButton}>
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {submittedRequests.length === 0 ? (
            <div className="flex-1 px-5 py-10 text-center">
              <FileSearch className="w-7 h-7 text-[#6F6D69]/50 mx-auto" />
              <p className="mt-2 text-sm font-semibold text-[#2A2A2A]">No inquiries yet</p>
              <p className="mt-1 text-xs text-[#6F6D69] max-w-xs mx-auto">
                When a claim can't be verified, request a fact-check from the verification panel.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {submittedRequests.slice(0, 3).map((req) => (
                <li key={req.id} className="px-4 py-3.5 rounded-[20px] hover:bg-[#E2E4EA] transition-colors">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-[#2A2A2A]">
                      {req.referenceNumber}
                    </span>
                    {getStatusPill(req.status)}
                  </div>
                  <p className="mt-2 text-sm text-[#5C5A56] line-clamp-2">"{req.claimText}"</p>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-[#6F6D69]">
                    <span>Submitted {req.timestamp}</span>
                    {req.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => openEmailPreview(req)}
                        className="text-xs font-semibold text-[#3F5C9E] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>Preview notification</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
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
