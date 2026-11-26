import React from 'react';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFASimulatedAnalysis: React.FC = () => {
  const { analysisStep, analysisProgress, closePanel, detectedArticle, detectedSocialPost } =
    useAifa();

  const isSocial = Boolean(detectedSocialPost);

  const steps = isSocial
    ? [
        {
          id: 'extracting',
          title: 'Step 1 — Extracting Post Caption',
          desc: 'Reading the text of the selected social media post.',
        },
        {
          id: 'identifying',
          title: 'Step 2 — Identifying Claims',
          desc: 'Detecting factual statements in the post that can be verified.',
        },
        {
          id: 'reviewing',
          title: 'Step 3 — Reviewing Evidence Database',
          desc: 'Cross-referencing Sebenarnya.my and official public records.',
        },
        {
          id: 'complete',
          title: 'Step 4 — Verification Complete',
          desc: 'Post verification results ready.',
        },
      ]
    : [
        {
          id: 'extracting',
          title: 'Step 1 — Extracting Content',
          desc: 'Reading the selected article and identifying relevant information.',
        },
        {
          id: 'identifying',
          title: 'Step 2 — Identifying Claims',
          desc: 'Detecting factual statements that can be verified.',
        },
        {
          id: 'reviewing',
          title: 'Step 3 — Reviewing Evidence',
          desc: 'Comparing identified claims with available reference information.',
        },
        {
          id: 'complete',
          title: 'Step 4 — Analysis Complete',
          desc: 'Your verification results are ready.',
        },
      ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['extracting', 'identifying', 'reviewing', 'complete'];
    const currentIndex = stepOrder.indexOf(analysisStep);
    const thisIndex = stepOrder.indexOf(stepId);

    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'active';
    return 'pending';
  };

  const titleText = isSocial
    ? detectedSocialPost?.author.name || 'Social Media Post'
    : detectedArticle?.title || 'Selected Article';

  return (
    <div className="px-1 py-4 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-14 h-14 rounded-full bg-[#FBE4E6] flex items-center justify-center mx-auto text-[#D93043]">
          <ShieldCheck className="w-6 h-6 animate-pulse" strokeWidth={2.4} />
        </div>
        <h3 className="text-lg font-bold text-[#2A2A2A] tracking-tight">
          AIFA Assistant Analysing Content
        </h3>
        <p className="text-xs text-[#6F6D69] max-w-xs mx-auto truncate font-medium">
          {titleText}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-[11px] text-[#6F6D69] font-semibold">
          <span>Verification Pipeline</span>
          <span className="text-[#2A2A2A]">{analysisProgress}%</span>
        </div>
        <div className="w-full h-2 bg-[#E8E6E2] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D93043] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-2.5 pt-1">
        {steps.map((st) => {
          const status = getStepStatus(st.id);
          return (
            <div
              key={st.id}
              className={`p-4 rounded-[20px] transition-all duration-200 ${
                status === 'active'
                  ? 'bg-[#FBE4E6]'
                  : status === 'completed'
                  ? 'bg-white'
                  : 'bg-white opacity-50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-[#3A8656]" />
                  )}
                  {status === 'active' && (
                    <Loader2 className="w-4 h-4 text-[#D93043] animate-spin" />
                  )}
                  {status === 'pending' && (
                    <span className="w-4 h-4 rounded-full border-[1.5px] border-[#D6D4CF] flex items-center justify-center text-[9px] text-[#6F6D69]">
                      •
                    </span>
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs ${
                      status === 'active'
                        ? 'text-[#7A1724] font-bold'
                        : status === 'completed'
                        ? 'text-[#2A2A2A] font-semibold'
                        : 'text-[#6F6D69] font-semibold'
                    }`}
                  >
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-[#6F6D69] mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel option */}
      <div className="pt-1 text-center">
        <button
          type="button"
          onClick={closePanel}
          className="h-9 px-4 rounded-full text-xs text-[#6F6D69] hover:text-[#2A2A2A] hover:bg-[#E2E4EA] font-semibold transition-colors"
        >
          Cancel Verification
        </button>
      </div>
    </div>
  );
};
