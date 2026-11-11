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
    <div className="p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200 text-xs">
      {/* Success Badge Banner */}
      <div className="text-center space-y-2 pt-2">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
        </div>
        <h3 className="font-serif text-lg font-bold text-slate-900 leading-snug">
          Fact-Check Request Submitted
        </h3>
        <p className="text-slate-500 text-[11px] max-w-xs mx-auto leading-relaxed">
          Your request has been recorded in this demonstration. No real submission has been made.
        </p>
      </div>

      {/* Reference Code Card */}
      <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/90 p-4 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Tracking Reference
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            Status: {currentRequest.status}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200">
          <span className="font-mono font-bold text-sm text-slate-900 tracking-wider">
            {currentRequest.referenceNumber}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-700">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-500" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="space-y-1.5 pt-1 text-slate-600">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Claim:</span>
            <span className="font-medium text-slate-800 text-right truncate max-w-[200px]">
              "{currentRequest.claimText}"
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Platform:</span>
            <span className="font-medium text-slate-800">{currentRequest.sourcePlatform}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-400">Submitted:</span>
            <span className="font-medium text-slate-800">{currentRequest.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2">
        <button
          type="button"
          onClick={() => viewRequestDetail(currentRequest)}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Request Status</span>
        </button>

        <button
          type="button"
          onClick={returnToResults}
          className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium transition-colors cursor-pointer"
        >
          Back to Verification
        </button>
      </div>
    </div>
  );
};
