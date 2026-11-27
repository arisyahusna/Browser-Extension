import React from 'react';
import { Button, Dialog } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { AIFASettingsContent } from '../shared/AIFASettingsContent';
import { ExtensionSurface } from '../shared/ExtensionSurface';

export const AIFASettingsModal: React.FC = () => {
  const { isSettingsModalOpen, setSettingsModalOpen, setSignInModalOpen, openOnboarding } = useAifa();

  return (
    <ExtensionSurface>
      <Dialog
        open={isSettingsModalOpen}
        onOpenChange={setSettingsModalOpen}
        // The original modal did not close on a backdrop click.
        dismissible={false}
        // base.css gives a real extension page Manrope on <body>; here the dialog sits inside the simulated browser.
        className="font-sans"
        title="Extension Settings"
        description="Preferences, connected accounts, and demo controls"
        icon={
          <img
            src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
            alt=""
            className="size-avatar-sm object-contain"
            draggable={false}
          />
        }
        footer={<Button onClick={() => setSettingsModalOpen(false)}>Done</Button>}
      >
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
      </Dialog>
    </ExtensionSurface>
  );
};
