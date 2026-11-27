import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Search, MousePointerClick, FileQuestion } from 'lucide-react';
import { Alert, Badge, Button, Card, Icon, Verdict, type IconComponent } from '@sebenarnya/design-system';

/** A grey bar standing in for a line of article text in the illustrations. */
const TextLine: React.FC<{ width: string }> = ({ width }) => (
  <div className={`h-8 rounded-full bg-muted-strong ${width}`} />
);

const STEPS: {
  title: string;
  tagline: string;
  icon: IconComponent;
  description: string;
  tip: string;
  visual: React.ReactNode;
}[] = [
  {
    title: 'Smart Content Detection',
    tagline: 'Hover to detect verifiable content',
    icon: MousePointerClick,
    description:
      'As you browse news websites and social media platforms like ConnectSocial and PulseFeed, AIFA automatically detects full articles and social media posts. A gentle red outline highlights the target content.',
    tip: 'No text selection required — simply hover your cursor over any story or social feed post.',
    visual: (
      <Card variant="raised" size="sm" className="flex flex-col gap-text">
        <Badge size="sm">Detected</Badge>
        <div className="flex flex-col gap-6 p-12 rounded-media border border-foreground">
          <TextLine width="w-3/4" />
          <TextLine width="w-full" />
          <TextLine width="w-5/6" />
          <div className="mt-4 flex justify-end">
            <span className="inline-flex items-center h-badge px-badge-x rounded-badge bg-primary text-primary-foreground text-badge animate-bounce motion-reduce:animate-none">
              Verify with AIFA
            </span>
          </div>
        </div>
      </Card>
    ),
  },
  {
    title: 'Real-Time Claim Verification',
    tagline: 'AI analysis with official Sebenarnya.my evidence',
    icon: Search,
    description:
      'Clicking the floating button opens the AIFA side drawer. The assistant analyzes the text, isolates distinct factual statements, and cross-references them against official Sebenarnya.my verification archives.',
    tip: 'Click any claim in the panel to instantly scroll and locate the exact statement in the article!',
    visual: (
      <Card variant="raised" size="sm" className="flex flex-col gap-text">
        <div className="flex items-center gap-inline p-8 rounded-media bg-muted">
          <Verdict type="benar" label="Supported" />
          <span className="text-body-sm text-foreground truncate">National AI initiatives verified in official portals</span>
        </div>
        <div className="flex items-center gap-inline p-8 rounded-media bg-muted">
          <Verdict type="palsu" label="False" />
          <span className="text-body-sm text-foreground truncate">Viral RM500 administrative fee claim refuted</span>
        </div>
        <p className="text-caption text-muted-foreground text-center italic">
          Each claim includes primary source links and official clarifications.
        </p>
      </Card>
    ),
  },
  {
    title: 'Official Fact-Check Requests',
    tagline: 'Submit unverified claims to professional researchers',
    icon: FileQuestion,
    description:
      'If an extracted claim has insufficient public evidence or is completely unverified, you can submit it directly to the Sebenarnya.my editorial team. Track your request status in your personal dashboard.',
    tip: 'You will receive simulated in-app updates and email previews when reviews conclude.',
    visual: (
      <Card variant="raised" size="sm">
        <div className="flex flex-col gap-4 p-12 rounded-media bg-muted">
          <div className="flex items-center justify-between gap-inline">
            <span className="text-label-sm text-foreground">Ref: AIFA-DEMO-001</span>
            <Badge size="sm" variant="outline">
              Under Review
            </Badge>
          </div>
          <p className="text-body-sm text-text-secondary line-clamp-1">RM500 annual administrative contribution viral rumor</p>
          <p className="text-caption text-muted-foreground">Submitted: 11 Nov 2026 • Priority: Normal</p>
        </div>
      </Card>
    ),
  },
];

export const GUIDE_STEP_COUNT = STEPS.length;

interface AIFAUserGuideContentProps {
  /** Finished the last step ("Get Started"). */
  onFinish: () => void;
  /** Left on the first step ("Skip"). */
  onSkip: () => void;
  /** Lets the host show "Step n of N" in its own header. */
  onStepChange?: (step: number) => void;
  /** The 340px toolbar popup: tighter type and its own side padding (a Dialog body already has padding). */
  compact?: boolean;
  titleId?: string;
}

/** The 3-step walkthrough, shared by the onboarding modal and the toolbar popup's User Guide view. */
export const AIFAUserGuideContent: React.FC<AIFAUserGuideContentProps> = ({
  onFinish,
  onSkip,
  onStepChange,
  compact = false,
  titleId,
}) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const pad = compact ? 'px-16' : '';

  const goTo = (next: number) => {
    setStep(next);
    onStepChange?.(next);
  };

  return (
    <>
      <div className={`${pad} pb-16 flex flex-col gap-group`}>
        <div className="flex items-center gap-12">
          <div className="size-avatar rounded-full bg-card text-foreground flex items-center justify-center shrink-0">
            <Icon icon={current.icon} size="xl" />
          </div>
          <div className="min-w-0 flex flex-col gap-2">
            <p className="text-eyebrow uppercase text-muted-foreground">{current.tagline}</p>
            <h2 id={titleId} className={`${compact ? 'text-title' : 'text-heading'} text-foreground`}>
              {current.title}
            </h2>
          </div>
        </div>

        <p className="text-body-sm text-text-secondary">{current.description}</p>

        {current.visual}

        <Alert icon={Sparkles}>
          <strong>Tip:</strong> {current.tip}
        </Alert>
      </div>

      <div className={`${pad} py-12 border-t border-border flex items-center justify-between gap-inline`}>
        <div className="flex items-center gap-6" aria-hidden="true">
          {STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`h-dot rounded-full transition-[width,background-color] duration-base ease-out ${
                idx === step ? 'w-24 bg-foreground' : 'w-dot bg-border'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-inline">
          {step > 0 ? (
            <Button variant="outline" size="sm" icon={ArrowLeft} onClick={() => goTo(step - 1)}>
              Back
            </Button>
          ) : (
            <Button variant="quiet" size="sm" onClick={onSkip}>
              Skip
            </Button>
          )}

          <Button size="sm" iconEnd={isLast ? undefined : ArrowRight} onClick={() => (isLast ? onFinish() : goTo(step + 1))}>
            {isLast ? 'Get Started' : 'Next'}
          </Button>
        </div>
      </div>
    </>
  );
};
