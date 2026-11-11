import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import {
  AifaContextType,
  DetectedArticleInfo,
  PanelDisplayMode,
  PanelActiveView,
  AnalysisStep,
  VerificationResult,
  ClaimAnalysis,
} from '../types/aifa';
import { SocialPost, FactCheckRequest, OcrBoundingBox } from '../types/social';
import { useBrowser } from './BrowserContext';
import { MOCK_ARTICLES } from '../data/mockArticles';
import { MOCK_VERIFICATION_RESULTS } from '../data/mockVerificationResults';
import {
  MOCK_CONNECT_POSTS,
  MOCK_PULSE_POSTS,
  MOCK_SOCIAL_VERIFICATIONS,
} from '../data/mockSocialPosts';

const AifaContext = createContext<AifaContextType | undefined>(undefined);

export const AifaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLocation, activeTabId, displayUrl, refreshNonce } = useBrowser();
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);

  // Article detection
  const [isArticleHovered, setIsArticleHoveredState] = useState(false);
  const [isButtonHovered, setIsButtonHoveredState] = useState(false);

  // Social post detection (Stage 4)
  const [activeHoveredPostId, setActiveHoveredPostIdState] = useState<string | null>(null);
  const [activeVerifiedPost, setActiveVerifiedPost] = useState<SocialPost | null>(null);

  // Panel state
  const [panelMode, setPanelMode] = useState<PanelDisplayMode>('closed');
  const [panelView, setPanelView] = useState<PanelActiveView>('results');

  // Simulated AI analysis sequence
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('extracting');
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Claims & Highlighting
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [expandedClaimIds, setExpandedClaimIds] = useState<string[]>([]);
  const [activeImageHighlightBox, setActiveImageHighlightBox] = useState<OcrBoundingBox | null>(null);
  const [completedResults, setCompletedResults] = useState<Record<string, VerificationResult>>({
    ...MOCK_VERIFICATION_RESULTS,
    ...MOCK_SOCIAL_VERIFICATIONS,
  });

  // Request Fact-Check Workflow (Stage 4)
  const [activeFactCheckClaim, setActiveFactCheckClaim] = useState<ClaimAnalysis | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<FactCheckRequest | null>(null);
  const [submittedRequests, setSubmittedRequests] = useState<FactCheckRequest[]>([]);

  const hoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postHoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Automatically detect news article when on an article detail route
  const detectedArticle = useMemo<DetectedArticleInfo | null>(() => {
    if (!isExtensionEnabled) return null;

    if (currentLocation.pathname.startsWith('/articles/')) {
      const slug = currentLocation.pathname.replace('/articles/', '');
      const article =
        MOCK_ARTICLES.find((a) => a.slug === slug || a.id === currentLocation.articleId) ||
        MOCK_ARTICLES[0];

      if (article) {
        const bodyText = article.paragraphs
          .filter((p) => p.type === 'paragraph')
          .map((p) => p.text)
          .join('\n\n');

        return {
          id: article.id,
          slug: article.slug,
          title: article.headline,
          category: article.category,
          author: article.author.name,
          summary: article.summary,
          bodyText,
          sourceUrl: displayUrl,
        };
      }
    }
    return null;
  }, [currentLocation.pathname, currentLocation.articleId, isExtensionEnabled, displayUrl]);

  // Detected social post when on a social feed
  const detectedSocialPost = useMemo<SocialPost | null>(() => {
    if (!isExtensionEnabled) return null;
    if (activeHoveredPostId) {
      const allPosts = [...MOCK_CONNECT_POSTS, ...MOCK_PULSE_POSTS];
      return allPosts.find((p) => p.id === activeHoveredPostId) || null;
    }
    return activeVerifiedPost;
  }, [isExtensionEnabled, activeHoveredPostId, activeVerifiedPost]);

  // Active verification result (either article or social post)
  const verificationResult = useMemo(() => {
    if (activeVerifiedPost) {
      return completedResults[activeVerifiedPost.id] || null;
    }
    if (detectedArticle) {
      return completedResults[detectedArticle.id] || null;
    }
    return null;
  }, [activeVerifiedPost, detectedArticle, completedResults]);

  // Clear timers helper
  const clearAnalysisTimers = useCallback(() => {
    analysisTimersRef.current.forEach((t) => clearTimeout(t));
    analysisTimersRef.current = [];
  }, []);

  // Reset transient hover/analysis states on page/tab change
  useEffect(() => {
    if (hoverExitTimeoutRef.current) {
      clearTimeout(hoverExitTimeoutRef.current);
      hoverExitTimeoutRef.current = null;
    }
    if (postHoverExitTimeoutRef.current) {
      clearTimeout(postHoverExitTimeoutRef.current);
      postHoverExitTimeoutRef.current = null;
    }
    clearAnalysisTimers();

    setIsArticleHoveredState(false);
    setIsButtonHoveredState(false);
    setActiveHoveredPostIdState(null);
    setActiveVerifiedPost(null);
    setIsAnalyzing(false);
    setAnalysisStep('extracting');
    setAnalysisProgress(0);
    setActiveClaimId(null);
    setActiveImageHighlightBox(null);
    setExpandedClaimIds([]);
    setPanelMode('closed');
    setPanelView('results');
    setActiveFactCheckClaim(null);
  }, [currentLocation.pathname, activeTabId, refreshNonce, clearAnalysisTimers]);

  // Article hover exit debouncer
  const setIsArticleHovered = useCallback((hovered: boolean) => {
    if (hovered) {
      if (hoverExitTimeoutRef.current) {
        clearTimeout(hoverExitTimeoutRef.current);
        hoverExitTimeoutRef.current = null;
      }
      setIsArticleHoveredState(true);
    } else {
      if (hoverExitTimeoutRef.current) {
        clearTimeout(hoverExitTimeoutRef.current);
      }
      hoverExitTimeoutRef.current = setTimeout(() => {
        setIsArticleHoveredState(false);
      }, 250);
    }
  }, []);

  // Social post hover exit debouncer
  const setActiveHoveredPostId = useCallback((postId: string | null) => {
    if (postId) {
      if (postHoverExitTimeoutRef.current) {
        clearTimeout(postHoverExitTimeoutRef.current);
        postHoverExitTimeoutRef.current = null;
      }
      setActiveHoveredPostIdState(postId);
    } else {
      if (postHoverExitTimeoutRef.current) {
        clearTimeout(postHoverExitTimeoutRef.current);
      }
      postHoverExitTimeoutRef.current = setTimeout(() => {
        setActiveHoveredPostIdState(null);
      }, 250);
    }
  }, []);

  const setIsButtonHovered = useCallback((hovered: boolean) => {
    if (hovered) {
      if (hoverExitTimeoutRef.current) {
        clearTimeout(hoverExitTimeoutRef.current);
        hoverExitTimeoutRef.current = null;
      }
      setIsButtonHoveredState(true);
    } else {
      if (hoverExitTimeoutRef.current) {
        clearTimeout(hoverExitTimeoutRef.current);
      }
      hoverExitTimeoutRef.current = setTimeout(() => {
        setIsButtonHoveredState(false);
      }, 250);
    }
  }, []);

  const toggleExtension = useCallback(() => {
    setIsExtensionEnabled((prev) => !prev);
  }, []);

  // Trigger verification sequence for news article or social post
  const triggerVerification = useCallback(
    (socialPost?: SocialPost) => {
      const targetPost = socialPost || detectedSocialPost;
      clearAnalysisTimers();
      setPanelMode('expanded');
      setPanelView('results');
      setIsAnalyzing(true);
      setAnalysisStep('extracting');
      setAnalysisProgress(20);

      const contentId = targetPost ? targetPost.id : detectedArticle ? detectedArticle.id : 'art-rm500-claim';

      if (targetPost) {
        setActiveVerifiedPost(targetPost);
      }

      // Step 2: Identifying Claims / OCR extraction (~1.0s)
      const t1 = setTimeout(() => {
        setAnalysisStep('identifying');
        setAnalysisProgress(50);
      }, 1000);

      // Step 3: Reviewing Evidence (~2.2s)
      const t2 = setTimeout(() => {
        setAnalysisStep('reviewing');
        setAnalysisProgress(80);
      }, 2200);

      // Step 4: Analysis Complete (~3.5s)
      const t3 = setTimeout(() => {
        setAnalysisStep('complete');
        setAnalysisProgress(100);

        const mockResult =
          MOCK_SOCIAL_VERIFICATIONS[contentId] ||
          MOCK_VERIFICATION_RESULTS[contentId] ||
          MOCK_VERIFICATION_RESULTS['art-rm500-claim'];

        setCompletedResults((prev) => ({
          ...prev,
          [contentId]: mockResult,
        }));

        setIsAnalyzing(false);
        if (mockResult.claims.length > 0) {
          setExpandedClaimIds([mockResult.claims[0].id]);
          setActiveClaimId(mockResult.claims[0].id);

          // If first claim is an image claim, set active highlight box
          if (mockResult.claims[0].imageBoundingBoxId && targetPost?.imageOcr) {
            const box = targetPost.imageOcr.boundingBoxes.find(
              (b) => b.id === mockResult.claims[0].imageBoundingBoxId
            );
            if (box) setActiveImageHighlightBox(box);
          }
        }
      }, 3500);

      analysisTimersRef.current = [t1, t2, t3];
    },
    [clearAnalysisTimers, detectedSocialPost, detectedArticle]
  );

  const resetVerification = useCallback(() => {
    clearAnalysisTimers();
    setIsAnalyzing(false);
    setPanelMode('closed');
    setActiveClaimId(null);
    setActiveImageHighlightBox(null);
    setExpandedClaimIds([]);
    setActiveVerifiedPost(null);
    setPanelView('results');
    setActiveFactCheckClaim(null);
  }, [clearAnalysisTimers]);

  const openPanel = useCallback(() => {
    setPanelMode('expanded');
  }, []);

  const minimizePanel = useCallback(() => {
    setPanelMode('minimized');
  }, []);

  const restorePanel = useCallback(() => {
    setPanelMode('expanded');
  }, []);

  const closePanel = useCallback(() => {
    clearAnalysisTimers();
    setIsAnalyzing(false);
    setPanelMode('closed');
    setActiveClaimId(null);
    setActiveImageHighlightBox(null);
  }, [clearAnalysisTimers]);

  const toggleClaimExpanded = useCallback((claimId: string) => {
    setExpandedClaimIds((prev) =>
      prev.includes(claimId) ? prev.filter((id) => id !== claimId) : [...prev, claimId]
    );
  }, []);

  // Synchronised Locate in Article
  const locateClaimInArticle = useCallback((claimId: string) => {
    setActiveClaimId(claimId);
    setExpandedClaimIds((prev) => (prev.includes(claimId) ? prev : [...prev, claimId]));

    setTimeout(() => {
      const claimElement = document.querySelector(`[data-aifa-claim-id="${claimId}"]`);
      if (claimElement) {
        claimElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 50);
  }, []);

  // Synchronised Locate in Social Post (Caption or Image OCR region)
  const locateClaimInSocialPost = useCallback(
    (claimId: string, locationPreference?: 'caption' | 'image') => {
      setActiveClaimId(claimId);
      setExpandedClaimIds((prev) => (prev.includes(claimId) ? prev : [...prev, claimId]));

      const activeResult = verificationResult;
      const claim = activeResult?.claims.find((c) => c.id === claimId);

      if (!claim) return;

      const postElement = document.getElementById(claim.postId || '');
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Handle image OCR box highlight
      if (locationPreference === 'image' || claim.locationType === 'image') {
        const allPosts = [...MOCK_CONNECT_POSTS, ...MOCK_PULSE_POSTS];
        const post = allPosts.find((p) => p.id === claim.postId);
        if (post?.imageOcr) {
          const targetBox = post.imageOcr.boundingBoxes.find(
            (b) => b.id === claim.imageBoundingBoxId || b.claimId === claimId
          );
          if (targetBox) {
            setActiveImageHighlightBox(targetBox);
          }
        }
      } else {
        setActiveImageHighlightBox(null);
      }
    },
    [verificationResult]
  );

  // Request Fact-Check Workflow
  const openFactCheckForm = useCallback((claim: ClaimAnalysis) => {
    setActiveFactCheckClaim(claim);
    setPanelView('request_form');
    setPanelMode('expanded');
  }, []);

  const submitFactCheckRequest = useCallback(
    (notes: string, includeSupporting: boolean) => {
      if (!activeFactCheckClaim || !verificationResult) return;

      setIsSubmittingRequest(true);

      setTimeout(() => {
        const nextNumber = submittedRequests.length + 1;
        const refNumber = `AIFA-DEMO-${String(nextNumber).padStart(3, '0')}`;

        const newRequest: FactCheckRequest = {
          id: `req-${Date.now()}`,
          referenceNumber: refNumber,
          claimId: activeFactCheckClaim.id,
          claimText: activeFactCheckClaim.statement,
          articleOrPostId: verificationResult.contentId,
          title: verificationResult.headline,
          sourceUrl: verificationResult.sourceWebsite,
          sourcePlatform: verificationResult.platformName,
          additionalNotes: notes,
          includeSupportingContent: includeSupporting,
          supportingContentSummary: `${verificationResult.summary} (Caption + Image OCR analyzed)`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          status: 'Submitted',
          lastUpdated: 'Just now',
        };

        setSubmittedRequests((prev) => [newRequest, ...prev]);
        setCurrentRequest(newRequest);
        setIsSubmittingRequest(false);
        setPanelView('request_confirmation');
      }, 900);
    },
    [activeFactCheckClaim, verificationResult, submittedRequests.length]
  );

  const viewRequestDetail = useCallback((req: FactCheckRequest) => {
    setCurrentRequest(req);
    setPanelView('request_detail');
  }, []);

  const returnToResults = useCallback(() => {
    setPanelView('results');
  }, []);

  const isHighlighted =
    (isArticleHovered || isButtonHovered || activeHoveredPostId !== null) &&
    (detectedArticle !== null || detectedSocialPost !== null);

  const value = useMemo(
    () => ({
      isExtensionEnabled,
      toggleExtension,
      detectedArticle,
      detectedSocialPost,
      activeHoveredPostId,
      setActiveHoveredPostId,
      isArticleHovered,
      setIsArticleHovered,
      isButtonHovered,
      setIsButtonHovered,
      isHighlighted,
      triggerVerification,
      resetVerification,
      panelMode,
      openPanel,
      minimizePanel,
      restorePanel,
      closePanel,
      panelView,
      setPanelView,
      isAnalyzing,
      analysisStep,
      analysisProgress,
      verificationResult,
      activeClaimId,
      setActiveClaimId,
      expandedClaimIds,
      toggleClaimExpanded,
      activeImageHighlightBox,
      locateClaimInArticle,
      locateClaimInSocialPost,
      activeFactCheckClaim,
      openFactCheckForm,
      submitFactCheckRequest,
      isSubmittingRequest,
      currentRequest,
      submittedRequests,
      viewRequestDetail,
      returnToResults,
    }),
    [
      isExtensionEnabled,
      toggleExtension,
      detectedArticle,
      detectedSocialPost,
      activeHoveredPostId,
      setActiveHoveredPostId,
      isArticleHovered,
      setIsArticleHovered,
      isButtonHovered,
      setIsButtonHovered,
      isHighlighted,
      triggerVerification,
      resetVerification,
      panelMode,
      openPanel,
      minimizePanel,
      restorePanel,
      closePanel,
      panelView,
      isAnalyzing,
      analysisStep,
      analysisProgress,
      verificationResult,
      activeClaimId,
      expandedClaimIds,
      toggleClaimExpanded,
      activeImageHighlightBox,
      locateClaimInArticle,
      locateClaimInSocialPost,
      activeFactCheckClaim,
      openFactCheckForm,
      submitFactCheckRequest,
      isSubmittingRequest,
      currentRequest,
      submittedRequests,
      viewRequestDetail,
      returnToResults,
    ]
  );

  return <AifaContext.Provider value={value}>{children}</AifaContext.Provider>;
};

export const useAifa = () => {
  const context = useContext(AifaContext);
  if (!context) {
    throw new Error('useAifa must be used within an AifaProvider');
  }
  return context;
};
