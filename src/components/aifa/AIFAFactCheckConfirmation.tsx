import React, { useState } from 'react';
import { useAifa } from '../../context/AifaContext';
import { CheckCircle2, Copy, Check, FileText } from 'lucide-react';

export const AIFAFactCheckConfirmation: React.FC = () => {
  const { currentRequest, returnToResults, viewRequestDetail } = useAifa();
  const [copied, setCopied] = useState(false);

  if (!currentRequest) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(currentRequest.referenceNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="px-1 py-4 space-y-5 animate-in fade-in zoom-in-95 duration-200 text-xs">
      {/* Success Badge Banner */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-16 h-16 rounded-full bg-[#DCEFE2] text-[#3A8656] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
        </div>
        <h3 className="text-lg font-bold text-[#2A2A2A] leading-snug tracking-tight">
          Fact-Check Request Submitted
        </h3>
        <p className="text-[#6F6D69] text-[11px] max-w-xs mx-auto leading-relaxed">
          Your request has been recorded in this demonstration. No real submission has been made.
        </p>
      </div>

      {/* Reference Code Card */}
      <div className="rounded-[22px] bg-white p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[13px] font-semibold text-[#2A2A2A]">Tracking Reference</span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#DFE6F5] text-[#3F5C9E]">
            Status: {currentRequest.status}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 bg-[#F4F3F1] pl-4 pr-1.5 py-1.5 rounded-full">
          <span className="font-mono font-bold text-sm text-[#2A2A2A] tracking-wider">
            {currentRequest.referenceNumber}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 h-8 px-3 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-[11px] font-semibold transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between gap-3 text-[11px]">
            <span className="text-[#6F6D69]">Claim:</span>
            <span className="font-semibold text-[#2A2A2A] text-right truncate max-w-[200px]">
              "{currentRequest.claimText}"
            </span>
          </div>
          <div className="flex justify-between gap-3 text-[11px]">
            <span className="text-[#6F6D69]">Platform:</span>
            <span className="font-semibold text-[#2A2A2A]">{currentRequest.sourcePlatform}</span>
          </div>
          <div className="flex justify-between gap-3 text-[11px]">
            <span className="text-[#6F6D69]">Submitted:</span>
            <span className="font-semibold text-[#2A2A2A]">{currentRequest.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          type="button"
          onClick={() => viewRequestDetail(currentRequest)}
          className="w-full h-11 flex items-center justify-center gap-2 px-3 bg-[#2A2A2A] hover:bg-black text-white font-semibold rounded-full transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Request Status</span>
        </button>

        <button
          type="button"
          onClick={returnToResults}
          className="w-full h-11 px-3 rounded-full border border-[#2A2A2A]/15 hover:bg-[#E2E4EA] text-[#2A2A2A] font-semibold transition-colors cursor-pointer"
        >
          Back to Verification
        </button>
      </div>
    </div>
  );
};
