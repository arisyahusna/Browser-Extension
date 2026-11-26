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
    <div className="px-1 py-2 space-y-4 animate-in fade-in duration-200 text-xs">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={returnToResults}
          className="w-9 h-9 shrink-0 rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] flex items-center justify-center hover:bg-[#E2E4EA] transition-colors"
          title="Back to verification results"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h3 className="text-base font-bold text-[#2A2A2A] leading-tight tracking-tight">
            Request Status & Tracking
          </h3>
          <p className="text-[11px] text-[#6F6D69] font-mono">
            {currentRequest.referenceNumber}
          </p>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="rounded-[22px] bg-white p-4 space-y-4">
        <h4 className="text-[13px] font-semibold text-[#2A2A2A]">Verification Review Pipeline</h4>
        <div className="space-y-4">
          {timelineSteps.map((step, idx) => (
            <div key={step.title} className="flex items-start gap-3 relative">
              {idx < timelineSteps.length - 1 && (
                <div
                  className={`absolute left-3 top-6 -bottom-4 w-[2px] rounded-full ${
                    step.completed ? 'bg-[#BFE0CA]' : 'bg-[#E8E6E2]'
                  }`}
                />
              )}
              <div className="z-10 shrink-0">
                {step.completed ? (
                  <span className="w-6 h-6 rounded-full bg-[#3A8656] text-white flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="w-6 h-6 rounded-full bg-[#E8E6E2] flex items-center justify-center text-[10px] font-semibold text-[#6F6D69]">
                    {idx + 1}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center gap-2">
                  <span className={`font-semibold ${step.completed ? 'text-[#2A2A2A]' : 'text-[#6F6D69]'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-[#6F6D69]">{step.time}</span>
                </div>
                <p className="text-[11px] text-[#6F6D69] mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Details */}
      <div className="rounded-[22px] bg-white p-4 space-y-2.5">
        <h4 className="text-[13px] font-semibold text-[#2A2A2A]">Inquiry Record</h4>
        <div className="space-y-1.5 text-[#5C5A56] leading-relaxed text-[11.5px]">
          <div>
            <span className="font-semibold text-[#2A2A2A]">Claim Statement: </span>
            <span>"{currentRequest.claimText}"</span>
          </div>
          <div>
            <span className="font-semibold text-[#2A2A2A]">Platform: </span>
            <span>{currentRequest.sourcePlatform}</span>
          </div>
          {currentRequest.additionalNotes && (
            <div>
              <span className="font-semibold text-[#2A2A2A]">User Notes: </span>
              <span className="italic">"{currentRequest.additionalNotes}"</span>
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={returnToResults}
        className="w-full h-11 px-3 rounded-full bg-[#2A2A2A] text-white font-semibold hover:bg-black transition-colors"
      >
        Back to Verification
      </button>
    </div>
  );
};
