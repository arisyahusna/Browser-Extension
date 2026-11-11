import React, { useEffect, useRef } from 'react';
import { ShieldCheck, X, Sparkles, Info, CheckCircle2 } from 'lucide-react';

interface AIFAPopupPlaceholderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFAPopupPlaceholder: React.FC<AIFAPopupPlaceholderProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={popupRef}
      className="absolute top-12 right-6 z-50 w-80 bg-white rounded-xl shadow-2xl border border-slate-200/80 overflow-hidden text-[#171B26] animate-in fade-in zoom-in-95 duration-150"
      style={{
        boxShadow: '0 12px 32px -4px rgba(23, 27, 38, 0.16), 0 4px 12px -2px rgba(23, 27, 38, 0.08)',
      }}
    >
      {/* Extension Header */}
      <div className="bg-[#F3F5F9] px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D93043]">
            <ShieldCheck className="w-4 h-4" strokeWidth={2.4} />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#171B26] tracking-tight flex items-center gap-1.5">
              AIFA Assistant
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-rose-100 text-[#D93043]">
                v1.0 Mockup
              </span>
            </h3>
            <p className="text-[10px] text-[#667085] leading-none">by Sebenarnya.my</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          aria-label="Close popup"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Extension Body */}
      <div className="p-4 space-y-3.5">
        <div>
          <div className="text-[13px] font-semibold text-[#171B26]">AIFA Fact-Checking Assistant</div>
          <p className="text-xs text-[#667085] mt-0.5 leading-relaxed">
            Extension interface coming in Stage 5.
          </p>
        </div>

        {/* Informational Status Card */}
        <div className="rounded-lg bg-[#F3F5F9] border border-slate-200/70 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-[#D93043] shrink-0 mt-0.5" />
            <div className="text-[11px] text-[#171B26] leading-tight">
              <span className="font-semibold">Browser Simulation Active</span>
              <p className="text-[#667085] mt-1">
                You are previewing Stage 1: Full-Screen Browser Simulation & News Website.
              </p>
            </div>
          </div>
          <div className="border-t border-slate-200 pt-2 space-y-1.5 text-[11px] text-[#667085]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Chrome Tab & Toolbar Simulation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Detectable Article Structure Prepared</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                ○
              </span>
              <span>AI Verification Panels (Scheduled for Stage 2+)</span>
            </div>
          </div>
        </div>

        {/* Association note */}
        <div className="flex items-center justify-between text-[11px] text-[#667085] pt-1">
          <span className="flex items-center gap-1 text-[11px]">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Sebenarnya.my Initiative
          </span>
          <span className="text-[10px] text-slate-400">Stage 1 Active</span>
        </div>
      </div>
    </div>
  );
};
