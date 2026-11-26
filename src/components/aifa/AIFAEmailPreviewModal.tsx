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

  const headerLabel = 'w-16 shrink-0 font-semibold text-[#6F6D69] text-[11px]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-['Montserrat',sans-serif] antialiased">
      <div
        className="w-full max-w-xl bg-[#EEEFF3] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(42,42,42,0.4)] border border-[#E0DED9] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="email-modal-title"
      >
        {/* Simulated Email Client Window Bar */}
        <div className="bg-[#2A2A2A] text-white px-5 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E9928B]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#E8CF85]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#8CC5A0]" />
            <span className="text-white/80 ml-2 font-medium text-xs flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-white/60" />
              Simulated Email Notification Preview
            </span>
          </div>

          <button
            type="button"
            onClick={closeEmailPreview}
            className="w-7 h-7 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close email modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Email Header Details */}
        <div className="m-3 mb-0 p-4 rounded-[22px] bg-white space-y-2 text-xs">
          <div className="flex items-baseline">
            <span className={headerLabel}>From:</span>
            <span className="font-semibold text-[#2A2A2A]">
              Sebenarnya.my AIFA Service &lt;no-reply@sebenarnya.my&gt;
            </span>
          </div>
          <div className="flex items-baseline">
            <span className={headerLabel}>To:</span>
            <span className="text-[#5C5A56]">AIFA Demo User &lt;demo@example.com&gt;</span>
          </div>
          <div className="flex items-baseline">
            <span className={headerLabel}>Subject:</span>
            <span id="email-modal-title" className="font-bold text-[#2A2A2A]">
              [AIFA Fact-Check] Status Update: {emailPreviewRequest.referenceNumber} (
              {emailPreviewRequest.status})
            </span>
          </div>
          <div className="flex items-baseline">
            <span className={headerLabel}>Date:</span>
            <span className="text-[#6F6D69]">{emailPreviewRequest.lastUpdated || 'Just now'}</span>
          </div>
        </div>

        {/* Email Body Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Sebenarnya.my Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E0DED9]">
            <div className="flex items-center gap-2.5">
              <img
                src="/images/sebenarnya-icon.png"
                alt=""
                className="w-10 h-10 object-contain"
                draggable={false}
              />
              <div>
                <div className="font-bold text-sm tracking-tight text-[#2A2A2A]">
                  SEBENARNYA.MY
                </div>
                <div className="text-[11px] text-[#6F6D69] font-medium">
                  Official Verification Portal
                </div>
              </div>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                isCompleted ? 'bg-[#DCEFE2] text-[#2F6B45]' : 'bg-[#F4EBCB] text-[#715C1C]'
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
            <p className="text-sm text-[#2A2A2A]">
              Dear <strong className="font-semibold">AIFA Demo User</strong>,
            </p>
            <p className="text-xs text-[#5C5A56] mt-2 leading-relaxed">
              {isCompleted
                ? 'Our editorial and verification team at Sebenarnya.my has concluded the investigation for your submitted claim inquiry.'
                : 'Your fact-check request has been assigned to an editorial researcher and is currently undergoing verification against official government gazettes and ministry records.'}
            </p>
          </div>

          {/* Claim Box */}
          <div className="p-4 rounded-[22px] bg-white space-y-2.5">
            <div className="flex items-center justify-between gap-2 text-[11px]">
              <span className="text-[13px] font-semibold text-[#2A2A2A]">Submitted Claim Details</span>
              <span className="font-mono font-bold text-[#D93043]">
                {emailPreviewRequest.referenceNumber}
              </span>
            </div>
            <div className="text-sm font-medium text-[#2A2A2A] italic bg-[#F4F3F1] p-3.5 rounded-2xl">
              "{emailPreviewRequest.claimText}"
            </div>
            <div className="text-[11px] text-[#6F6D69]">
              Source: <span className="font-semibold text-[#2A2A2A]">{emailPreviewRequest.title}</span> ({emailPreviewRequest.sourcePlatform})
            </div>
          </div>

          {/* Review Conclusion if Completed */}
          {isCompleted && (
            <div className="p-5 rounded-[22px] bg-[#DFE6F5] space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#1F2F55]">
                <ShieldCheck className="w-4 h-4 text-[#3F5C9E]" />
                <span>Sebenarnya.my Verification Finding: FALSE CLAIM</span>
              </div>
              <p className="text-xs text-[#2E3A55] leading-relaxed">
                The Ministry of Finance and Prime Minister's Department have confirmed that no such mandatory annual RM500 administrative contribution has ever been legislated or planned. Circulating forwards stem from altered graphics and unverified community chat chains.
              </p>
              <div className="text-[11px] text-[#3F5C9E] font-mono font-semibold">
                Official ref: SEB-2026-NOV-8842
              </div>
            </div>
          )}

          {/* Action button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={handleOpenDashboard}
              className="h-11 px-6 bg-[#2A2A2A] hover:bg-black text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>View Full Report on Sebenarnya.my Dashboard</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Demonstration Notice */}
          <div className="text-center text-[11px] text-[#6F6D69] border-t border-[#E0DED9] pt-3">
            Simulated demonstration email preview. No actual emails are dispatched.
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0DED9] flex justify-end">
          <button
            type="button"
            onClick={closeEmailPreview}
            className="h-10 px-5 text-xs font-semibold text-[#2A2A2A] border border-[#2A2A2A]/15 hover:bg-[#E2E4EA] rounded-full transition-colors cursor-pointer"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
