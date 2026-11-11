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
  Scan,
  Send,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { AIFAClaimCard } from './AIFAClaimCard';
import { AIFASimulatedAnalysis } from './AIFASimulatedAnalysis';
import { AIFAFactCheckRequestForm } from './AIFAFactCheckRequestForm';
import { AIFAFactCheckConfirmation } from './AIFAFactCheckConfirmation';
import { AIFAFactCheckDetail } from './AIFAFactCheckDetail';
import { OverallAssessment } from '../../types/aifa';

export const AIFAVerificationPanel: React.FC = () => {
  const {
    panelMode,
    panelView,
    closePanel,
    minimizePanel,
    isAnalyzing,
    verificationResult,
    activeClaimId,
    expandedClaimIds,
    toggleClaimExpanded,
    locateClaimInArticle,
    locateClaimInSocialPost,
    openFactCheckForm,
  } = useAifa();

  // Handle Escape key to minimize
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

  const isSocialPost = verificationResult?.contentType === 'social-post';

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
              {isSocialPost ? 'Social Media Verification' : 'Fact-Checking Assistant'}
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

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-5 space-y-6">
        {isAnalyzing ? (
          <AIFASimulatedAnalysis />
        ) : panelView === 'request_form' ? (
          <AIFAFactCheckRequestForm />
        ) : panelView === 'request_confirmation' ? (
          <AIFAFactCheckConfirmation />
        ) : panelView === 'request_detail' ? (
          <AIFAFactCheckDetail />
        ) : verificationResult ? (
          <>
            {/* Post or Article Information Card */}
            <div className="rounded-xl bg-[#FAFBFD] border border-slate-200/80 p-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-medium text-slate-600">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  {verificationResult.platformName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {verificationResult.publishedAt}
                </span>
              </div>

              <h3 className="font-serif text-sm font-bold text-slate-900 leading-snug">
                {verificationResult.headline}
              </h3>

              <div className="text-[11px] text-slate-500">
                <span className="text-slate-400">Author: </span>
                <span className="font-medium text-slate-700">{verificationResult.authorName}</span>
              </div>

              <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-200/60 flex items-center justify-between">
                <span>Verified: {verificationResult.verifiedAt}</span>
                <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                  AIFA Stage 4
                </span>
              </div>
            </div>

            {/* Extracted Content Section for Social Media */}
            {isSocialPost && (
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Scan className="w-3.5 h-3.5 text-rose-600" />
                    <span>Extracted Content</span>
                  </h4>
                  {verificationResult.extractedImageText && (
                    <span className="text-[10px] text-slate-500 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                      Image text extracted (demo)
                    </span>
                  )}
                </div>

                {/* Caption Extraction */}
                {verificationResult.captionText && (
                  <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-3 space-y-1 text-xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Post Caption Text:
                    </span>
                    <p className="text-slate-700 leading-relaxed italic">
                      "{verificationResult.captionText}"
                    </p>
                  </div>
                )}

                {/* Image OCR Text Extraction (Only when image text exists) */}
                {verificationResult.extractedImageText && (
                  <div className="rounded-xl bg-amber-50/50 border border-amber-200/80 p-3 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-amber-800 tracking-wider flex items-center gap-1">
                        <Scan className="w-3 h-3 text-amber-600" />
                        <span>Embedded Image Text (OCR):</span>
                      </span>
                      <span className="text-[9px] text-amber-700 font-mono">98% confidence</span>
                    </div>
                    <pre className="font-mono text-[11px] bg-white p-2 rounded border border-amber-200/60 text-slate-800 whitespace-pre-wrap leading-relaxed">
                      {verificationResult.extractedImageText}
                    </pre>
                    {verificationResult.imageOcrNotes && (
                      <p className="text-[10.5px] text-amber-900/80 leading-normal">
                        {verificationResult.imageOcrNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

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
                  <span className="font-semibold text-slate-800">Verification Summary: </span>
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
                <span className="text-[10.5px] text-slate-400">
                  {isSocialPost ? 'Click to locate in post' : 'Click to locate in article'}
                </span>
              </div>

              <div className="space-y-3">
                {verificationResult.claims.map((claim) => (
                  <AIFAClaimCard
                    key={claim.id}
                    claim={claim}
                    isExpanded={expandedClaimIds.includes(claim.id)}
                    isActive={activeClaimId === claim.id}
                    onToggle={() => toggleClaimExpanded(claim.id)}
                    onLocate={() => {
                      if (isSocialPost) {
                        locateClaimInSocialPost(
                          claim.id,
                          claim.locationType === 'image' ? 'image' : 'caption'
                        );
                      } else {
                        locateClaimInArticle(claim.id);
                      }
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Global Request Fact-Check Banner for Unverified Overall Status */}
            {verificationResult.overallAssessment === 'unverified' && (
              <div className="rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200 p-4 space-y-2 select-none">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D93043]" />
                    <span className="font-bold text-xs text-rose-950">
                      Need Official Clarification?
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                    Citizen Request
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Submit this unverified story or post to Sebenarnya.my. Verified findings will be published on the national portal.
                </p>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const firstUnverified =
                        verificationResult.claims.find((c) => c.verdict === 'unverified') ||
                        verificationResult.claims[0];
                      if (firstUnverified) {
                        openFactCheckForm(firstUnverified);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#D93043] hover:bg-[#C02638] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Fact-Check with Sebenarnya.my</span>
                  </button>
                </div>
              </div>
            )}

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
