import { useEffect, RefObject } from 'react';
import { useAifa } from '../context/AifaContext';

interface UseAIFAArticleDetectionOptions {
  articleRef: RefObject<HTMLElement | null>;
  articleId?: string;
}

export const useAIFAArticleDetection = ({
  articleRef,
}: UseAIFAArticleDetectionOptions) => {
  const {
    detectedArticle,
    isArticleHovered,
    setIsArticleHovered,
    isHighlighted,
    triggerVerification,
    resetVerification,
    isExtensionEnabled,
  } = useAifa();

  useEffect(() => {
    const element = articleRef.current;
    if (!element || !isExtensionEnabled) return;

    // Pointer event listeners on the article container
    const handleMouseEnter = () => {
      setIsArticleHovered(true);
    };

    const handleMouseLeave = () => {
      setIsArticleHovered(false);
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [articleRef, setIsArticleHovered, isExtensionEnabled]);

  return {
    isDetected: Boolean(detectedArticle),
    detectedArticle,
    isArticleHovered,
    isHighlighted,
    triggerVerification,
    resetVerification,
  };
};
