import { SocialPost, FactCheckRequest, OcrBoundingBox } from './social';

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

export type PanelActiveView =
  | 'results'
  | 'request_form'
  | 'request_confirmation'
  | 'request_detail';

export interface ClaimAnalysis {
  id: string;
  claimNumber: number;
  paragraphId?: string; // For articles
  postId?: string; // For social posts
  locationType?: 'caption' | 'image' | 'both'; // For social posts
  imageBoundingBoxId?: string;
  statement: string;
  exactArticleText: string;
  verdict: ClaimVerdict;
  verdictLabel: string;
  explanation: string;
  evidence: string;
  sourceLabel?: string;
  sourceUrl?: string;
}

export interface VerificationResult {
  contentId: string;
  contentType: 'article' | 'social-post';
  headline: string;
  platformName: string;
  sourceWebsite: string;
  authorName: string;
  publishedAt: string;
  verifiedAt: string;
  overallAssessment: OverallAssessment;
  overallLabel: string;
  assessmentExplanation: string;
  summary: string;
  captionText?: string;
  extractedImageText?: string;
  imageOcrNotes?: string;
  claims: ClaimAnalysis[];
  demoNotice: string;
}

export interface VerificationHistoryRecord {
  id: string;
  contentId: string;
  contentType: 'article' | 'social-post';
  headline: string;
  platformName: string;
  sourceUrl: string;
  verifiedAt: string;
  overallAssessment: OverallAssessment;
  overallLabel: string;
  summary: string;
  claimsCount: number;
  result: VerificationResult;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  relatedRequestId: string;
  referenceNumber: string;
  timestamp: string;
  isRead: boolean;
  type: 'request_completed' | 'request_review' | 'system';
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  isConnected: boolean;
  connectedAt?: string;
}

export interface NotificationPreferences {
  browserNotifications: boolean;
  emailNotifications: boolean;
}

export interface AifaContextType {
  // Auth & Connection
  userProfile: UserProfile;
  isConnectingAccount: boolean;
  connectAccount: () => void;
  disconnectAccount: () => void;
  isSignInModalOpen: boolean;
  setSignInModalOpen: (open: boolean) => void;
  
  // Extension enablement
  isExtensionEnabled: boolean;
  toggleExtension: () => void;
  
  // Onboarding
  isOnboardingCompleted: boolean;
  isOnboardingOpen: boolean;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  completeOnboarding: () => void;
  
  // Detection targets
  detectedArticle: DetectedArticleInfo | null;
  detectedSocialPost: SocialPost | null;
  activeHoveredPostId: string | null;
  setActiveHoveredPostId: (postId: string | null) => void;
  
  isArticleHovered: boolean;
  setIsArticleHovered: (hovered: boolean) => void;
  isButtonHovered: boolean;
  setIsButtonHovered: (hovered: boolean) => void;
  isHighlighted: boolean;
  
  // Triggers
  triggerVerification: (socialPost?: SocialPost) => void;
  resetVerification: () => void;
  
  // Panel state & navigation
  panelMode: PanelDisplayMode;
  openPanel: () => void;
  minimizePanel: () => void;
  restorePanel: () => void;
  closePanel: () => void;
  
  panelView: PanelActiveView;
  setPanelView: (view: PanelActiveView) => void;
  
  // Simulated analysis pipeline
  isAnalyzing: boolean;
  analysisStep: AnalysisStep;
  analysisProgress: number;
  
  // Results & Claims
  verificationResult: VerificationResult | null;
  activeClaimId: string | null;
  setActiveClaimId: (claimId: string | null) => void;
  expandedClaimIds: string[];
  toggleClaimExpanded: (claimId: string) => void;
  
  // Synchronized locating
  activeImageHighlightBox: OcrBoundingBox | null;
  locateClaimInArticle: (claimId: string) => void;
  locateClaimInSocialPost: (claimId: string, locationPreference?: 'caption' | 'image') => void;
  
  // Request Fact-Check Workflow (Stage 4)
  activeFactCheckClaim: ClaimAnalysis | null;
  openFactCheckForm: (claim: ClaimAnalysis) => void;
  submitFactCheckRequest: (notes: string, includeSupporting: boolean) => void;
  isSubmittingRequest: boolean;
  currentRequest: FactCheckRequest | null;
  submittedRequests: FactCheckRequest[];
  viewRequestDetail: (req: FactCheckRequest) => void;
  returnToResults: () => void;
  
  // Stage 5 Capabilities:
  // History Store
  verificationHistory: VerificationHistoryRecord[];
  deleteHistoryRecord: (id: string) => void;
  clearHistory: () => void;
  
  // Demo Controls for Request Lifecycle (Presenter mode)
  advanceRequestStatus: (requestId: string, newStatus: 'Under Review' | 'Completed') => void;
  clearDemoRequests: () => void;
  resetAllDemoData: () => void;
  
  // Notifications
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  activeToastNotification: NotificationItem | null;
  dismissToastNotification: () => void;
  
  // Email Preview
  emailPreviewRequest: FactCheckRequest | null;
  openEmailPreview: (req: FactCheckRequest) => void;
  closeEmailPreview: () => void;
  
  // Notification Preferences & Settings
  notificationPreferences: NotificationPreferences;
  updateNotificationPreferences: (prefs: Partial<NotificationPreferences>) => void;
  isSettingsModalOpen: boolean;
  setSettingsModalOpen: (open: boolean) => void;
}
