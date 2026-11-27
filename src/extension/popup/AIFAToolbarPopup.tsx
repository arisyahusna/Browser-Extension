import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Settings,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  LogIn,
  ChevronDown,
  Inbox,
  BotMessageSquare,
  Search,
} from 'lucide-react';
import {
  Alert,
  Badge,
  Button,
  Card,
  EmptyState,
  Icon,
  IconButton,
  SearchField,
  Switch,
} from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { AIFAChatbotView, ChatMessage } from './AIFAChatbotView';
import { AIFASettingsContent } from '../shared/AIFASettingsContent';
import { AIFASignInForm } from '../shared/AIFASignInForm';
import { AIFALanguageToggle } from '../shared/AIFALanguageToggle';
import { AIFAUserGuideContent, GUIDE_STEP_COUNT } from '../shared/AIFAUserGuideContent';
import { AssessmentLabel } from '../shared/AssessmentLabel';
import { ExtensionSurface } from '../shared/ExtensionSurface';
import { FactCheckRequestStatus } from '../../types/social';

interface AIFAToolbarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type PopupView = 'main' | 'history' | 'chat' | 'settings' | 'guide';

const ASSESSMENT_WORDS = {
  supported: 'Supported',
  false: 'False',
  misleading: 'Misleading',
  mixed: 'Unverified',
  unverified: 'Unverified',
} as const;

// The design system has no status colours: Completed is filled, open requests are outlined.
const getStatusPill = (status: FactCheckRequestStatus) => (
  <Badge size="sm" variant={status === 'Completed' ? 'muted' : 'outline'} className="shrink-0">
    {status}
  </Badge>
);

export const AIFAToolbarPopup: React.FC<AIFAToolbarPopupProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const {
    detectedArticle,
    detectedSocialPost,
    triggerVerification,
    verificationHistory,
    submittedRequests,
    userProfile,
    setSignInModalOpen,
    completeOnboarding,
    isOnboardingCompleted,
    isExtensionEnabled,
    toggleExtension,
    isSignedIn,
  } = useAifa();

  const [view, setView] = useState<PopupView>('main');
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  // Submission History search: the box text, and the query applied by the Search button / Enter.
  const [historySearchDraft, setHistorySearchDraft] = useState('');
  const [historySearch, setHistorySearch] = useState('');
  const [guideStep, setGuideStep] = useState(0);
  // Remounts the guide so every visit starts at step 1.
  const [guideRun, setGuideRun] = useState(0);
  const openGuide = () => {
    setGuideStep(0);
    setGuideRun((n) => n + 1);
    setView('guide');
  };
  // Lives here (not in the chat view) so the conversation survives closing and reopening the popup.
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  // The chat is about the current page; start fresh when the detected content changes.
  const chatContentKey = detectedSocialPost?.id ?? detectedArticle?.id ?? null;
  useEffect(() => {
    setChatMessages([]);
  }, [chatContentKey]);

  // Right after signing in here, first-time users get the guide inside the popup;
  // everyone else lands on the main screen.
  const wasSignedIn = useRef(isSignedIn);
  useEffect(() => {
    if (isSignedIn && !wasSignedIn.current && isOpen) {
      if (isOnboardingCompleted) setView('main');
      else openGuide();
    }
    wasSignedIn.current = isSignedIn;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  // Always reopen on the main page.
  useEffect(() => {
    if (!isOpen) {
      setView('main');
      setExpandedRequestId(null);
      setHistorySearchDraft('');
      setHistorySearch('');
    }
  }, [isOpen]);

  // Close on outside click or ESC
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const latestVerification = verificationHistory[0];

  const renderDetectedCard = (kind: string, source: string, text: string, actionLabel: string, onVerify: () => void) => (
    <Card variant="raised" size="sm" className="flex flex-col gap-text">
      <div className="flex items-center justify-between gap-inline">
        <span className="text-eyebrow uppercase text-muted-foreground">{kind}</span>
        <span className="text-caption text-muted-foreground">{source}</span>
      </div>
      <p className="text-label-sm text-foreground line-clamp-2">{text}</p>
      <Button iconEnd={ArrowRight} onClick={onVerify} className="w-full">
        {actionLabel}
      </Button>
    </Card>
  );

  const renderMainView = () => (
    <div className="px-12 pb-12 flex flex-col gap-cards">
      {/* Contextual detection card (paused / social post / article) */}
      {!isExtensionEnabled ? (
        <Alert title="Detection paused.">Switch the extension ON to verify content.</Alert>
      ) : detectedSocialPost ? (
        renderDetectedCard(
          'Social post detected',
          detectedSocialPost.platform,
          `"${detectedSocialPost.caption}"`,
          'Verify this post',
          () => {
            onClose();
            triggerVerification(detectedSocialPost);
          }
        )
      ) : detectedArticle ? (
        renderDetectedCard('News article detected', 'Malaysia News Daily', detectedArticle.title, 'Verify full article', () => {
          onClose();
          triggerVerification();
        })
      ) : null}

      {/* Most recent verification */}
      <section className="flex flex-col gap-text">
        <div className="flex items-center justify-between gap-inline px-4">
          <h3 className="text-label text-foreground">My Reports</h3>
          <Button variant="outline" size="sm" iconEnd={ArrowRight} onClick={() => setView('history')}>
            View All
          </Button>
        </div>

        {latestVerification ? (
          <Card variant="raised" size="sm" className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-inline">
              <AssessmentLabel
                assessment={latestVerification.overallAssessment}
                label={ASSESSMENT_WORDS[latestVerification.overallAssessment]}
              />
              <span className="text-caption text-muted-foreground truncate">{latestVerification.verifiedAt}</span>
            </div>
            <p className="text-label-sm text-foreground line-clamp-1">{latestVerification.headline}</p>
            <p className="text-caption text-muted-foreground truncate">
              {latestVerification.platformName} · {latestVerification.claimsCount} claims checked
            </p>
          </Card>
        ) : (
          <Card variant="raised" size="sm">
            <p className="text-center text-body-sm text-muted-foreground">No verifications yet.</p>
          </Card>
        )}
      </section>
    </div>
  );

  // Settings and User Guide open inside the popup, with a back arrow to the main screen.
  const renderSubPage = () => {
    const isGuide = view === 'guide';
    return (
      <div className="flex flex-col">
        <div className="px-16 pb-12 flex items-center gap-inline border-b border-border">
          <IconButton icon={ArrowLeft} label="Back to main popup" size="icon-sm" onClick={() => setView('main')} />
          <h3 id="popup-subpage-title" className="text-label text-foreground">
            {isGuide ? 'User Guide' : 'Settings'}
          </h3>
          {isGuide && (
            <span className="ml-auto text-caption text-muted-foreground">
              Step {guideStep + 1} of {GUIDE_STEP_COUNT}
            </span>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto select-text">
          {isGuide ? (
            <div className="pt-12">
              <AIFAUserGuideContent
                key={guideRun}
                compact
                onStepChange={setGuideStep}
                onFinish={() => {
                  completeOnboarding();
                  setView('main');
                }}
                onSkip={() => setView('main')}
              />
            </div>
          ) : (
            <div className="px-12 pt-12 pb-16">
              <AIFASettingsContent
                onOpenGuide={openGuide}
                onConnect={() => {
                  onClose();
                  setSignInModalOpen(true);
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  const clearHistorySearch = () => {
    setHistorySearchDraft('');
    setHistorySearch('');
  };

  const renderHistoryView = () => {
    // Matches the title, claim, reference number, source, status or the user's notes.
    const query = historySearch.trim().toLowerCase();
    const results = query
      ? submittedRequests.filter((req) =>
          [req.title, req.claimText, req.referenceNumber, req.sourcePlatform, req.status, req.additionalNotes]
            .filter(Boolean)
            .some((field) => field!.toLowerCase().includes(query))
        )
      : submittedRequests;

    return (
      <div className="flex flex-col">
        <div className="px-16 pb-8 flex items-center gap-inline">
          <IconButton icon={ArrowLeft} label="Back to main popup" size="icon-sm" onClick={() => setView('main')} />
          <h3 className="text-label text-foreground">Submission History</h3>
          <Badge
            size="sm"
            className="ml-auto self-center"
            aria-label={query ? `${results.length} of ${submittedRequests.length} submissions` : `${submittedRequests.length} submissions`}
          >
            {query ? `${results.length}/${submittedRequests.length}` : submittedRequests.length}
          </Badge>
        </div>

        {/* Search form */}
        {submittedRequests.length > 0 && (
          <SearchField
            size="sm"
            label="Search submissions"
            hideLabel
            placeholder="Title, claim or reference no."
            buttonLabel="Search"
            value={historySearchDraft}
            onChange={(text) => {
              setHistorySearchDraft(text);
              // Emptying the box shows everything again without needing the button.
              if (!text) setHistorySearch('');
            }}
            onSubmit={(text) => {
              setHistorySearch(text);
              setExpandedRequestId(null);
            }}
            className="px-12 pb-12"
          />
        )}

        {submittedRequests.length === 0 ? (
          <Card variant="raised" size="sm" className="mx-12 mb-12">
            <EmptyState
              icon={Inbox}
              title="No submissions yet"
              description="Claims you send to Sebenarnya.my for fact-checking will appear here."
            />
          </Card>
        ) : results.length === 0 ? (
          <Card variant="raised" size="sm" className="mx-12 mb-12" role="status">
            <EmptyState
              icon={Search}
              title="No matching submissions"
              description={`Nothing matches "${historySearch.trim()}". Try a different word or reference number.`}
              action={
                <Button variant="outline" size="sm" onClick={clearHistorySearch}>
                  Clear search
                </Button>
              }
            />
          </Card>
        ) : (
          <ul className="px-12 pb-12 flex flex-col gap-8">
            {results.map((req) => {
              const isExpanded = expandedRequestId === req.id;
              return (
                <li key={req.id} className="rounded-card bg-card overflow-hidden">
                  {/* Disclosure row: the design system has no accordion, so it is built from preset classes */}
                  <button
                    type="button"
                    onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                    aria-expanded={isExpanded}
                    className="w-full text-left p-card-sm flex flex-col gap-6 hover:bg-muted transition-colors duration-fast ease-out cursor-pointer"
                  >
                    <div className="w-full flex items-start justify-between gap-inline">
                      <p className="text-label-sm text-foreground line-clamp-2">{req.title}</p>
                      {getStatusPill(req.status)}
                    </div>
                    <div className="w-full flex items-center justify-between gap-inline text-caption text-muted-foreground">
                      <span className="truncate">Submitted {req.timestamp}</span>
                      <span className="flex items-center gap-2 shrink-0 text-foreground">
                        Details
                        <Icon
                          icon={ChevronDown}
                          size="sm"
                          className={`transition-transform duration-fast ease-out ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <dl className="mx-8 mb-8 p-12 rounded-media bg-muted flex flex-col gap-8 text-caption">
                      <div>
                        <dt className="text-muted-foreground">Reference</dt>
                        <dd className="text-foreground">{req.referenceNumber}</dd>
                      </div>
                      <div>
                        <dt className="text-muted-foreground">Claim</dt>
                        <dd className="text-foreground">"{req.claimText}"</dd>
                      </div>
                      <div className="flex gap-group">
                        <div className="min-w-0">
                          <dt className="text-muted-foreground">Source</dt>
                          <dd className="text-foreground truncate">{req.sourcePlatform}</dd>
                        </div>
                        <div className="min-w-0">
                          <dt className="text-muted-foreground">Last updated</dt>
                          <dd className="text-foreground truncate">{req.lastUpdated}</dd>
                        </div>
                      </div>
                      {req.additionalNotes && (
                        <div>
                          <dt className="text-muted-foreground">Your notes</dt>
                          <dd className="text-text-secondary">{req.additionalNotes}</dd>
                        </div>
                      )}
                      {req.reviewOutcome && (
                        <div className="p-8 rounded-media bg-card">
                          <dt className="text-success">Outcome</dt>
                          <dd className="text-foreground">{req.reviewOutcome}</dd>
                        </div>
                      )}
                    </dl>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  };

  return (
    <ExtensionSurface density="compact">
      <div
        ref={popupRef}
        role="dialog"
        aria-label="Sebenarnya.my extension"
        className="aifa-popup-frame absolute top-48 right-24 z-dropdown bg-muted rounded-card-lg border border-border shadow-float overflow-hidden font-sans text-body-sm text-foreground select-none flex flex-col"
      >
        {/* Header: official logo + ON/OFF + close */}
        <div className="px-16 pt-16 pb-12 flex items-center justify-between gap-inline">
          <img
            src={`${import.meta.env.BASE_URL}images/sebenarnya-logo.png`}
            alt="Sebenarnya.my"
            // The logo gives way (scaled, never cropped) so the controls on the right keep their size.
            className="h-32 w-auto min-w-0 shrink object-contain object-left"
            draggable={false}
          />
          <div className="flex items-center gap-inline shrink-0">
            <AIFALanguageToggle />
            {isSignedIn && (
              <Switch
                label="Extension"
                hideLabel
                title={isExtensionEnabled ? 'Disable extension' : 'Enable extension'}
                checked={isExtensionEnabled}
                onCheckedChange={() => toggleExtension()}
              />
            )}
            <IconButton icon={X} label="Close popup" size="icon-sm" onClick={onClose} />
          </div>
        </div>

        {!isSignedIn ? (
          // Signed out: the extension can't be used until the user signs in.
          <div className="max-h-[75vh] overflow-y-auto px-16 pt-4 pb-16 select-text flex flex-col gap-group">
            <div className="flex flex-col gap-text">
              <h2 className="text-heading text-foreground">Sign in to AIFA</h2>
              <p className="text-body-sm text-muted-foreground">
                Sign in with your Sebenarnya.my account to verify articles and posts as you browse.
              </p>
            </div>
            <AIFASignInForm compact openOnboarding={false} />
          </div>
        ) : view === 'chat' ? (
          <AIFAChatbotView
            messages={chatMessages}
            setMessages={setChatMessages}
            onBack={() => setView('main')}
            onClosePopup={onClose}
          />
        ) : view === 'settings' || view === 'guide' ? (
          renderSubPage()
        ) : (
          <>
            {/* Account strip */}
            <Card variant="raised" size="sm" className="mx-12 mb-12 flex flex-row items-center justify-between gap-inline">
              {userProfile.isConnected ? (
                <div className="flex items-center gap-inline min-w-0">
                  <span className="size-dot rounded-full bg-foreground shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-label-sm text-foreground truncate">{userProfile.name}</span>
                    <span className="text-caption text-muted-foreground truncate">{userProfile.email}</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-inline text-label-sm text-destructive">
                    <span className="size-dot rounded-full bg-destructive shrink-0" />
                    <span>Account disconnected</span>
                  </div>
                  <Button
                    size="sm"
                    icon={LogIn}
                    onClick={() => {
                      onClose();
                      setSignInModalOpen(true);
                    }}
                  >
                    Connect
                  </Button>
                </>
              )}
            </Card>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto">
              {view === 'main' ? renderMainView() : renderHistoryView()}
            </div>

            {/* Footer: Settings + User Guide + Chatbot (icon only), all opening inside the popup */}
            <div className="p-8 border-t border-border flex items-center gap-4">
              <Button variant="quiet" size="sm" icon={Settings} onClick={() => setView('settings')} className="flex-1">
                Settings
              </Button>
              <Button variant="quiet" size="sm" icon={BookOpen} onClick={openGuide} className="flex-1">
                User Guide
              </Button>
              <IconButton
                icon={BotMessageSquare}
                label="AIFA Chatbot"
                title="AIFA Chatbot"
                variant="filled"
                onClick={() => setView('chat')}
              />
            </div>
          </>
        )}
      </div>
    </ExtensionSurface>
  );
};
