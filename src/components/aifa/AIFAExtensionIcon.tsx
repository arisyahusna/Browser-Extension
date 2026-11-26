import React from 'react';
import { useAifa } from '../../context/AifaContext';

interface AIFAExtensionIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AIFAExtensionIcon: React.FC<AIFAExtensionIconProps> = ({ isOpen, onClick }) => {
  const { detectedArticle, detectedSocialPost, isExtensionEnabled } = useAifa();

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
      {/* Sebenarnya.my extension icon */}
      <div className="relative flex items-center justify-center">
        <img
          src="/images/sebenarnya-icon.png"
          alt=""
          draggable={false}
          className={`w-5 h-5 object-contain transition-transform duration-150 ${
            isOpen ? 'scale-105' : 'group-hover:scale-110'
          }`}
        />

        {/* Status badge: static green when the extension is ON, red when OFF */}
        <span
          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ring-[1.5px] ring-white ${
            isExtensionEnabled ? 'bg-emerald-500' : 'bg-[#D93043]'
          }`}
        />
      </div>
    </button>
  );
};
