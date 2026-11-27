import React from 'react';
import { Maximize2 } from 'lucide-react';
import { Badge, Button } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

/**
 * Content-script UI: the pill that restores a minimised verification panel.
 * In a real extension this needs a scoped (Shadow DOM) mode of the design system.
 */
export const AIFAMinimizedFloatingButton: React.FC = () => {
  const { panelMode, restorePanel, verificationResult } = useAifa();

  if (panelMode !== 'minimized' || !verificationResult) return null;

  return (
    <ExtensionSurface density="compact">
      <div className="fixed top-120 right-16 z-floating font-sans">
        <Button
          size="lg"
          onClick={restorePanel}
          title="Restore AIFA Verification Panel"
          icon={
            <img
              src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
              alt=""
              className="size-avatar-sm rounded-full bg-card object-contain p-2"
              draggable={false}
            />
          }
          iconEnd={Maximize2}
          className="shadow-float select-none"
        >
          AIFA Results
          {/* .ui-badge aligns to flex-start (for columns); centre it in the button's row */}
          <Badge size="sm" variant="media" className="self-center">
            {verificationResult.claims.length} Claims
          </Badge>
        </Button>
      </div>
    </ExtensionSurface>
  );
};
