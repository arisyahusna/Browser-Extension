import React, { useState } from 'react';
import { useAifa } from '../../context/AifaContext';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

const fieldLabel = 'text-[11px] font-semibold text-[#2A2A2A]';
const readOnlyField =
  'w-full h-10 bg-white rounded-full px-4 text-[#5C5A56] font-medium border-0 focus:outline-none';

export const AIFAFactCheckRequestForm: React.FC = () => {
  const {
    activeFactCheckClaim,
    verificationResult,
    returnToResults,
    submitFactCheckRequest,
    isSubmittingRequest,
  } = useAifa();

  const [userNotes, setUserNotes] = useState(
    'This message is circulating widely on WhatsApp and social media groups. Please verify if any official government circular exists.'
  );
  const [includeSupporting, setIncludeSupporting] = useState(true);

  if (!activeFactCheckClaim || !verificationResult) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitFactCheckRequest(userNotes, includeSupporting);
  };

  return (
    <div className="px-1 py-2 space-y-5 animate-in fade-in duration-200">
      {/* Header with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={returnToResults}
          className="w-9 h-9 shrink-0 rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] flex items-center justify-center hover:bg-[#E2E4EA] transition-colors"
          title="Back to verification results"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-base font-bold text-[#2A2A2A] leading-tight tracking-tight">
            Request Fact-Check
          </h3>
          <p className="text-[11px] text-[#6F6D69]">
            Submit unverified claim to Sebenarnya.my
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Claim to verify (prefilled) */}
        <div className="space-y-1.5">
          <label className={`${fieldLabel} px-1`}>Claim to Verify</label>
          <div className="rounded-[20px] bg-white p-4 space-y-2">
            <span className="inline-block text-[10px] font-semibold px-2.5 py-1 rounded-full bg-[#E2E4EA] text-[#5C5A56]">
              Claim #{activeFactCheckClaim.claimNumber} • {activeFactCheckClaim.verdictLabel}
            </span>
            <p className="font-medium text-[#2A2A2A] leading-snug text-[13px]">
              "{activeFactCheckClaim.statement}"
            </p>
          </div>
        </div>

        {/* Source URL & Platform (prefilled) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className={`${fieldLabel} px-1`}>Source Platform</label>
            <input
              type="text"
              readOnly
              value={verificationResult.platformName || verificationResult.sourceWebsite}
              className={`${readOnlyField} select-none`}
            />
          </div>

          <div className="space-y-1.5">
            <label className={`${fieldLabel} px-1`}>Source URL</label>
            <input
              type="text"
              readOnly
              value={verificationResult.sourceWebsite}
              className={`${readOnlyField} font-mono text-[11px] truncate select-all`}
            />
          </div>
        </div>

        {/* Additional Information Textarea */}
        <div className="space-y-1.5">
          <label className={`${fieldLabel} px-1 flex items-center justify-between`}>
            <span>Additional Information (Optional)</span>
            <span className="text-[10px] text-[#6F6D69] font-normal">Context for editorial team</span>
          </label>
          <textarea
            rows={3}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Explain why you want this claim verified or where you encountered it..."
            className="w-full bg-white border-0 rounded-[20px] p-4 text-[#2A2A2A] placeholder-[#6F6D69] focus:outline-none focus:ring-2 focus:ring-[#2A2A2A]/20 leading-relaxed resize-none text-xs"
          />
        </div>

        {/* Include Supporting Content Checkbox */}
        <div className="rounded-[20px] bg-white p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSupporting}
              onChange={(e) => setIncludeSupporting(e.target.checked)}
              className="mt-0.5 w-4 h-4 shrink-0 accent-[#2A2A2A] cursor-pointer"
            />
            <div>
              <span className="font-semibold text-[#2A2A2A] block leading-tight">
                Include Supporting Content
              </span>
              <span className="text-[11px] text-[#6F6D69] leading-snug block mt-0.5">
                Automatically attaches the post caption or article text and initial AIFA discrepancy flags.
              </span>
            </div>
          </label>
        </div>

        {/* Disclaimer Notice */}
        <div className="flex items-start gap-2 text-[11px] text-[#5E4C17] bg-[#F4EBCB] px-4 py-3 rounded-[18px]">
          <AlertCircle className="w-3.5 h-3.5 text-[#715C1C] shrink-0 mt-0.5" />
          <span>
            Demonstration mode: submissions are recorded in local demo state. No live transmission occurs.
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-1 flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmittingRequest}
            className="flex-1 h-11 flex items-center justify-center gap-2 px-4 bg-[#2A2A2A] hover:bg-black text-white font-semibold text-xs rounded-full transition-colors cursor-pointer disabled:opacity-50"
          >
            {isSubmittingRequest ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Submitting to Sebenarnya.my...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Request to Sebenarnya.my</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={returnToResults}
            className="h-11 px-4 rounded-full border border-[#2A2A2A]/15 hover:bg-[#E2E4EA] text-[#2A2A2A] text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
