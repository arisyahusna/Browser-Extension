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
  Send,
  ArrowLeft,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';
import { AIFAClaimCard } from './AIFAClaimCard';
import { AIFASimulatedAnalysis } from './AIFASimulatedAnalysis';
import { AIFAFactCheckRequestForm } from './AIFAFactCheckRequestForm';
import { AIFAFactCheckConfirmation } from './AIFAFactCheckConfirmation';
import { AIFAFactCheckDetail } from './AIFAFactCheckDetail';
import { OverallAssessment } from '../../types/aifa';

const roundIconButton =
  'w-8 h-8 rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] flex items-center justify-center hover:bg-[#E2E4EA] transition-colors cursor-pointer';

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
    returnToResults,
  } = useAifa();
  const { setAifaPopupOpen } = useBrowser();

  // Sub-screens (request form, confirmation, detail) step back to the results first;
  // from the results, back closes the panel and reopens the toolbar popup it came from.
  const isSubView = !isAnalyzing && panelView !== 'results';
  const handleBack = () => {
    if (isSubView) {
      returnToResults();
      return;
    }
    closePanel();
    setAifaPopupOpen(true);
  };

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
    const base = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold';
    switch (assessment) {
      case 'supported':
        return (
          <span className={`${base} bg-[#DFE6F5] text-[#3F5C9E]`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      case 'false':
        return (
          <span className={`${base} bg-[#F7DEDB] text-[#9B3D36]`}>
            <XCircle className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      case 'misleading':
        return (
          <span className={`${base} bg-[#F4EBCB] text-[#715C1C]`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      case 'mixed':
        return (
          <span className={`${base} bg-[#ECE6F3] text-[#5B4580]`}>
            <AlertTriangle className="w-3.5 h-3.5" />
            {label}
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className={`${base} bg-[#E2E4EA] text-[#5C5A56]`}>
            <HelpCircle className="w-3.5 h-3.5" />
            {label}
          </span>
        );
    }
  };

  const isSocialPost = verificationResult?.contentType === 'social-post';

  return (
    <aside
      aria-label="AIFA Fact-Checking Verification Panel"
      className="w-[420px] shrink-0 h-full bg-[#EEEFF3] border-l border-[#E0DED9] shadow-[-24px_0_48px_-24px_rgba(42,42,42,0.25)] flex flex-col z-30 select-text overflow-hidden text-[#2A2A2A] font-['Montserrat',sans-serif] antialiased animate-in slide-in-from-right duration-200"
    >
      {/* Sticky Panel Header */}
      <div className="px-5 pt-4 pb-3 sticky top-0 z-20 flex items-center justify-between select-none">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleBack}
            className={`${roundIconButton} shrink-0`}
            title={isSubView ? 'Back to results' : 'Back to AIFA popup'}
            aria-label={isSubView ? 'Back to results' : 'Back to AIFA popup'}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <img
            src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
            alt=""
            className="w-9 h-9 object-contain"
            draggable={false}
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-[#2A2A2A] tracking-tight">AIFA</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#5C5A56]">
                Sebenarnya.my
              </span>
            </div>
            <p className="text-[11px] text-[#6F6D69] leading-none mt-1">
              {isSocialPost ? 'Social Media Verification' : 'Fact-Checking Assistant'}
            </p>
          </div>
        </div>

        {/* Window action buttons: Minimise & Close */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={minimizePanel}
            className={roundIconButton}
            title="Minimise verification panel"
            aria-label="Minimise panel"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={closePanel}
            className={roundIconButton}
            title="Close verification panel"
            aria-label="Close panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Panel Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pt-1 pb-5 space-y-5">
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
            <div className="rounded-[22px] bg-white p-4 space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-[#6F6D69]">
                <span className="flex items-center gap-1 font-semibold text-[#5C5A56]">
                  <Globe className="w-3.5 h-3.5 text-[#6F6D69]" />
                  {verificationResult.platformName}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#6F6D69]" />
                  {verificationResult.publishedAt}
                </span>
              </div>

              <h3 className="text-[15px] font-bold text-[#2A2A2A] leading-snug tracking-tight">
                {verificationResult.headline}
              </h3>

              <div className="text-[11px] text-[#6F6D69]">
                <span>Author: </span>
                <span className="font-semibold text-[#2A2A2A]">{verificationResult.authorName}</span>
              </div>

              <div className="pt-2.5 text-[11px] text-[#6F6D69] border-t border-[#E0DED9] flex items-center justify-between">
                <span>Verified: {verificationResult.verifiedAt}</span>
                <span className="text-[10px] text-[#A31F30] font-semibold bg-[#FBE4E6] px-2.5 py-1 rounded-full">
                  AIFA Stage 4
                </span>
              </div>
            </div>

            {/* Post caption analysed (social media) */}
            {isSocialPost && verificationResult.captionText && (
              <div className="rounded-[20px] bg-white p-4 space-y-1 text-xs">
                <span className="text-[11px] font-semibold text-[#6F6D69]">Post Caption Text:</span>
                <p className="text-[#2A2A2A] leading-relaxed italic">
                  "{verificationResult.captionText}"
                </p>
              </div>
            )}

            {/* Overall Assessment Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 px-1">
                <h4 className="text-[15px] font-semibold text-[#2A2A2A]">Overall Assessment</h4>
                {renderOverallAssessmentBadge(
                  verificationResult.overallAssessment,
                  verificationResult.overallLabel
                )}
              </div>

              <div className="rounded-[22px] p-4 bg-white text-xs space-y-2.5 leading-relaxed">
                <p className="text-[#2A2A2A] font-medium">
                  {verificationResult.assessmentExplanation}
                </p>
                <div className="pt-2.5 border-t border-[#E0DED9] text-[#5C5A56]">
                  <span className="font-semibold text-[#2A2A2A]">Verification Summary: </span>
                  {verificationResult.summary}
                </div>
              </div>
            </div>

            {/* Claims Identified Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-2 px-1">
                <h4 className="text-[15px] font-semibold text-[#2A2A2A]">
                  Claims Identified ({verificationResult.claims.length})
                </h4>
                <span className="text-[11px] text-[#6F6D69]">
                  {isSocialPost ? 'Click to locate in post' : 'Click to locate in article'}
                </span>
              </div>

              <div className="space-y-2.5">
                {verificationResult.claims.map((claim) => (
                  <AIFAClaimCard
                    key={claim.id}
                    claim={claim}
                    isExpanded={expandedClaimIds.includes(claim.id)}
                    isActive={activeClaimId === claim.id}
                    onToggle={() => toggleClaimExpanded(claim.id)}
                    onLocate={() => {
                      if (isSocialPost) {
                        locateClaimInSocialPost(claim.id);
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
              <div className="rounded-[22px] bg-[#FBE4E6] p-4 space-y-2.5 select-none">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#D93043]" />
                    <span className="font-semibold text-sm text-[#7A1724]">
                      Need Official Clarification?
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#A31F30] bg-white px-2.5 py-1 rounded-full">
                    Citizen Request
                  </span>
                </div>
                <p className="text-[11px] text-[#5C5A56] leading-relaxed">
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
                    className="w-full h-10 flex items-center justify-center gap-2 px-3 bg-[#2A2A2A] hover:bg-black text-white text-xs font-semibold rounded-full transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Request Fact-Check with Sebenarnya.my</span>
                  </button>
                </div>
              </div>
            )}

            {/* Demo Notice Disclaimer Footer */}
            <div className="rounded-[18px] bg-[#F4EBCB] px-4 py-3 text-[11px] text-[#5E4C17] flex items-start gap-2">
              <Info className="w-4 h-4 text-[#715C1C] shrink-0 mt-0.5" />
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
