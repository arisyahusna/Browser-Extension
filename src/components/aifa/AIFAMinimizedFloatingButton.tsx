import React from 'react';
import { Maximize2 } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFAMinimizedFloatingButton: React.FC = () => {
  const { panelMode, restorePanel, verificationResult } = useAifa();

  if (panelMode !== 'minimized' || !verificationResult) return null;

  return (
    <div className="fixed top-28 right-4 z-40 font-['Montserrat',sans-serif] antialiased animate-in fade-in slide-in-from-right-4 duration-200">
      <button
        type="button"
        onClick={restorePanel}
        className="group flex items-center gap-2 h-11 pl-1.5 pr-4 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-semibold shadow-[0_12px_28px_-10px_rgba(42,42,42,0.6)] transition-colors cursor-pointer select-none"
        title="Restore AIFA Verification Panel"
      >
        <img
          src="/images/sebenarnya-icon.png"
          alt=""
          className="w-8 h-8 rounded-full bg-white object-contain p-0.5"
          draggable={false}
        />
        <span>AIFA Results</span>
        <span className="px-2 py-0.5 rounded-full bg-white/15 text-[10px] text-white/85">
          {verificationResult.claims.length} Claims
        </span>
        <Maximize2 className="w-3 h-3 text-white/60 group-hover:text-white transition-colors" />
      </button>
    </div>
  );
};
