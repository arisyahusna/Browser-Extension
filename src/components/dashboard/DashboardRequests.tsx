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

  return (
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Official Fact-Check Inquiries
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Track claims submitted to the Sebenarnya.my editorial and verification bureau.
          </p>
        </div>

        {submittedRequests.length > 0 && (
          <button
            type="button"
            onClick={clearDemoRequests}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
          >
            Reset Requests to Default
          </button>
        )}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {submittedRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Fact-Check Requests</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
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
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-5"
              >
                {/* Header: Ref Number & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-black text-sm">
                      🛡️
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-slate-900">
                          {req.referenceNumber}
                        </span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          Priority: Standard
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Submitted: {req.timestamp} • Last update: {req.lastUpdated || req.timestamp}
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isUnderReview
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
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
                <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {/* Step 1: Submitted */}
                    <div className="space-y-1.5">
                      <div
                        className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          getStepState(req.status, 'Submitted') === 'completed'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-600 text-white ring-4 ring-blue-100'
                        }`}
                      >
                        ✓
                      </div>
                      <div className="font-bold text-slate-800">1. Submitted</div>
                      <div className="text-[10px] text-slate-500">Claim received & logged</div>
                    </div>

                    {/* Step 2: Under Review */}
                    <div className="space-y-1.5">
                      <div
                        className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          getStepState(req.status, 'Under Review') === 'completed'
                            ? 'bg-emerald-600 text-white'
                            : getStepState(req.status, 'Under Review') === 'active'
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100 animate-pulse'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        2
                      </div>
                      <div
                        className={`font-bold ${
                          isUnderReview ? 'text-amber-800' : 'text-slate-800'
                        }`}
                      >
                        2. Under Review
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Cross-checking official records
                      </div>
                    </div>

                    {/* Step 3: Completed */}
                    <div className="space-y-1.5">
                      <div
                        className={`mx-auto w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isCompleted
                            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? '✓' : '3'}
                      </div>
                      <div
                        className={`font-bold ${
                          isCompleted ? 'text-emerald-800' : 'text-slate-800'
                        }`}
                      >
                        3. Completed
                      </div>
                      <div className="text-[10px] text-slate-500">Findings published</div>
                    </div>
                  </div>
                </div>

                {/* Claim Statement & Submission Context */}
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Investigated Claim
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-900 font-medium italic">
                    "{req.claimText}"
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400">Context Source: </span>
                      <strong className="text-slate-800">{req.title}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Platform: </span>
                      <span className="font-semibold text-slate-700">{req.sourcePlatform}</span>
                    </div>
                  </div>

                  {req.additionalNotes && (
                    <div className="text-xs text-slate-600 bg-slate-50/50 p-2.5 rounded-lg border border-slate-100">
                      <span className="font-semibold text-slate-700">Submitter Notes: </span>
                      {req.additionalNotes}
                    </div>
                  )}
                </div>

                {/* Reviewer Conclusion if Completed */}
                {isCompleted && (
                  <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Official Sebenarnya.my Determination: FALSE RUMOR</span>
                      </div>
                      <span className="font-mono text-[10px] text-emerald-700 font-bold">
                        Archive #SEB-2026-8842
                      </span>
                    </div>

                    <p className="text-xs text-emerald-950 leading-relaxed">
                      Investigation confirmed no such circular or policy exists within the Ministry of Finance or Malaysian government gazette. Circulating graphics are fraudulent reproductions.
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => openEmailPreview(req)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>View Simulated Notification Email</span>
                      </button>

                      <span className="text-[10px] text-emerald-700">
                        Verified by: Sebenarnya.my Editorial Desk
                      </span>
                    </div>
                  </div>
                )}

                {/* Presenter Quick Actions Footer */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <span>Presenter Lifecycle Simulation:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status !== 'Under Review' && (
                      <button
                        type="button"
                        onClick={() => advanceRequestStatus(req.id, 'Under Review')}
                        className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-md transition-colors cursor-pointer"
                      >
                        Set Under Review
                      </button>
                    )}

                    {req.status !== 'Completed' && (
                      <button
                        type="button"
                        onClick={() => advanceRequestStatus(req.id, 'Completed')}
                        className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
                      >
                        Complete Review
                      </button>
                    )}

                    {req.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => openEmailPreview(req)}
                        className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
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
