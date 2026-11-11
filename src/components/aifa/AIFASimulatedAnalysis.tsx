import React from 'react';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFASimulatedAnalysis: React.FC = () => {
  const { analysisStep, analysisProgress, closePanel, detectedArticle } = useAifa();

  const steps = [
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

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto text-[#D93043] shadow-xs">
          <ShieldCheck className="w-6 h-6 animate-pulse" strokeWidth={2.4} />
        </div>
        <h3 className="font-serif text-lg font-bold text-[#171B26]">
          AIFA Assistant Analysing Article
        </h3>
        <p className="text-xs text-[#667085] max-w-xs mx-auto truncate">
          {detectedArticle?.title}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-500 font-medium">
          <span>Verification Pipeline</span>
          <span>{analysisProgress}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D93043] transition-all duration-300 ease-out rounded-full"
            style={{ width: `${analysisProgress}%` }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="space-y-3 pt-2">
        {steps.map((st) => {
          const status = getStepStatus(st.id);
          return (
            <div
              key={st.id}
              className={`p-3 rounded-xl border transition-all duration-200 ${
                status === 'active'
                  ? 'bg-rose-50/40 border-rose-200 shadow-xs'
                  : status === 'completed'
                  ? 'bg-emerald-50/30 border-emerald-100 opacity-90'
                  : 'bg-white border-slate-100 opacity-50'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 shrink-0">
                  {status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  )}
                  {status === 'active' && (
                    <Loader2 className="w-4 h-4 text-[#D93043] animate-spin" />
                  )}
                  {status === 'pending' && (
                    <span className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] text-slate-400">
                      •
                    </span>
                  )}
                </div>
                <div>
                  <h4
                    className={`text-xs font-semibold ${
                      status === 'active'
                        ? 'text-rose-950 font-bold'
                        : status === 'completed'
                        ? 'text-emerald-950'
                        : 'text-slate-500'
                    }`}
                  >
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel option */}
      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={closePanel}
          className="text-xs text-slate-400 hover:text-slate-600 font-medium transition-colors"
        >
          Cancel Verification
        </button>
      </div>
    </div>
  );
};
