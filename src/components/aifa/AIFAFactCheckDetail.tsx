import React from 'react';
import { useAifa } from '../../context/AifaContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const AIFAFactCheckDetail: React.FC = () => {
  const { currentRequest, returnToResults } = useAifa();

  if (!currentRequest) return null;

  const timelineSteps = [
    { title: 'Submitted', desc: 'Inquiry received by demo system', time: currentRequest.timestamp, completed: true },
    { title: 'Under Review', desc: 'Assigned to Sebenarnya.my fact-checker queue', time: 'Queued', completed: false },
    { title: 'Completed', desc: 'Published fact-check clarification report', time: 'Pending', completed: false },
  ];

  return (
    <div className="p-5 space-y-5 animate-in fade-in duration-200 text-xs">
      {/* Header */}
      <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
        <button
          type="button"
          onClick={returnToResults}
          className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          title="Back to verification results"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="font-serif text-sm font-bold text-slate-900 leading-tight">
            Request Status & Tracking
          </h3>
          <p className="text-[11px] text-slate-400 font-mono">
            {currentRequest.referenceNumber}
          </p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-4 space-y-3">
        <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
          Verification Review Pipeline
        </h4>
        <div className="space-y-4">
          {timelineSteps.map((step, idx) => (
            <div key={step.title} className="flex items-start gap-3 relative">
              {idx < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-2.5 top-5 bottom-0 w-[1px] ${
                    step.completed ? 'bg-emerald-300' : 'bg-slate-200'
                  }`}
                />
              )}
              <div className="mt-0.5 z-10 shrink-0">
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-[10px] text-slate-400">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className={`font-semibold ${step.completed ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{step.time}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Details */}
      <div className="rounded-xl bg-white border border-slate-200 p-4 space-y-2.5">
        <h4 className="text-[10.5px] uppercase font-bold tracking-wider text-slate-500">
          Inquiry Record
        </h4>
        <div className="space-y-1.5 text-slate-700 leading-relaxed text-[11.5px]">
          <div>
            <span className="font-semibold text-slate-800">Claim Statement: </span>
            <span>"{currentRequest.claimText}"</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800">Platform: </span>
            <span>{currentRequest.sourcePlatform}</span>
          </div>
          {currentRequest.additionalNotes && (
            <div>
              <span className="font-semibold text-slate-800">User Notes: </span>
              <span className="text-slate-600 italic">"{currentRequest.additionalNotes}"</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={returnToResults}
        className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
      >
        Back to Verification
      </button>
    </div>
  );
};
