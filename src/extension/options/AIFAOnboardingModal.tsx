import React, { useEffect, useState } from 'react';
import { Dialog } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { AIFAUserGuideContent, GUIDE_STEP_COUNT } from '../shared/AIFAUserGuideContent';
import { ExtensionSurface } from '../shared/ExtensionSurface';

export const AIFAOnboardingModal: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, completeOnboarding } = useAifa();
  const [step, setStep] = useState(0);

  // Each opening starts from step 1 (the content remounts, so keep the counter in sync).
  useEffect(() => {
    if (isOnboardingOpen) setStep(0);
  }, [isOnboardingOpen]);

  return (
    <ExtensionSurface>
      <Dialog
        open={isOnboardingOpen}
        onOpenChange={(open) => !open && closeOnboarding()}
        // The original modal did not close on a backdrop click.
        dismissible={false}
        // base.css gives a real extension page Manrope on <body>; here the dialog sits inside the simulated browser.
        className="font-sans"
        title="User Guide"
        description={`Step ${step + 1} of ${GUIDE_STEP_COUNT}`}
        icon={
          <img
            src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
            alt=""
            className="size-avatar-sm object-contain"
            draggable={false}
          />
        }
      >
        <AIFAUserGuideContent onStepChange={setStep} onFinish={completeOnboarding} onSkip={closeOnboarding} />
      </Dialog>
    </ExtensionSurface>
  );
};
