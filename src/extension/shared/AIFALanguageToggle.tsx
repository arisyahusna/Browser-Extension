import React from 'react';
import { Tabs } from '@sebenarnya/design-system';
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
    <Tabs
      mode="toggle"
      label="Language"
      // Never squeeze the segments: in the narrow popup header "EN" would wrap to "E / N".
      className="shrink-0 whitespace-nowrap"
      value={language}
      onChange={(value) => setLanguage(value as AppLanguage)}
      items={OPTIONS.map((opt) => ({ value: opt.value, label: opt.short, title: opt.name, lang: opt.value }))}
    />
  );
};
