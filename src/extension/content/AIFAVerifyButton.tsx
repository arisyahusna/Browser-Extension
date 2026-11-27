import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

/**
 * Content-script UI: the floating "Verify with AIFA" button on a detected article.
 * In a real extension this needs a scoped (Shadow DOM) mode of the design system; in this
 * mockup the .sb-extension scope keeps it apart from the news site's styles.
 */
export const AIFAVerifyButton: React.FC = () => {
  const {
    detectedArticle,
    isHighlighted,
    setIsButtonHovered,
    triggerVerification,
    panelMode,
    openPanel,
  } = useAifa();

  if (!detectedArticle) return null;

  const isPanelOpen = panelMode === 'expanded';

  return (
    <ExtensionSurface density="compact">
      <div
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
        className={`font-sans transition-[opacity,transform] duration-base ease-out select-none ${
          isHighlighted || isPanelOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        {isPanelOpen ? (
          <Button
            icon={ShieldCheck}
            iconEnd={<span className="size-dot rounded-full bg-success" aria-hidden="true" />}
            onClick={openPanel}
            title="AIFA Verification Panel is open on the right"
            className="shadow-float"
          >
            AIFA Panel Active
          </Button>
        ) : (
          /* Floating "Verify with AIFA" Action Button */
          <Button
            icon={ShieldCheck}
            onClick={() => triggerVerification()}
            aria-label="Verify this article with AIFA"
            className="shadow-float"
          >
            Verify with AIFA
          </Button>
        )}
      </div>
    </ExtensionSurface>
  );
};
