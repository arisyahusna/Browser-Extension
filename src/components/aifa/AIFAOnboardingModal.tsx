import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { AIFAUserGuideContent, GUIDE_STEP_COUNT } from './AIFAUserGuideContent';

export const AIFAOnboardingModal: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, completeOnboarding } = useAifa();
  const [step, setStep] = useState(0);

  // Each opening starts from step 1 (the content remounts, so keep the counter in sync).
  useEffect(() => {
    if (isOnboardingOpen) setStep(0);
  }, [isOnboardingOpen]);

  if (!isOnboardingOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-['Montserrat',sans-serif] antialiased">
      <div
        className="w-full max-w-lg bg-[#EEEFF3] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(42,42,42,0.4)] border border-[#E0DED9] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
      >
        {/* Top bar */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`} alt="" className="w-8 h-8 object-contain" draggable={false} />
            <span className="text-sm font-semibold text-[#2A2A2A]">User Guide</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#6F6D69]">
              Step {step + 1} of {GUIDE_STEP_COUNT}
            </span>
            <button
              type="button"
              onClick={closeOnboarding}
              className="w-9 h-9 flex items-center justify-center rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer"
              aria-label="Close onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AIFAUserGuideContent
          titleId="onboarding-modal-title"
          onStepChange={setStep}
          onFinish={completeOnboarding}
          onSkip={closeOnboarding}
        />
      </div>
    </div>
  );
};
