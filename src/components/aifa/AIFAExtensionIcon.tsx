import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

interface AIFAExtensionIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AIFAExtensionIcon: React.FC<AIFAExtensionIconProps> = ({ isOpen, onClick }) => {
  const { detectedArticle, detectedSocialPost } = useAifa();

  const isDetected = Boolean(detectedArticle || detectedSocialPost);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="AIFA Fact-Checking Assistant Extension"
      title={
        detectedSocialPost
          ? `AIFA: Social post detected on ${detectedSocialPost.platform}`
          : detectedArticle
          ? `AIFA: Article detected ("${detectedArticle?.title}")`
          : 'AIFA Fact-Checking Assistant (Sebenarnya.my)'
      }
      className={`relative group flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150 ${
        isOpen
          ? 'bg-rose-100 ring-2 ring-[#D93043]/30 text-[#D93043]'
          : 'text-slate-600 hover:text-[#D93043] hover:bg-slate-100 active:bg-slate-200'
      }`}
    >
      {/* Chrome Extension Icon Iconography: Clean Minimal Red Shield-Check */}
      <div className="relative flex items-center justify-center">
        <ShieldCheck
          className={`w-[18px] h-[18px] transition-transform duration-150 ${
            isOpen ? 'text-[#D93043] scale-105' : 'text-[#D93043] group-hover:scale-110'
          }`}
          strokeWidth={2.2}
        />

        {/* Dynamic Status Badge */}
        {isDetected ? (
          /* Active Green/Red Pulse Indicator when article or social post is detected */
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 ring-1.5 ring-white" />
          </span>
        ) : (
          /* Standard subtle badge */
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D93043] ring-1.5 ring-white" />
        )}
      </div>
    </button>
  );
};
