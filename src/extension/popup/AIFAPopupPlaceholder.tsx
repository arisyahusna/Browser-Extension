import React, { useEffect, useRef } from 'react';
import { ShieldCheck, X, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Alert, Badge, Button, Card, Icon, IconButton } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

interface AIFAPopupPlaceholderProps {
  isOpen: boolean;
  onClose: () => void;
}

/** Earlier (Stage 4) popup. Not mounted anywhere; kept and styled with the design system. */
export const AIFAPopupPlaceholder: React.FC<AIFAPopupPlaceholderProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const {
    detectedArticle,
    detectedSocialPost,
    triggerVerification,
    panelMode,
    openPanel,
  } = useAifa();

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ready = (detail: string) => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6 text-label-sm text-foreground">
        <span className="size-dot rounded-full bg-success animate-pulse" />
        <span>AIFA is ready</span>
      </div>
      <p className="text-body-sm text-muted-foreground">{detail}</p>
    </div>
  );

  const panelActive = (
    <div className="flex flex-col gap-8">
      <Alert variant="success" icon={CheckCircle2}>
        Verification panel is active on the right.
      </Alert>
      <Button
        iconEnd={ArrowRight}
        onClick={() => {
          openPanel();
          onClose();
        }}
        className="w-full"
      >
        Focus Side Panel
      </Button>
    </div>
  );

  return (
    <ExtensionSurface density="compact">
      <div
        ref={popupRef}
        className="aifa-popup-frame absolute top-48 right-24 z-dropdown bg-card rounded-card-lg border border-border shadow-float overflow-hidden font-sans text-body-sm text-foreground"
      >
        {/* Extension Header */}
        <div className="bg-muted px-16 py-12 border-b border-border flex items-center justify-between gap-inline">
          <div className="flex items-center gap-inline">
            <div className="size-avatar-sm rounded-full bg-card flex items-center justify-center">
              <Icon icon={ShieldCheck} />
            </div>
            <div>
              <h3 className="flex items-center gap-6 text-label-sm text-foreground">
                AIFA Assistant
                <Badge size="sm" variant="outline" className="self-center">
                  Stage 4
                </Badge>
              </h3>
              <p className="text-caption text-muted-foreground">by Sebenarnya.my</p>
            </div>
          </div>
          <IconButton icon={X} label="Close popup" variant="quiet" size="icon-sm" onClick={onClose} />
        </div>

        {/* Extension Body */}
        <div className="p-16 flex flex-col gap-group">
          {detectedSocialPost ? (
            /* Contextual Status: Social Post Detected */
            <div className="flex flex-col gap-12">
              {ready(`Social post detected on ${detectedSocialPost.platform}.`)}

              <Card size="sm" className="flex flex-col gap-6">
                <span className="text-eyebrow uppercase text-muted-foreground">{detectedSocialPost.author.name}</span>
                <p className="text-body-sm font-medium text-foreground line-clamp-2">"{detectedSocialPost.caption}"</p>
              </Card>

              {panelMode === 'expanded' ? (
                panelActive
              ) : (
                <Button
                  icon={ShieldCheck}
                  iconEnd={ArrowRight}
                  onClick={() => {
                    triggerVerification(detectedSocialPost);
                    onClose();
                  }}
                  className="w-full"
                >
                  Verify this Post with AIFA
                </Button>
              )}
            </div>
          ) : detectedArticle ? (
            /* Contextual Status: Article Detected */
            <div className="flex flex-col gap-12">
              {ready('An article has been detected on this page.')}

              <Card size="sm" className="flex flex-col gap-6">
                <span className="text-eyebrow uppercase text-muted-foreground">{detectedArticle.category}</span>
                <h4 className="text-label-sm text-foreground line-clamp-2">{detectedArticle.title}</h4>
              </Card>

              {panelMode === 'expanded' ? (
                panelActive
              ) : (
                <Button
                  icon={ShieldCheck}
                  iconEnd={ArrowRight}
                  onClick={() => {
                    triggerVerification();
                    onClose();
                  }}
                  className="w-full"
                >
                  Verify this Article
                </Button>
              )}
            </div>
          ) : (
            /* Contextual Status: No Content Selected */
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-6 text-label-sm text-foreground">
                  <span className="size-dot rounded-full bg-muted-foreground" />
                  <span>No content selected</span>
                </div>
                <p className="text-body-sm text-muted-foreground">
                  Open a news article or hover over a social media post to begin verification.
                </p>
              </div>

              <Alert icon={Sparkles} title="Multi-Platform Scanner Active">
                AIFA automatically identifies news stories and social posts.
              </Alert>
            </div>
          )}

          {/* Footer info */}
          <div className="pt-8 border-t border-border flex items-center justify-between text-caption text-muted-foreground">
            <span>Sebenarnya.my Initiative</span>
            <span>Stage 4 Active</span>
          </div>
        </div>
      </div>
    </ExtensionSurface>
  );
};
