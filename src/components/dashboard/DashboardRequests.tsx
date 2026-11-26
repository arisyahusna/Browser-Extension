import React from 'react';
import {
  FileQuestion,
  Clock,
  CheckCircle2,
  Send,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const DashboardRequests: React.FC = () => {
  const {
    submittedRequests,
    advanceRequestStatus,
    openEmailPreview,
    clearDemoRequests,
  } = useAifa();

  const getStepState = (currentStatus: string, step: 'Submitted' | 'Under Review' | 'Completed') => {
    const order = ['Submitted', 'Under Review', 'Completed'];
    const currentIdx = order.indexOf(currentStatus);
    const stepIdx = order.indexOf(step);

    if (currentIdx > stepIdx) return 'completed';
    if (currentIdx === stepIdx) return 'active';
    return 'upcoming';
  };

  const stepCircle =
    'mx-auto w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors';

  return (
    <div className="space-y-5">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pt-2">
        <div>
          <h2 className="text-[28px] leading-tight font-bold text-[#2A2A2A] tracking-tight">
            Official Fact-Check Inquiries
          </h2>
          <p className="text-sm text-[#6F6D69] mt-1">
            Track claims submitted to the Sebenarnya.my editorial and verification bureau.
          </p>
        </div>

        {submittedRequests.length > 0 && (
          <button
            type="button"
            onClick={clearDemoRequests}
            className="h-10 px-4 rounded-full bg-white border border-[#E0DED9] hover:bg-[#E2E4EA] text-[#2A2A2A] text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Requests to Default
          </button>
        )}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {submittedRequests.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-[#E0DED9] p-12 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-[#6F6D69]/50 mx-auto" />
            <h4 className="text-sm font-semibold text-[#2A2A2A]">No Fact-Check Requests</h4>
            <p className="text-xs text-[#6F6D69] max-w-sm mx-auto">
              You haven't submitted any unverified claims yet. When AIFA detects an unverified claim, use the "Request Fact-Check" button to submit it for review.
            </p>
          </div>
        ) : (
          submittedRequests.map((req) => {
            const isCompleted = req.status === 'Completed';
            const isUnderReview = req.status === 'Under Review';

            return (
              <div
                key={req.id}
                className="bg-white rounded-[28px] border border-[#E0DED9] p-5 sm:p-6 space-y-5"
              >
                {/* Header: Ref Number & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#2A2A2A]">
                          {req.referenceNumber}
                        </span>
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#F4F3F1] text-[#5C5A56]">
                          Priority: Standard
                        </span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#6F6D69]">
                        Submitted: {req.timestamp} • Last update: {req.lastUpdated || req.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                        isCompleted
                          ? 'bg-[#DCEFE2] text-[#2F6B45]'
                          : isUnderReview
                          ? 'bg-[#F4EBCB] text-[#715C1C]'
                          : 'bg-[#DFE6F5] text-[#3F5C9E]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Fact-Check Completed
                        </>
                      ) : isUnderReview ? (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          Under Active Review
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Submitted & Queued
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Progress Stepper */}
                <div className="p-5 bg-[#F4F3F1] rounded-[22px]">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {/* Step 1: Submitted */}
                    <div className="space-y-1.5">
                      <div
                        className={`${stepCircle} ${
                          getStepState(req.status, 'Submitted') === 'completed'
                            ? 'bg-[#5774BC] text-white'
                            : 'bg-[#5774BC] text-white ring-4 ring-[#DFE6F5]'
                        }`}
                      >
                        ✓
                      </div>
                      <div className="font-semibold text-[#2A2A2A]">1. Submitted</div>
                      <div className="text-[10px] text-[#6F6D69]">Claim received & logged</div>
                    </div>

                    {/* Step 2: Under Review */}
                    <div className="space-y-1.5">
                      <div
                        className={`${stepCircle} ${
                          getStepState(req.status, 'Under Review') === 'completed'
                            ? 'bg-[#3A8656] text-white'
                            : getStepState(req.status, 'Under Review') === 'active'
                            ? 'bg-[#E8CF85] text-[#2A2A2A] ring-4 ring-[#F4EBCB] animate-pulse'
                            : 'bg-[#E8E6E2] text-[#6F6D69]'
                        }`}
                      >
                        2
                      </div>
                      <div
                        className={`font-semibold ${
                          isUnderReview ? 'text-[#715C1C]' : 'text-[#2A2A2A]'
                        }`}
                      >
                        2. Under Review
                      </div>
                      <div className="text-[10px] text-[#6F6D69]">
                        Cross-checking official records
                      </div>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="space-y-1.5">
                      <div
                        className={`${stepCircle} ${
                          isCompleted
                            ? 'bg-[#3A8656] text-white ring-4 ring-[#DCEFE2]'
                            : 'bg-[#E8E6E2] text-[#6F6D69]'
                        }`}
                      >
                        {isCompleted ? '✓' : '3'}
                      </div>
                      <div
                        className={`font-semibold ${
                          isCompleted ? 'text-[#2F6B45]' : 'text-[#2A2A2A]'
                        }`}
                      >
                        3. Completed
                      </div>
                      <div className="text-[10px] text-[#6F6D69]">Findings published</div>
                    </div>
                  </div>
                </div>

                {/* Claim Statement & Submission Context */}
                <div className="space-y-2">
                  <div className="text-[13px] font-semibold text-[#2A2A2A]">
                    Investigated Claim
                  </div>
                  <div className="p-4 bg-[#F4F3F1] rounded-[18px] text-sm text-[#2A2A2A] font-medium italic">
                    "{req.claimText}"
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#5C5A56] pt-1">
                    <div>
                      <span className="text-[#6F6D69]">Context Source: </span>
                      <strong className="font-semibold text-[#2A2A2A]">{req.title}</strong>
                    </div>
                    <div>
                      <span className="text-[#6F6D69]">Platform: </span>
                      <span className="font-semibold text-[#2A2A2A]">{req.sourcePlatform}</span>
                    </div>
                  </div>

                  {req.additionalNotes && (
                    <div className="text-xs text-[#5C5A56] bg-[#F4F3F1] p-3 rounded-2xl">
                      <span className="font-semibold text-[#2A2A2A]">Submitter Notes: </span>
                      {req.additionalNotes}
                    </div>
                  )}
                </div>

                {/* Reviewer Conclusion if Completed */}
                {isCompleted && (
                  <div className="p-5 rounded-[24px] bg-[#DFE6F5] text-[#1F2F55] space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold">
                        <ShieldCheck className="w-4 h-4 text-[#3F5C9E]" />
                        <span>Official Sebenarnya.my Determination: FALSE RUMOR</span>
                      </div>
                      <span className="font-mono text-[10px] text-[#3F5C9E] font-semibold">
                        Archive #SEB-2026-8842
                      </span>
                    </div>

                    <p className="text-xs text-[#2E3A55] leading-relaxed">
                      Investigation confirmed no such circular or policy exists within the Ministry of Finance or Malaysian government gazette. Circulating graphics are fraudulent reproductions.
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openEmailPreview(req)}
                        className="h-10 px-4 rounded-full bg-white hover:bg-[#E2E4EA] text-[#2A2A2A] font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>View Simulated Notification Email</span>
                      </button>

                      <span className="text-[10px] text-[#3F5C9E]">
                        Verified by: Sebenarnya.my Editorial Desk
                      </span>
                    </div>
                  </div>
                )}

                {/* Presenter Quick Actions Footer */}
                <div className="pt-4 border-t border-[#E0DED9] flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-[#6F6D69] flex items-center gap-1">
                    <span>Presenter Lifecycle Simulation:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status !== 'Under Review' && (
                      <button
                        type="button"
                        onClick={() => advanceRequestStatus(req.id, 'Under Review')}
                        className="h-8 px-3.5 text-xs font-semibold text-[#715C1C] bg-[#F4EBCB] hover:bg-[#E8CF85]/60 rounded-full transition-colors cursor-pointer"
                      >
                        Set Under Review
                      </button>
                    )}

                    {req.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => advanceRequestStatus(req.id, 'Completed')}
                        className="h-8 px-3.5 text-xs font-semibold text-[#2F6B45] bg-[#DCEFE2] hover:bg-[#BFE0CA] rounded-full transition-colors cursor-pointer"
                      >
                        Complete Review
                      </button>
                    )}

                    {req.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => openEmailPreview(req)}
                        className="h-8 px-3.5 text-xs font-semibold text-[#2A2A2A] bg-white border border-[#E0DED9] hover:border-[#2A2A2A]/20 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Mail className="w-3 h-3" />
                        <span>View Email</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
