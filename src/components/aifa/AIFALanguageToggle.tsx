import React from 'react';
import { useAifa } from '../../context/AifaContext';
import { AppLanguage } from '../../types/aifa';

const OPTIONS: { value: AppLanguage; short: string; name: string }[] = [
  { value: 'en', short: 'EN', name: 'English' },
  { value: 'ms', short: 'BM', name: 'Bahasa Melayu' },
];

/** EN / BM switch. Stores the choice only; the interface is not translated yet. */
export const AIFALanguageToggle: React.FC = () => {
  const { language, setLanguage } = useAifa();

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="h-7 p-0.5 rounded-full bg-white border border-[#E0DED9] inline-flex items-center"
    >
      {OPTIONS.map((opt) => {
        const selected = language === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={opt.name}
            title={opt.name}
            onClick={() => setLanguage(opt.value)}
            className={`h-full min-w-[30px] px-2 rounded-full text-[10px] font-bold tracking-wide transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/50 ${
              selected ? 'bg-[#2A2A2A] text-white' : 'text-[#6F6D69] hover:text-[#2A2A2A]'
            }`}
          >
            {opt.short}
          </button>
        );
      })}
    </div>
  );
};
