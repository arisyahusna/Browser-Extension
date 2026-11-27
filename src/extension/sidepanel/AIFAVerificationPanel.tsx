import React, { useEffect } from 'react';
import { ShieldCheck, X, Minus, Clock, Globe, Info, Send, ArrowLeft } from 'lucide-react';
import { Alert, Badge, Button, Card, Icon, IconButton } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';
import { AIFAClaimCard } from './AIFAClaimCard';
import { AIFASimulatedAnalysis } from './AIFASimulatedAnalysis';
import { AIFAFactCheckRequestForm } from './AIFAFactCheckRequestForm';
import { AIFAFactCheckConfirmation } from './AIFAFactCheckConfirmation';
import { AIFAFactCheckDetail } from './AIFAFactCheckDetail';
import { AssessmentLabel } from '../shared/AssessmentLabel';
import { ExtensionSurface } from '../shared/ExtensionSurface';

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

  const isSocialPost = verificationResult?.contentType === 'social-post';

  return (
    <ExtensionSurface density="compact">
      <aside
        aria-label="AIFA Fact-Checking Verification Panel"
        className="aifa-sidepanel-frame shrink-0 h-full bg-muted border-l border-border shadow-overlay flex flex-col z-floating select-text overflow-hidden font-sans text-body-sm text-foreground"
      >
        {/* Sticky Panel Header */}
        <div className="px-20 pt-16 pb-12 sticky top-0 z-2 flex items-center justify-between gap-inline select-none">
          <div className="flex items-center gap-inline">
            <IconButton
              icon={ArrowLeft}
              size="icon-sm"
              onClick={handleBack}
              title={isSubView ? 'Back to results' : 'Back to AIFA popup'}
              label={isSubView ? 'Back to results' : 'Back to AIFA popup'}
            />
            <img
              src={`${import.meta.env.BASE_URL}images/sebenarnya-icon.png`}
              alt=""
              className="size-avatar-sm object-contain"
              draggable={false}
            />
            <div>
              <div className="flex items-center gap-6">
                <h2 className="text-label text-foreground">AIFA</h2>
                <Badge size="sm" variant="outline" className="self-center">
                  Sebenarnya.my
                </Badge>
              </div>
              <p className="text-caption text-muted-foreground">
                {isSocialPost ? 'Social Media Verification' : 'Fact-Checking Assistant'}
              </p>
            </div>
          </div>

          {/* Window action buttons: Minimise & Close */}
          <div className="flex items-center gap-inline">
            <IconButton
              icon={Minus}
              size="icon-sm"
              onClick={minimizePanel}
              title="Minimise verification panel"
              label="Minimise panel"
            />
            <IconButton icon={X} size="icon-sm" onClick={closePanel} title="Close verification panel" label="Close panel" />
          </div>
        </div>

        {/* Main Panel Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-16 pt-4 pb-20 flex flex-col gap-block">
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
              <Card variant="raised" className="flex flex-col gap-text">
                <div className="flex items-center justify-between gap-inline text-caption text-muted-foreground">
                  <span className="flex items-center gap-4 text-text-secondary">
                    <Icon icon={Globe} size="sm" />
                    {verificationResult.platformName}
                  </span>
                  <span className="flex items-center gap-4">
                    <Icon icon={Clock} size="sm" />
                    {verificationResult.publishedAt}
                  </span>
                </div>

                <h3 className="text-title text-foreground">{verificationResult.headline}</h3>

                <div className="text-caption text-muted-foreground">
                  <span>Author: </span>
                  <span className="text-foreground">{verificationResult.authorName}</span>
                </div>

                <div className="pt-8 border-t border-border flex items-center justify-between gap-inline text-caption text-muted-foreground">
                  <span>Verified: {verificationResult.verifiedAt}</span>
                  <Badge size="sm" className="self-center">AIFA Stage 4</Badge>
                </div>
              </Card>

              {/* Post caption analysed (social media) */}
              {isSocialPost && verificationResult.captionText && (
                <Card variant="raised" size="sm" className="flex flex-col gap-4">
                  <span className="text-caption text-muted-foreground">Post Caption Text:</span>
                  <p className="text-body-sm text-foreground italic">"{verificationResult.captionText}"</p>
                </Card>
              )}

              {/* Overall Assessment Section */}
              <section className="flex flex-col gap-text">
                <div className="flex items-center justify-between gap-inline px-4">
                  <h4 className="text-label text-foreground">Overall Assessment</h4>
                  <AssessmentLabel
                    assessment={verificationResult.overallAssessment}
                    label={verificationResult.overallLabel}
                  />
                </div>

                <Card variant="raised" className="flex flex-col gap-text">
                  <p className="text-body-sm font-medium text-foreground">{verificationResult.assessmentExplanation}</p>
                  <div className="pt-8 border-t border-border text-body-sm text-text-secondary">
                    <span className="font-medium text-foreground">Verification Summary: </span>
                    {verificationResult.summary}
                  </div>
                </Card>
              </section>

              {/* Claims Identified Section */}
              <section className="flex flex-col gap-text">
                <div className="flex items-center justify-between gap-inline px-4">
                  <h4 className="text-label text-foreground">Claims Identified ({verificationResult.claims.length})</h4>
                  <span className="text-caption text-muted-foreground">
                    {isSocialPost ? 'Click to locate in post' : 'Click to locate in article'}
                  </span>
                </div>

                <div className="flex flex-col gap-8">
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
              </section>

              {/* Global Request Fact-Check Banner for Unverified Overall Status */}
              {verificationResult.overallAssessment === 'unverified' && (
                <Card variant="outline" className="flex flex-col gap-text select-none">
                  <div className="flex items-center justify-between gap-inline">
                    <div className="flex items-center gap-inline">
                      <Icon icon={ShieldCheck} />
                      <span className="text-label-sm text-foreground">Need Official Clarification?</span>
                    </div>
                    <Badge size="sm" variant="outline" className="self-center">
                      Citizen Request
                    </Badge>
                  </div>
                  <p className="text-caption text-text-secondary">
                    Submit this unverified story or post to Sebenarnya.my. Verified findings will be published on the national portal.
                  </p>
                  <Button
                    icon={Send}
                    className="w-full"
                    onClick={() => {
                      const firstUnverified =
                        verificationResult.claims.find((c) => c.verdict === 'unverified') ||
                        verificationResult.claims[0];
                      if (firstUnverified) {
                        openFactCheckForm(firstUnverified);
                      }
                    }}
                  >
                    Request Fact-Check with Sebenarnya.my
                  </Button>
                </Card>
              )}

              {/* Demo Notice Disclaimer Footer */}
              <Alert icon={Info}>{verificationResult.demoNotice}</Alert>
            </>
          ) : null}
        </div>
      </aside>
    </ExtensionSurface>
  );
};
