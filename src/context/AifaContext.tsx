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
  VerificationHistoryRecord,
  NotificationItem,
  UserProfile,
  NotificationPreferences,
  AppLanguage,
} from '../types/aifa';
import { SocialPost, FactCheckRequest } from '../types/social';
import { useBrowser } from './BrowserContext';
import { MOCK_ARTICLES } from '../data/mockArticles';
import { MOCK_VERIFICATION_RESULTS } from '../data/mockVerificationResults';
import {
  MOCK_CONNECT_POSTS,
  MOCK_PULSE_POSTS,
  MOCK_SOCIAL_VERIFICATIONS,
} from '../data/mockSocialPosts';
import {
  INITIAL_USER_PROFILE,
  INITIAL_HISTORY,
  INITIAL_REQUESTS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockInitialState';

const AifaContext = createContext<AifaContextType | undefined>(undefined);

// One sign-in for the extension and the dashboard. (Key name kept so existing sessions survive.)
const SESSION_KEY = 'aifa_dashboard_session';

/** "arisya.husna@x.com" → "Arisya Husna"; the demo address keeps its seeded display name. */
const nameFromEmail = (email: string) => {
  if (email === INITIAL_USER_PROFILE.email) return INITIAL_USER_PROFILE.name;
  const local = email.split('@')[0] ?? '';
  const words = local.split(/[._\-+]+/).filter(Boolean);
  if (words.length === 0) return INITIAL_USER_PROFILE.name;
  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const AifaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentLocation, activeTabId, displayUrl, refreshNonce, setAifaPopupOpen } = useBrowser();
  const [isExtensionEnabled, setIsExtensionEnabled] = useState(true);

  // Interface language. Only the toggle exists so far; text is not translated yet.
  const [language, setLanguageState] = useState<AppLanguage>(() =>
    localStorage.getItem('aifa_language') === 'ms' ? 'ms' : 'en'
  );
  const setLanguage = useCallback((lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('aifa_language', lang);
  }, []);

  // Auth & Connection State (Stage 5)
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aifa_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });
  const [isConnectingAccount, setIsConnectingAccount] = useState(false);
  const [isSignInModalOpen, setSignInModalOpen] = useState(false);

  // Sign-in session shared by the extension popup and the dashboard: both show their sign-in
  // screen until it is set. "Keep me signed in" uses localStorage; otherwise it lasts for this
  // browser session.
  const [hasSession, setHasSession] = useState<boolean>(
    () =>
      localStorage.getItem(SESSION_KEY) === 'true' ||
      sessionStorage.getItem(SESSION_KEY) === 'true'
  );
  const [isSigningIn, setIsSigningIn] = useState(false);
  const isSignedIn = hasSession && userProfile.isConnected;

  // Onboarding State (Stage 5)
  const [isOnboardingCompleted, setIsOnboardingCompleted] = useState<boolean>(() => {
    return localStorage.getItem('aifa_onboarding_completed') === 'true';
  });
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Settings & Notification Preferences (Stage 5)
  const [isSettingsModalOpen, setSettingsModalOpen] = useState(false);
  const [notificationPreferences, setNotificationPreferences] = useState<NotificationPreferences>({
    browserNotifications: true,
    emailNotifications: true,
  });

  // History Store (Stage 5)
  const [verificationHistory, setVerificationHistory] = useState<VerificationHistoryRecord[]>(() => {
    const saved = localStorage.getItem('aifa_verification_history');
    return saved ? JSON.parse(saved) : INITIAL_HISTORY;
  });

  // Requests State (Stage 4 & 5)
  const [submittedRequests, setSubmittedRequests] = useState<FactCheckRequest[]>(() => {
    const saved = localStorage.getItem('aifa_fact_check_requests');
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });
  const [activeFactCheckClaim, setActiveFactCheckClaim] = useState<ClaimAnalysis | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<FactCheckRequest | null>(null);

  // Notifications (Stage 5)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('aifa_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });
  const [activeToastNotification, setActiveToastNotification] = useState<NotificationItem | null>(null);
  const [emailPreviewRequest, setEmailPreviewRequest] = useState<FactCheckRequest | null>(null);

  // Article detection
  const [isArticleHovered, setIsArticleHoveredState] = useState(false);
  const [isButtonHovered, setIsButtonHoveredState] = useState(false);

  // Social post detection
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
  const [completedResults, setCompletedResults] = useState<Record<string, VerificationResult>>({
    ...MOCK_VERIFICATION_RESULTS,
    ...MOCK_SOCIAL_VERIFICATIONS,
  });

  const hoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postHoverExitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem('aifa_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('aifa_verification_history', JSON.stringify(verificationHistory));
  }, [verificationHistory]);

  useEffect(() => {
    localStorage.setItem('aifa_fact_check_requests', JSON.stringify(submittedRequests));
  }, [submittedRequests]);

  useEffect(() => {
    localStorage.setItem('aifa_notifications', JSON.stringify(notifications));
  }, [notifications]);

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
    setExpandedClaimIds([]);
    setPanelMode('closed');
    setPanelView('results');
    setActiveFactCheckClaim(null);
  }, [currentLocation.pathname, activeTabId, refreshNonce, clearAnalysisTimers]);

  // Auth Operations
  const connectAccount = useCallback(() => {
    setIsConnectingAccount(true);
    setTimeout(() => {
      setUserProfile({
        name: 'AIFA Demo User',
        email: 'demo@example.com',
        avatar: '👤',
        isConnected: true,
        connectedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
      sessionStorage.setItem(SESSION_KEY, 'true');
      setHasSession(true);
      setIsConnectingAccount(false);
      setSignInModalOpen(false);

      // Trigger onboarding if not completed yet
      if (!isOnboardingCompleted) {
        setIsOnboardingOpen(true);
      }
    }, 700);
  }, [isOnboardingCompleted]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setHasSession(false);
  }, []);

  // Logging out disconnects the account, so it also ends the sign-in session.
  const disconnectAccount = useCallback(() => {
    setUserProfile((prev) => ({
      ...prev,
      isConnected: false,
      connectedAt: undefined,
    }));
    clearSession();
  }, [clearSession]);

  // Simulated sign-in: any well-formed email and password is accepted.
  const signIn = useCallback(
    (email: string, remember: boolean, options: { openOnboarding?: boolean } = {}) => {
      setIsSigningIn(true);
      setTimeout(() => {
        const normalized = email.trim().toLowerCase();
        setUserProfile({
          name: nameFromEmail(normalized),
          email: normalized,
          avatar: '👤',
          isConnected: true,
          connectedAt: new Date().toLocaleString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          }),
        });
        (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, 'true');
        setHasSession(true);
        setIsSigningIn(false);

        // First sign-in opens the guided tour, unless the caller shows it itself (the popup does).
        if (!isOnboardingCompleted && options.openOnboarding !== false) {
          setIsOnboardingOpen(true);
        }
      }, 900);
    },
    [isOnboardingCompleted]
  );

  // Onboarding Operations
  const openOnboarding = useCallback(() => {
    setIsOnboardingOpen(true);
  }, []);

  const closeOnboarding = useCallback(() => {
    setIsOnboardingOpen(false);
  }, []);

  const completeOnboarding = useCallback(() => {
    setIsOnboardingCompleted(true);
    setIsOnboardingOpen(false);
    localStorage.setItem('aifa_onboarding_completed', 'true');
  }, []);

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

  // Trigger verification sequence and append to history on completion
  const triggerVerification = useCallback(
    (socialPost?: SocialPost) => {
      // Signed out: open the extension popup, which shows its sign-in screen.
      if (!isSignedIn) {
        setAifaPopupOpen(true);
        return;
      }

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
        }

        // Save to Shared Verification History (Stage 5)
        const historyRecord: VerificationHistoryRecord = {
          id: `hist-${Date.now()}`,
          contentId: mockResult.contentId,
          contentType: mockResult.contentType,
          headline: mockResult.headline,
          platformName: mockResult.platformName,
          sourceUrl: mockResult.sourceWebsite,
          verifiedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          overallAssessment: mockResult.overallAssessment,
          overallLabel: mockResult.overallLabel,
          summary: mockResult.summary,
          claimsCount: mockResult.claims.length,
          result: mockResult,
        };

        setVerificationHistory((prev) => [historyRecord, ...prev]);
      }, 3500);

      analysisTimersRef.current = [t1, t2, t3];
    },
    [clearAnalysisTimers, detectedSocialPost, detectedArticle, isSignedIn, setAifaPopupOpen]
  );

  const resetVerification = useCallback(() => {
    clearAnalysisTimers();
    setIsAnalyzing(false);
    setPanelMode('closed');
    setActiveClaimId(null);
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

  // Synchronised Locate in Social Post
  const locateClaimInSocialPost = useCallback(
    (claimId: string) => {
      setActiveClaimId(claimId);
      setExpandedClaimIds((prev) => (prev.includes(claimId) ? prev : [...prev, claimId]));

      const activeResult = verificationResult;
      const claim = activeResult?.claims.find((c) => c.id === claimId);

      if (!claim) return;

      const postElement = document.getElementById(claim.postId || '');
      if (postElement) {
        postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
          supportingContentSummary: verificationResult.summary,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

  // History Management Operations (Stage 5)
  const deleteHistoryRecord = useCallback((id: string) => {
    setVerificationHistory((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setVerificationHistory([]);
  }, []);

  // Presenter Demo Controls: Advance Request Status (Stage 5)
  const advanceRequestStatus = useCallback(
    (requestId: string, newStatus: 'Under Review' | 'Completed') => {
      let targetReq: FactCheckRequest | undefined;

      setSubmittedRequests((prev) =>
        prev.map((r) => {
          if (r.id === requestId) {
            const updated: FactCheckRequest = {
              ...r,
              status: newStatus,
              lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              reviewOutcome:
                newStatus === 'Completed'
                  ? 'Official Sebenarnya.my Clarification Published: Fictional RM500 administrative levy refuted by Ministry of Finance records.'
                  : undefined,
            };
            targetReq = updated;
            return updated;
          }
          return r;
        })
      );

      // If current open request matches, update it too
      if (currentRequest && currentRequest.id === requestId) {
        setCurrentRequest((prev) =>
          prev
            ? {
                ...prev,
                status: newStatus,
                lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                reviewOutcome:
                  newStatus === 'Completed'
                    ? 'Official Sebenarnya.my Clarification Published: Fictional RM500 administrative levy refuted by Ministry of Finance records.'
                    : undefined,
              }
            : null
        );
      }

      // If marked Completed, generate Notification and Email preview according to preferences
      if (newStatus === 'Completed' && targetReq) {
        const notifItem: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'AIFA Fact-Check Update',
          message: `Your fact-check request ${targetReq.referenceNumber} has been completed and verified.`,
          relatedRequestId: targetReq.id,
          referenceNumber: targetReq.referenceNumber,
          timestamp: 'Just now',
          isRead: false,
          type: 'request_completed',
        };

        setNotifications((prev) => [notifItem, ...prev]);

        // Trigger in-app browser notification toast if enabled
        if (notificationPreferences.browserNotifications) {
          setActiveToastNotification(notifItem);
        }
      }
    },
    [currentRequest, notificationPreferences.browserNotifications]
  );

  const clearDemoRequests = useCallback(() => {
    setSubmittedRequests([]);
  }, []);

  const resetAllDemoData = useCallback(() => {
    localStorage.removeItem('aifa_user_profile');
    localStorage.removeItem('aifa_verification_history');
    localStorage.removeItem('aifa_fact_check_requests');
    localStorage.removeItem('aifa_notifications');
    localStorage.removeItem('aifa_onboarding_completed');
    clearSession();

    setUserProfile(INITIAL_USER_PROFILE);
    setVerificationHistory(INITIAL_HISTORY);
    setSubmittedRequests(INITIAL_REQUESTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsOnboardingCompleted(false);
    resetVerification();
  }, [resetVerification, clearSession]);

  // Notifications Operations
  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const dismissToastNotification = useCallback(() => {
    setActiveToastNotification(null);
  }, []);

  const openEmailPreview = useCallback((req: FactCheckRequest) => {
    setEmailPreviewRequest(req);
  }, []);

  const closeEmailPreview = useCallback(() => {
    setEmailPreviewRequest(null);
  }, []);

  const updateNotificationPreferences = useCallback((prefs: Partial<NotificationPreferences>) => {
    setNotificationPreferences((prev) => ({ ...prev, ...prefs }));
  }, []);

  const unreadNotificationCount = useMemo(() => {
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);

  const isHighlighted =
    (isArticleHovered || isButtonHovered || activeHoveredPostId !== null) &&
    (detectedArticle !== null || detectedSocialPost !== null);

  const value = useMemo(
    () => ({
      userProfile,
      isConnectingAccount,
      connectAccount,
      disconnectAccount,
      isSignInModalOpen,
      setSignInModalOpen,
      isSignedIn,
      isSigningIn,
      signIn,
      isExtensionEnabled,
      toggleExtension,
      language,
      setLanguage,
      isOnboardingCompleted,
      isOnboardingOpen,
      openOnboarding,
      closeOnboarding,
      completeOnboarding,
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
      verificationHistory,
      deleteHistoryRecord,
      clearHistory,
      advanceRequestStatus,
      clearDemoRequests,
      resetAllDemoData,
      notifications,
      unreadNotificationCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      activeToastNotification,
      dismissToastNotification,
      emailPreviewRequest,
      openEmailPreview,
      closeEmailPreview,
      notificationPreferences,
      updateNotificationPreferences,
      isSettingsModalOpen,
      setSettingsModalOpen,
    }),
    [
      userProfile,
      isConnectingAccount,
      connectAccount,
      disconnectAccount,
      isSignInModalOpen,
      isSignedIn,
      isSigningIn,
      signIn,
      isExtensionEnabled,
      toggleExtension,
      language,
      setLanguage,
      isOnboardingCompleted,
      isOnboardingOpen,
      openOnboarding,
      closeOnboarding,
      completeOnboarding,
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
      verificationHistory,
      deleteHistoryRecord,
      clearHistory,
      advanceRequestStatus,
      clearDemoRequests,
      resetAllDemoData,
      notifications,
      unreadNotificationCount,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      activeToastNotification,
      dismissToastNotification,
      emailPreviewRequest,
      openEmailPreview,
      closeEmailPreview,
      notificationPreferences,
      updateNotificationPreferences,
      isSettingsModalOpen,
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
