import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFAVerifyButton: React.FC = () => {
  const {
    detectedArticle,
    isHighlighted,
    setIsButtonHovered,
    triggerVerification,
    panelMode,
    openPanel,
  } = useAifa();

  if (!detectedArticle) return null;

  const isPanelOpen = panelMode === 'expanded';

  return (
    <div
      onMouseEnter={() => setIsButtonHovered(true)}
      onMouseLeave={() => setIsButtonHovered(false)}
      className={`transition-all duration-200 ease-out select-none ${
        isHighlighted || isPanelOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      {isPanelOpen ? (
        <button
          type="button"
          onClick={openPanel}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-md border border-slate-700 transition-colors cursor-pointer"
          title="AIFA Verification Panel is open on the right"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
          <span>AIFA Panel Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
        </button>
      ) : (
        /* Floating "Verify with AIFA" Action Button */
        <button
          type="button"
          onClick={triggerVerification}
          className="group flex items-center gap-2 px-3.5 py-2 bg-[#D93043] hover:bg-[#C02638] active:bg-[#A81F2F] text-white text-xs font-semibold rounded-xl shadow-[0_4px_16px_rgba(217,48,67,0.32)] hover:shadow-[0_6px_20px_rgba(217,48,67,0.42)] active:scale-98 transition-all duration-150 border border-white/20 focus:outline-none focus:ring-2 focus:ring-[#D93043]/50 cursor-pointer"
          aria-label="Verify this article with AIFA"
        >
          <ShieldCheck
            className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform duration-150"
            strokeWidth={2.4}
          />
          <span className="tracking-tight whitespace-nowrap">Verify with AIFA</span>
        </button>
      )}
    </div>
  );
};
