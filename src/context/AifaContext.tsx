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
  VerificationRequest,
  PanelDisplayMode,
  AnalysisStep,
  ArticleVerificationResult,
} from '../types/aifa';
import { useBrowser } from './BrowserContext';
import { MOCK_ARTICLES } from '../data/mockArticles';
import { MOCK_VERIFICATION_RESULTS } from '../data/mockVerificationResults';

const AifaContext = createContext<AifaContextType | undefined>(undefined);

export const AifaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLocation, activeTabId, displayUrl, refreshNonce } = useBrowser();
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [isArticleHovered, setIsArticleHoveredState] = useState(false);
  const [isButtonHovered, setIsButtonHoveredState] = useState(false);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);

  // Stage 3: Verification Panel & Analysis State
  const [panelMode, setPanelMode] = useState<PanelDisplayMode>('closed');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<AnalysisStep>('extracting');
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeClaimId, setActiveClaimId] = useState<string | null>(null);
  const [expandedClaimIds, setExpandedClaimIds] = useState<string[]>([]);
  const [completedResults, setCompletedResults] = useState<Record<string, ArticleVerificationResult>>({});

  const hoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Automatically detect article when route is an article detail page
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

  // Current verification result for detected article
  const verificationResult = useMemo(() => {
    if (!detectedArticle) return null;
    return completedResults[detectedArticle.id] || null;
  }, [detectedArticle, completedResults]);

  // Clear timers helper
  const clearAnalysisTimers = useCallback(() => {
    analysisTimersRef.current.forEach((t) => clearTimeout(t));
    analysisTimersRef.current = [];
  }, []);

  // Reset hover & analysis states when changing pages, tabs, or refreshing
  useEffect(() => {
    if (hoverExitTimeoutRef.current) {
      clearTimeout(hoverExitTimeoutRef.current);
      hoverExitTimeoutRef.current = null;
    }
    clearAnalysisTimers();

    setIsArticleHoveredState(false);
    setIsButtonHoveredState(false);
    setIsAnalyzing(false);
    setAnalysisStep('extracting');
    setAnalysisProgress(0);
    setActiveClaimId(null);
    setExpandedClaimIds([]);

    // Check if this article was already verified in this session
    if (!detectedArticle) {
      setPanelMode('closed');
      setVerificationRequest(null);
    } else {
      const existing = completedResults[detectedArticle.id];
      if (!existing) {
        setPanelMode('closed');
        setVerificationRequest(null);
      }
    }
  }, [currentLocation.pathname, activeTabId, refreshNonce, detectedArticle, completedResults, clearAnalysisTimers]);

  // Exit delay handler to prevent hover flicker
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

  // Simulated AI Verification Sequence (Stages 1 to 4)
  const startAnalysisSequence = useCallback(
    (articleId: string) => {
      clearAnalysisTimers();
      setIsAnalyzing(true);
      setAnalysisStep('extracting');
      setAnalysisProgress(20);

      // Step 2: Identifying Claims (~1.0s)
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

        const mockResult = MOCK_VERIFICATION_RESULTS[articleId] || MOCK_VERIFICATION_RESULTS['art-rm500-claim'];
        setCompletedResults((prev) => ({
          ...prev,
          [articleId]: mockResult,
        }));

        setIsAnalyzing(false);
        // Expand first claim by default
        if (mockResult.claims.length > 0) {
          setExpandedClaimIds([mockResult.claims[0].id]);
          setActiveClaimId(mockResult.claims[0].id);
        }
      }, 3500);

      analysisTimersRef.current = [t1, t2, t3];
    },
    [clearAnalysisTimers]
  );

  const triggerVerification = useCallback(() => {
    if (!detectedArticle) return;

    setVerificationRequest({
      articleId: detectedArticle.id,
      title: detectedArticle.title,
      sourceUrl: detectedArticle.sourceUrl,
      summary: detectedArticle.summary,
      bodyText: detectedArticle.bodyText,
      status: 'requested',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });

    setPanelMode('expanded');

    // If already verified, do not re-run full simulation unless explicitly re-triggered
    if (!completedResults[detectedArticle.id]) {
      startAnalysisSequence(detectedArticle.id);
    } else {
      const existing = completedResults[detectedArticle.id];
      if (existing.claims.length > 0) {
        setExpandedClaimIds([existing.claims[0].id]);
        setActiveClaimId(existing.claims[0].id);
      }
    }
  }, [detectedArticle, completedResults, startAnalysisSequence]);

  const resetVerification = useCallback(() => {
    clearAnalysisTimers();
    setIsAnalyzing(false);
    setVerificationRequest(null);
    setPanelMode('closed');
    setActiveClaimId(null);
    setExpandedClaimIds([]);
  }, [clearAnalysisTimers]);

  // Panel display toggles
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
  }, [clearAnalysisTimers]);

  // Claim Accordion toggle
  const toggleClaimExpanded = useCallback((claimId: string) => {
    setExpandedClaimIds((prev) =>
      prev.includes(claimId) ? prev.filter((id) => id !== claimId) : [...prev, claimId]
    );
  }, []);

  // Synchronised Locate in Article
  const locateClaimInArticle = useCallback(
    (claimId: string) => {
      setActiveClaimId(claimId);
      // Ensure the claim is expanded in the panel
      setExpandedClaimIds((prev) => (prev.includes(claimId) ? prev : [...prev, claimId]));

      // Scroll article text segment into view
      setTimeout(() => {
        const claimElement = document.querySelector(`[data-aifa-claim-id="${claimId}"]`);
        if (claimElement) {
          claimElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          // Fallback to paragraph if sentence anchor is not direct
          const activeResult = detectedArticle ? completedResults[detectedArticle.id] : null;
          const claim = activeResult?.claims.find((c) => c.id === claimId);
          if (claim) {
            const pElem = document.getElementById(claim.paragraphId);
            if (pElem) {
              pElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        }
      }, 50);
    },
    [detectedArticle, completedResults]
  );

  const isHighlighted =
    (isArticleHovered || isButtonHovered || verificationRequest !== null) && detectedArticle !== null;

  const value = useMemo(
    () => ({
      isExtensionEnabled,
      toggleExtension,
      detectedArticle,
      isArticleHovered,
      setIsArticleHovered,
      isButtonHovered,
      setIsButtonHovered,
      isHighlighted,
      verificationRequest,
      triggerVerification,
      resetVerification,
      panelMode,
      openPanel,
      minimizePanel,
      restorePanel,
      closePanel,
      isAnalyzing,
      analysisStep,
      analysisProgress,
      verificationResult,
      activeClaimId,
      setActiveClaimId,
      expandedClaimIds,
      toggleClaimExpanded,
      locateClaimInArticle,
    }),
    [
      isExtensionEnabled,
      toggleExtension,
      detectedArticle,
      isArticleHovered,
      setIsArticleHovered,
      isButtonHovered,
      setIsButtonHovered,
      isHighlighted,
      verificationRequest,
      triggerVerification,
      resetVerification,
      panelMode,
      openPanel,
      minimizePanel,
      restorePanel,
      closePanel,
      isAnalyzing,
      analysisStep,
      analysisProgress,
      verificationResult,
      activeClaimId,
      expandedClaimIds,
      toggleClaimExpanded,
      locateClaimInArticle,
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
