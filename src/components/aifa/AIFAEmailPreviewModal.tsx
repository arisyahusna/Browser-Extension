import React from 'react';
import { X, Mail, CheckCircle2, Clock, ExternalLink, ShieldCheck } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';

export const AIFAEmailPreviewModal: React.FC = () => {
  const { emailPreviewRequest, closeEmailPreview } = useAifa();
  const { navigate } = useBrowser();

  if (!emailPreviewRequest) return null;

  const handleOpenDashboard = () => {
    closeEmailPreview();
    navigate({
      pathname: '/sebenarnya-dashboard',
      title: 'Sebenarnya.my — AIFA Fact-Checking User Dashboard',
      platform: 'dashboard',
      customUrl: 'https://sebenarnya-dashboard.example/',
    });
  };

  const isCompleted = emailPreviewRequest.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
      >
        {/* Simulated Email Client Window Bar */}
        <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300 ml-2 font-sans font-medium text-xs flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              Simulated Email Notification Preview
            </span>
          </div>

          <button
            type="button"
            onClick={closeEmailPreview}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close email modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Header Details */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 space-y-2 text-xs">
          <div className="flex items-baseline">
            <span className="w-16 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              From:
            </span>
            <span className="font-semibold text-slate-800">
              Sebenarnya.my AIFA Service &lt;no-reply@sebenarnya.my&gt;
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-16 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              To:
            </span>
            <span className="text-slate-700">AIFA Demo User &lt;demo@example.com&gt;</span>
          </div>
          <div className="flex items-baseline">
            <span className="w-16 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Subject:
            </span>
            <span id="email-modal-title" className="font-bold text-slate-900">
              [AIFA Fact-Check] Status Update: {emailPreviewRequest.referenceNumber} (
              {emailPreviewRequest.status})
            </span>
          </div>
          <div className="flex items-baseline">
            <span className="w-16 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
              Date:
            </span>
            <span className="text-slate-500">{emailPreviewRequest.lastUpdated || 'Just now'}</span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Sebenarnya.my Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-[#D93043] text-white flex items-center justify-center text-lg font-black shadow-sm">
                🛡️
              </span>
              <div>
                <div className="font-extrabold text-sm tracking-tight text-slate-900">
                  SEBENARNYA.MY
                </div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">
                  Official Verification Portal
                </div>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Fact-Check Completed
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5" />
                  Under Review
                </>
              )}
            </span>
          </div>

          <div>
            <p className="text-xs text-slate-700">
              Dear <strong>AIFA Demo User</strong>,
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {isCompleted
                ? 'Our editorial and verification team at Sebenarnya.my has concluded the investigation for your submitted claim inquiry.'
                : 'Your fact-check request has been assigned to an editorial researcher and is currently undergoing verification against official government gazettes and ministry records.'}
            </p>
          </div>

          {/* Claim Box */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-500 uppercase tracking-wider">
                Submitted Claim Details
              </span>
              <span className="font-mono font-bold text-[#D93043]">
                {emailPreviewRequest.referenceNumber}
              </span>
            </div>
            <div className="text-xs font-medium text-slate-900 italic bg-white p-2.5 rounded border border-slate-200">
              "{emailPreviewRequest.claimText}"
            </div>
            <div className="text-[11px] text-slate-500">
              Source: <span className="font-medium text-slate-700">{emailPreviewRequest.title}</span> ({emailPreviewRequest.sourcePlatform})
            </div>
          </div>

          {/* Review Conclusion if Completed */}
          {isCompleted && (
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sebenarnya.my Verification Finding: FALSE CLAIM</span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                The Ministry of Finance and Prime Minister's Department have confirmed that no such mandatory annual RM500 administrative contribution has ever been legislated or planned. Circulating forwards stem from altered graphics and unverified community chat chains.
              </p>
              <div className="text-[11px] text-emerald-800 font-mono">
                Official ref: SEB-2026-NOV-8842
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleOpenDashboard}
              className="px-5 py-2.5 bg-[#D93043] hover:bg-[#B72435] text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>View Full Report on Sebenarnya.my Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demonstration Notice */}
          <div className="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            Simulated demonstration email preview. No actual emails are dispatched.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={closeEmailPreview}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
