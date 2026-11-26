import React from 'react';
import { X } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { AIFASettingsContent } from './AIFASettingsContent';

export const AIFASettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, setSignInModalOpen, openOnboarding } = useAifa();

  if (!isSettingsModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-['Montserrat',sans-serif] antialiased">
      <div
        className="w-full max-w-lg bg-[#EEEFF3] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(42,42,42,0.4)] border border-[#E0DED9] overflow-hidden flex flex-col max-h-[85vh] text-[#2A2A2A]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src="/images/sebenarnya-icon.png" alt="" className="w-9 h-9 object-contain" draggable={false} />
            <div>
              <h2 id="settings-modal-title" className="text-lg font-bold text-[#2A2A2A] tracking-tight">
                Extension Settings
              </h2>
              <div className="text-[11px] text-[#6F6D69]">Preferences, connected accounts, and demo controls</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSettingsModalOpen(false)}
            className="w-9 h-9 shrink-0 flex items-center justify-center rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pt-2 pb-6 overflow-y-auto">
          <AIFASettingsContent
            onOpenGuide={() => {
              setSettingsModalOpen(false);
              openOnboarding();
            }}
            onConnect={() => {
              setSettingsModalOpen(false);
              setSignInModalOpen(true);
            }}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E0DED9] flex justify-end">
          <button
            type="button"
            onClick={() => setSettingsModalOpen(false)}
            className="h-10 px-6 text-xs font-semibold text-white bg-[#2A2A2A] hover:bg-black rounded-full transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
