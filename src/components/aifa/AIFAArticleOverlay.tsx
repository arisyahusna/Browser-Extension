import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { AIFAVerifyButton } from '../../extension/content/AIFAVerifyButton';

export const AIFAArticleOverlay: React.FC = () => {
  const { isHighlighted, detectedArticle } = useAifa();

  if (!detectedArticle) return null;

  return (
    <>
      {/* 
        Zero-shift Absolute Detection Badge resting on the top border of the article container 
      */}
      <div className="absolute -top-3.5 left-4 pointer-events-none z-20 select-none">
        <div
          className={`transition-all duration-200 ${
            isHighlighted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D93043] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs border border-white/40">
            <ShieldCheck className="w-3 h-3" strokeWidth={2.4} />
            AIFA Detectable
          </span>
        </div>
      </div>

      {/* 
        Sticky Viewport-Aware Container for AIFA Floating Verification Button 
        Positioned near the upper-right area of the visible article content.
        Uses 0-height sticky wrapper so it never pushes or shifts content.
      */}
      <div className="sticky top-4 z-30 flex justify-end pointer-events-none h-0 overflow-visible">
        <div className="pointer-events-auto transform translate-y-1 sm:translate-y-2 sm:-mr-2">
          <AIFAVerifyButton />
        </div>
      </div>
    </>
  );
};
