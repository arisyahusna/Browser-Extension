import React, { useEffect, useRef } from 'react';
import { ShieldCheck, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

interface AIFAPopupPlaceholderProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFAPopupPlaceholder: React.FC<AIFAPopupPlaceholderProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const { detectedArticle, verificationRequest, triggerVerification } = useAifa();

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
      className="absolute top-12 right-6 z-50 w-84 bg-white rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden text-[#171B26] animate-in fade-in zoom-in-95 duration-150"
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
                Stage 2
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

      {/* Extension Body: Contextual Status based on Stage 2 requirements */}
      <div className="p-4 space-y-3.5">
        {detectedArticle ? (
          /* Contextual Status: Article Detected */
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#171B26]">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>AIFA is ready</span>
              </div>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                An article has been detected on this page.
              </p>
            </div>

            <div className="rounded-lg bg-[#FAFBFD] border border-slate-200/80 p-3 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                {detectedArticle.category}
              </span>
              <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                {detectedArticle.title}
              </h4>
              <p className="text-[10px] text-slate-400">
                Container target: <code className="text-rose-700">data-aifa-detectable="true"</code>
              </p>
            </div>

            {verificationRequest?.status === 'requested' ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2.5 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-[11px] leading-tight">
                  Verification requested. Side panel will connect in Stage 3.
                </span>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  triggerVerification();
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#D93043] hover:bg-[#C02638] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify this Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          /* Contextual Status: No Article Selected (e.g. Homepage / Category) */
          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#171B26]">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>No article selected</span>
              </div>
              <p className="text-xs text-[#667085] mt-1 leading-relaxed">
                Open a news article to begin verification.
              </p>
            </div>

            <div className="rounded-lg bg-[#F3F5F9] border border-slate-200/70 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-600 leading-normal">
                  <span className="font-semibold text-slate-800">Smart Article Detection Active</span>
                  <p className="mt-0.5">
                    AIFA automatically identifies verified news articles when you navigate to them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer info */}
        <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] text-slate-400">
          <span>Sebenarnya.my Initiative</span>
          <span>Stage 2 Active</span>
        </div>
      </div>
    </div>
  );
};
