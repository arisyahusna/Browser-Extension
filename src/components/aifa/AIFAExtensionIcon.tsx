import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AIFAExtensionIconProps {
  isOpen: boolean;
  onClick: () => void;
}

export const AIFAExtensionIcon: React.FC<AIFAExtensionIconProps> = ({ isOpen, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="AIFA Fact-Checking Assistant Extension"
      title="AIFA Fact-Checking Assistant (Sebenarnya.my)"
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
        {/* Active badge dot */}
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D93043] ring-1.5 ring-white" />
      </div>
    </button>
  );
};
