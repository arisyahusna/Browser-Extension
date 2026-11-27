import React from 'react';
import { Button } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

interface AIFAExtensionIconProps {
  isOpen: boolean;
  onClick: () => void;
}

/** The extension's action button in the browser toolbar, with an ON/OFF status dot. */
export const AIFAExtensionIcon: React.FC<AIFAExtensionIconProps> = ({ isOpen, onClick }) => {
  const { detectedArticle, detectedSocialPost, isExtensionEnabled } = useAifa();

  return (
    <ExtensionSurface density="compact">
      <Button
        variant={isOpen ? 'secondary' : 'quiet'}
        size="icon-sm"
        onClick={onClick}
        aria-label="AIFA Fact-Checking Assistant Extension"
        aria-expanded={isOpen}
        title={
          detectedSocialPost
            ? `AIFA: Social post detected on ${detectedSocialPost.platform}`
            : detectedArticle
            ? `AIFA: Article detected ("${detectedArticle?.title}")`
            : 'AIFA Fact-Checking Assistant (Sebenarnya.my)'
        }
        icon={
          <span className="relative flex items-center justify-center">
            {/* Sebenarnya.my extension icon */}
            <img
              src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
              alt=""
              draggable={false}
              className="size-icon-lg object-contain"
            />
            {/* Status: green when the extension is ON, red when OFF */}
            <span
              className={`absolute -top-4 -right-4 size-dot rounded-full ring-2 ring-card ${
                isExtensionEnabled ? 'bg-success' : 'bg-destructive'
              }`}
            />
          </span>
        }
      />
    </ExtensionSurface>
  );
};
