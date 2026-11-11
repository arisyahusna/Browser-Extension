import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Search,
  MousePointerClick,
  FileQuestion,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFAOnboardingModal: React.FC = () => {
  const { isOnboardingOpen, closeOnboarding, completeOnboarding } = useAifa();
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOnboardingOpen) return null;

  const steps = [
    {
      title: 'Smart Content Detection',
      tagline: 'Hover to detect verifiable content',
      icon: <MousePointerClick className="w-6 h-6 text-rose-500" />,
      description:
        'As you browse news websites and social media platforms like ConnectSocial and PulseFeed, AIFA automatically detects full articles and social media posts. A gentle red outline highlights the target content.',
      tip: 'No text selection required — simply hover your cursor over any story or social feed post.',
      visual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-left shadow-inner">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>&lt;article data-aifa-detectable="true"&gt;</span>
            <span className="text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
              Detected
            </span>
          </div>
          <div className="border-2 border-[#D93043] rounded-lg p-3 bg-white relative shadow-sm">
            <div className="h-3 bg-slate-200 rounded w-3/4 mb-2" />
            <div className="h-2 bg-slate-100 rounded w-full mb-1" />
            <div className="h-2 bg-slate-100 rounded w-5/6" />
            <div className="mt-3 flex justify-end">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#D93043] text-white text-[11px] font-bold rounded-full shadow-sm animate-bounce">
                🛡️ Verify with AIFA
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Real-Time Claim Verification',
      tagline: 'AI analysis with official Sebenarnya.my evidence',
      icon: <Search className="w-6 h-6 text-rose-500" />,
      description:
        'Clicking the floating button opens the AIFA side drawer. The assistant analyzes the text, isolates distinct factual statements, and cross-references them against official Sebenarnya.my verification archives.',
      tip: 'Click any claim in the panel to instantly scroll and locate the exact statement in the article!',
      visual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-inner">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
              Supported
            </span>
            <div className="text-xs text-slate-700 truncate font-medium">
              National AI initiatives verified in official portals
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-rose-200 shadow-sm bg-rose-50/30">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-100 text-rose-800">
              False
            </span>
            <div className="text-xs text-slate-700 truncate font-medium">
              Viral RM500 administrative fee claim refuted
            </div>
          </div>
          <div className="text-[11px] text-slate-500 text-center italic">
            Each claim includes primary source links and official clarifications.
          </div>
        </div>
      ),
    },
    {
      title: 'Official Fact-Check Requests',
      tagline: 'Submit unverified claims to professional researchers',
      icon: <FileQuestion className="w-6 h-6 text-rose-500" />,
      description:
        'If an extracted claim has insufficient public evidence or is completely unverified, you can submit it directly to the Sebenarnya.my editorial team. Track your request status in your personal dashboard.',
      tip: 'You will receive simulated in-app updates and email previews when reviews conclude.',
      visual: (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 shadow-inner">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">Ref: AIFA-DEMO-001</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                Under Review
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1 line-clamp-1">
              RM500 annual administrative contribution viral rumor
            </div>
            <div className="mt-2 text-[10px] text-slate-400">
              Submitted: 11 Nov 2026 • Priority: Normal
            </div>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLast) {
      completeOnboarding();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-modal-title"
      >
        {/* Top bar */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-rose-50 text-[#D93043] flex items-center justify-center text-sm font-black border border-rose-100">
              🛡️
            </span>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              AIFA Welcome Tour
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400">
              Step {currentStep + 1} of {steps.length}
            </span>
            <button
              type="button"
              onClick={closeOnboarding}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close onboarding"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 shrink-0">
              {current.icon}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#D93043] uppercase tracking-wider">
                {current.tagline}
              </div>
              <h2
                id="onboarding-modal-title"
                className="text-lg font-bold text-slate-900 tracking-tight"
              >
                {current.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed">{current.description}</p>

          {/* Interactive Visual Mockup */}
          {current.visual}

          {/* Pro-tip */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-[11px] text-blue-900">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Tip:</strong> {current.tip}
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 rounded-full transition-all ${
                  idx === currentStep ? 'w-6 bg-[#D93043]' : 'w-2 bg-slate-300'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentStep > 0 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={closeOnboarding}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                Skip Tutorial
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 text-xs font-bold text-white bg-[#D93043] hover:bg-[#B72435] active:bg-[#9B1D2C] rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
            >
              {isLast ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Get Started
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
