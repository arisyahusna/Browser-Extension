import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Search, MousePointerClick, FileQuestion } from 'lucide-react';

const STEPS = [
  {
    title: 'Smart Content Detection',
    tagline: 'Hover to detect verifiable content',
    icon: <MousePointerClick className="w-6 h-6 text-[#D93043]" />,
    description:
      'As you browse news websites and social media platforms like ConnectSocial and PulseFeed, AIFA automatically detects full articles and social media posts. A gentle red outline highlights the target content.',
    tip: 'No text selection required — simply hover your cursor over any story or social feed post.',
    visual: (
      <div className="bg-white rounded-[22px] p-4 space-y-2 text-left">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[#2F6B45] font-semibold bg-[#DCEFE2] px-2.5 py-1 rounded-full">Detected</span>
        </div>
        <div className="border-2 border-[#D93043] rounded-2xl p-3.5 bg-white relative">
          <div className="h-3 bg-[#E8E6E2] rounded-full w-3/4 mb-2" />
          <div className="h-2 bg-[#F0EFEC] rounded-full w-full mb-1.5" />
          <div className="h-2 bg-[#F0EFEC] rounded-full w-5/6" />
          <div className="mt-3 flex justify-end">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D93043] text-white text-[11px] font-semibold rounded-full animate-bounce motion-reduce:animate-none">
              Verify with AIFA
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Real-Time Claim Verification',
    tagline: 'AI analysis with official Sebenarnya.my evidence',
    icon: <Search className="w-6 h-6 text-[#D93043]" />,
    description:
      'Clicking the floating button opens the AIFA side drawer. The assistant analyzes the text, isolates distinct factual statements, and cross-references them against official Sebenarnya.my verification archives.',
    tip: 'Click any claim in the panel to instantly scroll and locate the exact statement in the article!',
    visual: (
      <div className="bg-white rounded-[22px] p-3 space-y-2">
        <div className="flex items-center gap-2 p-2.5 bg-[#F4F3F1] rounded-2xl">
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#DFE6F5] text-[#3F5C9E]">
            Supported
          </span>
          <div className="text-xs text-[#2A2A2A] truncate font-medium">
            National AI initiatives verified in official portals
          </div>
        </div>
        <div className="flex items-center gap-2 p-2.5 bg-[#F4F3F1] rounded-2xl">
          <span className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F7DEDB] text-[#9B3D36]">
            False
          </span>
          <div className="text-xs text-[#2A2A2A] truncate font-medium">Viral RM500 administrative fee claim refuted</div>
        </div>
        <div className="pt-1 text-[11px] text-[#6F6D69] text-center italic">
          Each claim includes primary source links and official clarifications.
        </div>
      </div>
    ),
  },
  {
    title: 'Official Fact-Check Requests',
    tagline: 'Submit unverified claims to professional researchers',
    icon: <FileQuestion className="w-6 h-6 text-[#D93043]" />,
    description:
      'If an extracted claim has insufficient public evidence or is completely unverified, you can submit it directly to the Sebenarnya.my editorial team. Track your request status in your personal dashboard.',
    tip: 'You will receive simulated in-app updates and email previews when reviews conclude.',
    visual: (
      <div className="bg-white rounded-[22px] p-3">
        <div className="bg-[#F4F3F1] p-3.5 rounded-2xl">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-[#2A2A2A]">Ref: AIFA-DEMO-001</span>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#F4EBCB] text-[#715C1C]">
              Under Review
            </span>
          </div>
          <div className="text-xs text-[#5C5A56] mt-1.5 line-clamp-1">
            RM500 annual administrative contribution viral rumor
          </div>
          <div className="mt-2 text-[10px] text-[#6F6D69]">Submitted: 11 Nov 2026 • Priority: Normal</div>
        </div>
      </div>
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
  /** Tighter spacing for the 340px toolbar popup. */
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
  const pad = compact ? 'px-4' : 'px-6';

  const goTo = (next: number) => {
    setStep(next);
    onStepChange?.(next);
  };

  return (
    <>
      <div className={`${pad} ${compact ? 'pt-1 pb-4 space-y-3.5' : 'pt-3 pb-6 space-y-4'}`}>
        <div className="flex items-center gap-3.5">
          <div
            className={`${compact ? 'w-12 h-12' : 'w-14 h-14'} rounded-full bg-[#FBE4E6] flex items-center justify-center shrink-0`}
          >
            {current.icon}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-[#A31F30]">{current.tagline}</div>
            <h2
              id={titleId}
              className={`${compact ? 'text-base leading-snug' : 'text-xl'} font-bold text-[#2A2A2A] tracking-tight`}
            >
              {current.title}
            </h2>
          </div>
        </div>

        <p className="text-xs text-[#5C5A56] leading-relaxed">{current.description}</p>

        {current.visual}

        <div className="flex items-start gap-2 px-4 py-3 rounded-[18px] bg-[#DFE6F5] text-[11px] text-[#2E3A55] leading-relaxed">
          <Sparkles className="w-3.5 h-3.5 text-[#3F5C9E] shrink-0 mt-0.5" />
          <span>
            <strong className="font-semibold">Tip:</strong> {current.tip}
          </span>
        </div>
      </div>

      <div className={`${pad} ${compact ? 'py-3' : 'py-4'} border-t border-[#E0DED9] flex items-center justify-between gap-2`}>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {STEPS.map((_, idx) => (
            <span
              key={idx}
              className={`h-2 rounded-full transition-all ${idx === step ? 'w-6 bg-[#2A2A2A]' : 'w-2 bg-[#D6D4CF]'}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => goTo(step - 1)}
              className="h-10 px-4 text-xs font-semibold text-[#2A2A2A] border border-[#2A2A2A]/15 hover:bg-[#E2E4EA] rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onSkip}
              className="h-10 px-4 text-xs font-semibold text-[#6F6D69] hover:text-[#2A2A2A] hover:bg-[#E2E4EA] rounded-full transition-colors cursor-pointer"
            >
              Skip
            </button>
          )}

          <button
            type="button"
            onClick={() => (isLast ? onFinish() : goTo(step + 1))}
            className="h-10 px-5 text-xs font-semibold text-white bg-[#2A2A2A] hover:bg-black rounded-full transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLast ? (
              'Get Started'
            ) : (
              <>
                Next
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};
