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

export type ClaimVerdict = 'supported' | 'false' | 'misleading' | 'unverified';
export type OverallAssessment = 'supported' | 'false' | 'misleading' | 'mixed' | 'unverified';
export type PanelDisplayMode = 'expanded' | 'minimized' | 'closed';
export type AnalysisStep = 'extracting' | 'identifying' | 'reviewing' | 'complete';

export interface ClaimAnalysis {
  id: string;
  claimNumber: number;
  paragraphId: string;
  statement: string;
  exactArticleText: string;
  verdict: ClaimVerdict;
  verdictLabel: string;
  explanation: string;
  evidence: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface ArticleVerificationResult {
  articleId: string;
  headline: string;
  sourceWebsite: string;
  publishedAt: string;
  verifiedAt: string;
  overallAssessment: OverallAssessment;
  overallLabel: string;
  assessmentExplanation: string;
  summary: string;
  claims: ClaimAnalysis[];
  demoNotice: string;
}

export interface VerificationRequest {
  articleId: string;
  title: string;
  sourceUrl: string;
  summary: string;
  bodyText: string;
  status: 'idle' | 'requested';
  timestamp: string;
}

export interface TabVerificationState {
  panelMode: PanelDisplayMode;
  analysisStep: AnalysisStep;
  isAnalyzing: boolean;
  result: ArticleVerificationResult | null;
  activeClaimId: string | null;
  expandedClaimIds: string[];
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
  
  // Stage 3 Panel State & Operations
  panelMode: PanelDisplayMode;
  openPanel: () => void;
  minimizePanel: () => void;
  restorePanel: () => void;
  closePanel: () => void;
  
  // Analysis Sequence State
  isAnalyzing: boolean;
  analysisStep: AnalysisStep;
  analysisProgress: number; // 0 - 100
  
  // Results & Claims
  verificationResult: ArticleVerificationResult | null;
  activeClaimId: string | null;
  setActiveClaimId: (claimId: string | null) => void;
  expandedClaimIds: string[];
  toggleClaimExpanded: (claimId: string) => void;
  locateClaimInArticle: (claimId: string) => void;
}
