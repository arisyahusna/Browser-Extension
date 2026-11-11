import React from 'react';
import { ShieldCheck, CheckCircle2, RotateCcw } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFAVerifyButton: React.FC = () => {
  const {
    detectedArticle,
    isHighlighted,
    setIsButtonHovered,
    verificationRequest,
    triggerVerification,
    resetVerification,
  } = useAifa();

  if (!detectedArticle) return null;

  const isRequested = verificationRequest?.status === 'requested';

  return (
    <div
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
      className={`transition-all duration-200 ease-out select-none ${
        isHighlighted || isRequested
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      {isRequested ? (
        /* State 5 & 7 Confirmation / Loading Placeholder */
        <div
          role="status"
          aria-live="polite"
          className="bg-white/95 backdrop-blur-xs text-[#171B26] p-3.5 rounded-xl border border-slate-200/90 shadow-[0_8px_24px_rgba(23,27,38,0.12)] max-w-xs animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 text-[#D93043] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-4 h-4 animate-pulse" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-[#171B26] leading-snug">
                AIFA is preparing to analyse this article...
              </h4>
              <p className="text-[11px] text-[#667085] mt-1 leading-relaxed">
                Verification results will appear in the AIFA side panel.
              </p>
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Request captured
                </span>
                <button
                  type="button"
                  onClick={resetVerification}
                  className="hover:text-slate-700 flex items-center gap-1 font-medium transition-colors"
                  title="Reset verification state"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Floating "Verify with AIFA" Action Button */
        <button
          type="button"
          onClick={triggerVerification}
          className="group flex items-center gap-2 px-3.5 py-2 bg-[#D93043] hover:bg-[#C02638] active:bg-[#A81F2F] text-white text-xs font-semibold rounded-xl shadow-[0_4px_16px_rgba(217,48,67,0.32)] hover:shadow-[0_6px_20px_rgba(217,48,67,0.42)] active:scale-98 transition-all duration-150 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D93043]/50 cursor-pointer"
          aria-label="Verify this article with AIFA"
        >
          <ShieldCheck className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform duration-150" strokeWidth={2.4} />
          <span className="tracking-tight whitespace-nowrap">Verify with AIFA</span>
        </button>
      )}
    </div>
  );
};
