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
      className={`font-['Montserrat',sans-serif] antialiased transition-all duration-200 ease-out select-none ${
        isHighlighted || isPanelOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-1 pointer-events-none'
      }`}
    >
      {isPanelOpen ? (
        <button
          type="button"
          onClick={openPanel}
          className="flex items-center gap-2 h-9 px-4 bg-[#2A2A2A] hover:bg-black text-white text-xs font-semibold rounded-full shadow-[0_8px_20px_-8px_rgba(42,42,42,0.5)] transition-colors cursor-pointer"
          title="AIFA Verification Panel is open on the right"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#F2A7AF]" />
          <span>AIFA Panel Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5" />
        </button>
      ) : (
        /* Floating "Verify with AIFA" Action Button */
        <button
          type="button"
          onClick={() => triggerVerification()}
          className="group flex items-center gap-2 h-10 px-4 bg-[#D93043] hover:bg-[#C02638] active:bg-[#A81F2F] text-white text-xs font-semibold rounded-full shadow-[0_8px_20px_-6px_rgba(217,48,67,0.55)] transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D93043]/50 cursor-pointer"
          aria-label="Verify this article with AIFA"
        >
          <ShieldCheck
            className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform duration-150"
            strokeWidth={2.4}
          />
          <span className="whitespace-nowrap">Verify with AIFA</span>
        </button>
      )}
    </div>
  );
};
