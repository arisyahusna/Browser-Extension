import React, { useEffect } from 'react';
import {
  ShieldCheck,
  X,
  Minus,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  XCircle,
  Clock,
  Globe,
  Info,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { AIFAClaimCard } from './AIFAClaimCard';
import { AIFASimulatedAnalysis } from './AIFASimulatedAnalysis';
import { OverallAssessment } from '../../types/aifa';

export const AIFAVerificationPanel: React.FC = () => {
  const {
    panelMode,
    closePanel,
    minimizePanel,
    isAnalyzing,
    verificationResult,
    activeClaimId,
    expandedClaimIds,
    toggleClaimExpanded,
    locateClaimInArticle,
  } = useAifa();

  // Handle Escape key to minimize or close
  useEffect(() => {
    if (panelMode !== 'expanded') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        minimizePanel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panelMode, minimizePanel]);

  if (panelMode !== 'expanded') return null;

  const renderOverallAssessmentBadge = (assessment: OverallAssessment, label: string) => {
    switch (assessment) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
            {label}
          </span>
        );
      case 'false':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-700" />
            {label}
          </span>
        );
      case 'misleading':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
            {label}
          </span>
        );
      case 'mixed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
            <AlertTriangle className="w-3.5 h-3.5 text-purple-700" />
            {label}
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
            <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
            {label}
          </span>
        );
    }
  };

  return (
    <aside
      aria-label="AIFA Fact-Checking Verification Panel"
      className="w-[420px] shrink-0 h-full bg-white border-l border-slate-200/90 shadow-2xl flex flex-col z-30 select-text overflow-hidden animate-in slide-in-from-right duration-200"
    >
      {/* Sticky Panel Header */}
      <div className="bg-[#FAFBFD] px-4 py-3 border-b border-slate-200 sticky top-0 z-20 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-[#D93043] shadow-xs">
            <ShieldCheck className="w-4.5 h-4.5" strokeWidth={2.4} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-[#171B26] tracking-tight">AIFA</h2>
              <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-200/70 text-slate-700">
                Sebenarnya.my
              </span>
            </div>
            <p className="text-[10px] text-[#667085] leading-none mt-0.5">
              Fact-Checking Assistant
            </p>
          </div>
        </div>

        {/* Window action buttons: Minimise & Close */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={minimizePanel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Minimise verification panel"
            aria-label="Minimise panel"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={closePanel}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            title="Close verification panel"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel Content Area (Scrolls independently) */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-6">
        {isAnalyzing ? (
          <AIFASimulatedAnalysis />
        ) : verificationResult ? (
          <>
            {/* Article Information Card */}
            <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {verificationResult.sourceWebsite}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {verificationResult.publishedAt}
                </span>
              </div>

              <h3 className="font-serif text-sm font-bold text-slate-900 leading-snug">
                {verificationResult.headline}
              </h3>

              <div className="pt-1 text-[11px] text-slate-500 border-t border-slate-200/60 flex items-center justify-between">
                <span>Verified: {verificationResult.verifiedAt}</span>
                <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded">
                  AIFA v1.0 Mockup
                </span>
              </div>
            </div>

            {/* Overall Assessment Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Overall Assessment
                </h4>
                {renderOverallAssessmentBadge(
                  verificationResult.overallAssessment,
                  verificationResult.overallLabel
                )}
              </div>

              <div className="rounded-xl p-4 bg-slate-50 border border-slate-200/80 text-xs space-y-2 leading-relaxed">
                <p className="text-slate-700 font-medium">
                  {verificationResult.assessmentExplanation}
                </p>
                <div className="pt-2 border-t border-slate-200 text-slate-600">
                  <span className="font-semibold text-slate-800">Article Summary: </span>
                  {verificationResult.summary}
                </div>
              </div>
            </div>

            {/* Claims Identified Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Claims Identified ({verificationResult.claims.length})
                </h4>
                <span className="text-[10.5px] text-slate-400">Click to locate in article</span>
              </div>

              <div className="space-y-3">
                {verificationResult.claims.map((claim) => (
                  <AIFAClaimCard
                    key={claim.id}
                    claim={claim}
                    isExpanded={expandedClaimIds.includes(claim.id)}
                    isActive={activeClaimId === claim.id}
                    onToggle={() => toggleClaimExpanded(claim.id)}
                    onLocate={() => locateClaimInArticle(claim.id)}
                  />
                ))}
              </div>
            </div>

            {/* Demo Notice Disclaimer Footer */}
            <div className="rounded-lg bg-amber-50/70 border border-amber-200/80 p-3 text-[11px] text-amber-900 flex items-start gap-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                {verificationResult.demoNotice}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
};
