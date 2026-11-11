export interface DetectedArticleInfo {
  id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  summary: string;
  bodyText: string;
  sourceUrl: string;
}

export type VerificationStatus = 'idle' | 'requested';

export interface VerificationRequest {
  articleId: string;
  title: string;
  sourceUrl: string;
  summary: string;
  bodyText: string;
  status: VerificationStatus;
  timestamp: string;
}

export interface AifaContextType {
  isExtensionEnabled: boolean;
  toggleExtension: () => void;
  detectedArticle: DetectedArticleInfo | null;
  isArticleHovered: boolean;
  setIsArticleHovered: (hovered: boolean) => void;
  isButtonHovered: boolean;
  setIsButtonHovered: (hovered: boolean) => void;
  isHighlighted: boolean;
  verificationRequest: VerificationRequest | null;
  triggerVerification: () => void;
  resetVerification: () => void;
}
