import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { SocialPost } from '../../types/social';
import { ExtensionSurface } from '../shared/ExtensionSurface';

interface AIFAPostVerifyButtonProps {
  post: SocialPost;
  /** The post is hovered or is the one being verified. */
  isHighlighted: boolean;
  /** The verification panel is open for this post. */
  isPanelActive: boolean;
}

/**
 * Content-script UI: the floating "Verify with AIFA" button on a detected social post.
 * In a real extension this needs a scoped (Shadow DOM) mode of the design system.
 */
export const AIFAPostVerifyButton: React.FC<AIFAPostVerifyButtonProps> = ({ post, isHighlighted, isPanelActive }) => {
  const { triggerVerification } = useAifa();

  return (
    <ExtensionSurface density="compact">
      <div
        className={`font-sans transition-opacity duration-fast ease-out ${
          isHighlighted ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {isPanelActive ? (
          <Button
            size="sm"
            icon={ShieldCheck}
            iconEnd={<span className="size-dot rounded-full bg-success animate-pulse" aria-hidden="true" />}
            onClick={() => triggerVerification(post)}
            className="shadow-float"
          >
            Panel Active
          </Button>
        ) : (
          <Button
            size="sm"
            icon={ShieldCheck}
            onClick={() => triggerVerification(post)}
            title="Verify this social media post using AIFA"
            className="shadow-float"
          >
            Verify with AIFA
          </Button>
        )}
      </div>
    </ExtensionSurface>
  );
};
