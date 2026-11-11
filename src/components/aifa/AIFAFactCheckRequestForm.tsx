import React, { useState } from 'react';
import { useAifa } from '../../context/AifaContext';
import { ArrowLeft, Send, AlertCircle } from 'lucide-react';

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
    <div className="p-5 space-y-5 animate-in fade-in duration-200">
      {/* Header with back button */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={returnToResults}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          title="Back to verification results"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-serif text-sm font-bold text-slate-900 leading-tight">
            Request Fact-Check
          </h3>
          <p className="text-[11px] text-slate-400">
            Submit unverified claim to Sebenarnya.my
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Claim to verify (prefilled) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Claim to Verify
          </label>
          <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-1.5">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
              Claim #{activeFactCheckClaim.claimNumber} • {activeFactCheckClaim.verdictLabel}
            </span>
            <p className="font-medium text-slate-900 leading-snug text-xs">
              "{activeFactCheckClaim.statement}"
            </p>
          </div>
        </div>

        {/* Source URL & Platform (prefilled) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Source Platform
            </label>
            <input
              type="text"
              readOnly
              value={verificationResult.platformName || verificationResult.sourceWebsite}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium select-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Source URL
            </label>
            <input
              type="text"
              readOnly
              value={verificationResult.sourceWebsite}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-600 font-mono text-[11px] truncate select-all"
            />
          </div>
        </div>

        {/* Additional Information Textarea */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span>Additional Information (Optional)</span>
            <span className="text-[10px] text-slate-400 font-normal">Context for editorial team</span>
          </label>
          <textarea
            rows={3}
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Explain why you want this claim verified or where you encountered it..."
            className="w-full border border-slate-300 rounded-xl p-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D93043]/30 focus:border-[#D93043] leading-relaxed resize-none text-xs"
          />
        </div>

        {/* Include Supporting Content Checkbox */}
        <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-3 space-y-1.5">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSupporting}
              onChange={(e) => setIncludeSupporting(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-[#D93043] focus:ring-[#D93043] accent-[#D93043]"
            />
            <div>
              <span className="font-semibold text-slate-800 block leading-tight">
                Include Supporting Content
              </span>
              <span className="text-[11px] text-slate-500 leading-snug block mt-0.5">
                Automatically attaches post caption, extracted image text, and initial AIFA discrepancy flags.
              </span>
            </div>
          </label>
        </div>

        {/* Disclaimer Notice */}
        <div className="flex items-start gap-2 text-[11px] text-slate-500 bg-amber-50/70 border border-amber-200/60 p-2.5 rounded-lg">
          <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            Demonstration mode: submissions are recorded in local demo state. No live transmission occurs.
          </span>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="submit"
            disabled={isSubmittingRequest}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#D93043] hover:bg-[#C02638] text-white font-semibold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
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
            className="py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
