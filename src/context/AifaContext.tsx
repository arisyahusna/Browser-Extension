import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from 'react';
import { AifaContextType, DetectedArticleInfo, VerificationRequest } from '../types/aifa';
import { useBrowser } from './BrowserContext';
import { MOCK_ARTICLES } from '../data/mockArticles';

const AifaContext = createContext<AifaContextType | undefined>(undefined);

export const AifaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLocation, activeTabId, displayUrl, refreshNonce } = useBrowser();
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);
  const [isArticleHovered, setIsArticleHoveredState] = useState(false);
  const [isButtonHovered, setIsButtonHoveredState] = useState(false);
  const [verificationRequest, setVerificationRequest] = useState<VerificationRequest | null>(null);

  const hoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Reset hover & verification states when changing pages, tabs, or refreshing
  useEffect(() => {
    if (hoverExitTimeoutRef.current) {
      clearTimeout(hoverExitTimeoutRef.current);
      hoverExitTimeoutRef.current = null;
    }
    setIsArticleHoveredState(false);
    setIsButtonHoveredState(false);
    setVerificationRequest(null);
  }, [currentLocation.pathname, activeTabId, refreshNonce]);

  // Rule 2 — Small Exit Delay (250ms) to prevent flickering when moving between article and button
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
  }, [detectedArticle]);

  const resetVerification = useCallback(() => {
    setVerificationRequest(null);
  }, []);

  // Highlight is active whenever article is hovered, button is hovered, or verification has been triggered
  const isHighlighted = (isArticleHovered || isButtonHovered || verificationRequest !== null) && detectedArticle !== null;

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
