import React from 'react';
import { ShieldCheck, Maximize2 } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFAMinimizedFloatingButton: React.FC = () => {
  const { panelMode, restorePanel, verificationResult } = useAifa();

  if (panelMode !== 'minimized' || !verificationResult) return null;

  return (
    <div className="fixed top-28 right-4 z-40 animate-in fade-in slide-in-from-right-4 duration-200">
      <button
        type="button"
        onClick={restorePanel}
        className="group flex items-center gap-2 pl-2.5 pr-3.5 py-2 rounded-full bg-[#171B26] text-white text-xs font-semibold shadow-xl border border-slate-700 hover:border-rose-400 hover:bg-slate-900 transition-all cursor-pointer select-none"
        title="Restore AIFA Verification Panel"
      >
        <div className="w-5 h-5 rounded-full bg-rose-500/20 text-[#D93043] flex items-center justify-center">
          <ShieldCheck className="w-3.5 h-3.5" />
        </div>
        <span>AIFA Results</span>
        <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300 border border-slate-700">
          {verificationResult.claims.length} Claims
        </span>
        <Maximize2 className="w-3 h-3 text-slate-400 group-hover:text-white transition-colors" />
      </button>
    </div>
  );
};

