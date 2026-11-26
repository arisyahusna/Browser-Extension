import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  Settings,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  FileQuestion,
  Power,
  LogIn,
  ChevronDown,
  Inbox,
  BotMessageSquare,
  Search,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { AIFAChatbotView, ChatMessage } from './AIFAChatbotView';
import { AIFASettingsContent } from './AIFASettingsContent';
import { AIFASignInForm } from './AIFASignInForm';
import { AIFALanguageToggle } from './AIFALanguageToggle';
import { AIFAUserGuideContent, GUIDE_STEP_COUNT } from './AIFAUserGuideContent';
import { OverallAssessment } from '../../types/aifa';
import { FactCheckRequestStatus } from '../../types/social';

interface AIFAToolbarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

type PopupView = 'main' | 'history' | 'chat' | 'settings' | 'guide';

const getAssessmentBadge = (assessment: OverallAssessment) => {
  switch (assessment) {
    case 'supported':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#DFE6F5] text-[#3F5C9E]">
          <CheckCircle className="w-3 h-3" />
          Supported
        </span>
      );
    case 'false':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F7DEDB] text-[#9B3D36]">
          <AlertTriangle className="w-3 h-3" />
          False
        </span>
      );
    case 'misleading':
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F4EBCB] text-[#715C1C]">
          <AlertTriangle className="w-3 h-3" />
          Misleading
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#E2E4EA] text-[#5C5A56]">
          <FileQuestion className="w-3 h-3" />
          Unverified
        </span>
      );
  }
};

const getStatusPill = (status: FactCheckRequestStatus) => (
  <span
    className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${
      status === 'Completed'
        ? 'bg-[#DCEFE2] text-[#2F6B45]'
        : status === 'Under Review'
        ? 'bg-[#F4EBCB] text-[#715C1C]'
        : 'bg-[#DFE6F5] text-[#3F5C9E]'
    }`}
  >
    {status}
  </span>
);

const darkPillButton =
  'w-full h-10 bg-[#2A2A2A] hover:bg-black text-white rounded-full font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer';
const roundIconButton =
  'w-8 h-8 rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] flex items-center justify-center hover:bg-[#E2E4EA] transition-colors cursor-pointer';
const footerButton =
  'h-9 flex items-center justify-center gap-1.5 rounded-full text-xs font-semibold text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer';

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

  const renderMainView = () => (
    <div className="px-3 pb-3 space-y-3">
      {/* Contextual detection card (paused / social post / article) */}
      {!isExtensionEnabled ? (
        <div className="px-4 py-3 rounded-[20px] bg-white text-xs text-[#6F6D69]">
          <span className="font-semibold text-[#2A2A2A]">Detection paused.</span> Switch the
          extension ON to verify content.
        </div>
      ) : detectedSocialPost ? (
        <div className="p-4 rounded-[22px] bg-[#FBE4E6] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#A31F30]">Social post detected</span>
            <span className="text-[11px] text-[#6F6D69]">{detectedSocialPost.platform}</span>
          </div>
          <p className="text-xs font-medium text-[#2A2A2A] line-clamp-2">
            "{detectedSocialPost.caption}"
          </p>
          <button
            type="button"
            onClick={() => {
              onClose();
              triggerVerification(detectedSocialPost);
            }}
            className={darkPillButton}
          >
            <span>Verify this post</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : detectedArticle ? (
        <div className="p-4 rounded-[22px] bg-[#FBE4E6] space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold text-[#A31F30]">News article detected</span>
            <span className="text-[11px] text-[#6F6D69]">Malaysia News Daily</span>
          </div>
          <p className="text-xs font-semibold text-[#2A2A2A] line-clamp-2">{detectedArticle.title}</p>
          <button
            type="button"
            onClick={() => {
              onClose();
              triggerVerification();
            }}
            className={darkPillButton}
          >
            <span>Verify full article</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : null}

      {/* Most recent verification */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[13px] font-semibold text-[#2A2A2A]">My Reports</h3>
          <button
            type="button"
            onClick={() => setView('history')}
            className="h-7 px-3 rounded-full border border-[#2A2A2A]/15 text-[11px] font-semibold text-[#2A2A2A] flex items-center gap-1 hover:bg-[#E2E4EA] transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {latestVerification ? (
          <div className="p-4 rounded-[20px] bg-white">
            <div className="flex items-center justify-between gap-2">
              {getAssessmentBadge(latestVerification.overallAssessment)}
              <span className="text-[11px] text-[#6F6D69] truncate">{latestVerification.verifiedAt}</span>
            </div>
            <p className="mt-2 text-[13px] font-semibold text-[#2A2A2A] line-clamp-1">
              {latestVerification.headline}
            </p>
            <p className="mt-0.5 text-[11px] text-[#6F6D69] truncate">
              {latestVerification.platformName} · {latestVerification.claimsCount} claims checked
            </p>
          </div>
        ) : (
          <p className="p-4 text-center text-xs text-[#6F6D69] bg-white rounded-[20px]">
            No verifications yet.
          </p>
        )}
      </section>
    </div>
  );

  // Settings and User Guide open inside the popup, with a back arrow to the main screen.
  const renderSubPage = () => {
    const isGuide = view === 'guide';
    return (
      <div className="flex flex-col">
        <div className="px-4 pb-3 flex items-center gap-2.5 border-b border-[#E0DED9]">
          <button
            type="button"
            onClick={() => setView('main')}
            aria-label="Back to main popup"
            className={`${roundIconButton} shrink-0`}
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h3 id="popup-subpage-title" className="text-sm font-semibold text-[#2A2A2A]">
            {isGuide ? 'User Guide' : 'Settings'}
          </h3>
          {isGuide && (
            <span className="ml-auto text-[11px] font-semibold text-[#6F6D69]">
              Step {guideStep + 1} of {GUIDE_STEP_COUNT}
            </span>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto select-text">
          {isGuide ? (
            <div className="pt-3">
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
            <div className="px-3 pt-3 pb-4">
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
      <div className="px-4 pb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setView('main')}
          aria-label="Back to main popup"
          className={roundIconButton}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h3 className="text-sm font-semibold text-[#2A2A2A]">Submission History</h3>
        <span
          className="ml-auto min-w-[24px] text-center text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#2A2A2A] text-white"
          aria-label={query ? `${results.length} of ${submittedRequests.length} submissions` : `${submittedRequests.length} submissions`}
        >
          {query ? `${results.length}/${submittedRequests.length}` : submittedRequests.length}
        </span>
      </div>

      {/* Search form */}
      {submittedRequests.length > 0 && (
        <form
          role="search"
          aria-label="Search submissions"
          onSubmit={(e) => {
            e.preventDefault();
            setHistorySearch(historySearchDraft);
            setExpandedRequestId(null);
          }}
          className="px-3 pb-3 flex items-center gap-2"
        >
          <div className="flex-1 min-w-0 h-10 pl-3.5 pr-1 rounded-full bg-white border border-[#E0DED9] flex items-center gap-2 focus-within:border-[#5774BC] focus-within:ring-2 focus-within:ring-[#5774BC]/20 transition-colors">
            <Search className="w-3.5 h-3.5 text-[#6F6D69] shrink-0" aria-hidden="true" />
            <input
              type="search"
              value={historySearchDraft}
              onChange={(e) => {
                setHistorySearchDraft(e.target.value);
                // Emptying the box shows everything again without needing the button.
                if (!e.target.value) setHistorySearch('');
              }}
              placeholder="Title, claim or reference no."
              aria-label="Search submissions"
              className="flex-1 min-w-0 bg-transparent text-xs text-[#2A2A2A] outline-none placeholder:text-[#A3A19B] [&::-webkit-search-cancel-button]:hidden"
            />
            {historySearchDraft && (
              <button
                type="button"
                onClick={clearHistorySearch}
                aria-label="Clear search"
                className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[#6F6D69] hover:bg-[#E2E4EA] hover:text-[#2A2A2A] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            type="submit"
            className="h-10 px-4 shrink-0 rounded-full bg-[#2A2A2A] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEFF3] focus-visible:ring-[#5774BC]/50"
          >
            <Search className="w-3.5 h-3.5" aria-hidden="true" />
            
          </button>
        </form>
      )}

      {submittedRequests.length === 0 ? (
        <div className="mx-3 mb-3 px-6 py-10 text-center bg-white rounded-[22px]">
          <Inbox className="w-7 h-7 text-[#6F6D69]/50 mx-auto" />
          <p className="mt-2 text-sm font-semibold text-[#2A2A2A]">No submissions yet</p>
          <p className="mt-1 text-xs text-[#6F6D69] leading-relaxed">
            Claims you send to Sebenarnya.my for fact-checking will appear here.
          </p>
        </div>
      ) : results.length === 0 ? (
        <div role="status" className="mx-3 mb-3 px-6 py-8 text-center bg-white rounded-[22px]">
          <Search className="w-6 h-6 text-[#6F6D69]/50 mx-auto" aria-hidden="true" />
          <p className="mt-2 text-sm font-semibold text-[#2A2A2A]">No matching submissions</p>
          <p className="mt-1 text-xs text-[#6F6D69] leading-relaxed break-words">
            Nothing matches "{historySearch.trim()}". Try a different word or reference number.
          </p>
          <button
            type="button"
            onClick={clearHistorySearch}
            className="mt-3 h-8 px-3.5 rounded-full border border-[#2A2A2A]/15 text-xs font-semibold text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer"
          >
            Clear search
          </button>
        </div>
      ) : (
        <ul className="px-3 pb-3 space-y-2">
          {results.map((req) => {
            const isExpanded = expandedRequestId === req.id;
            return (
              <li key={req.id} className="rounded-[20px] bg-white overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
                  aria-expanded={isExpanded}
                  className="w-full text-left p-4 hover:bg-[#E2E4EA] transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[#2A2A2A] line-clamp-2">{req.title}</p>
                    {getStatusPill(req.status)}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px] text-[#6F6D69]">
                    <span className="truncate">Submitted {req.timestamp}</span>
                    <span className="flex items-center gap-0.5 shrink-0 font-semibold text-[#2A2A2A]">
                      Details
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <dl className="mx-2 mb-2 p-3 rounded-2xl bg-[#F4F3F1] space-y-2 text-[11px]">
                    <div>
                      <dt className="font-semibold text-[#6F6D69]">Reference</dt>
                      <dd className="font-mono text-[#2A2A2A]">{req.referenceNumber}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[#6F6D69]">Claim</dt>
                      <dd className="text-[#2A2A2A] leading-relaxed">"{req.claimText}"</dd>
                    </div>
                    <div className="flex gap-4">
                      <div className="min-w-0">
                        <dt className="font-semibold text-[#6F6D69]">Source</dt>
                        <dd className="text-[#2A2A2A] truncate">{req.sourcePlatform}</dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="font-semibold text-[#6F6D69]">Last updated</dt>
                        <dd className="text-[#2A2A2A] truncate">{req.lastUpdated}</dd>
                      </div>
                    </div>
                    {req.additionalNotes && (
                      <div>
                        <dt className="font-semibold text-[#6F6D69]">Your notes</dt>
                        <dd className="text-[#5C5A56] leading-relaxed">{req.additionalNotes}</dd>
                      </div>
                    )}
                    {req.reviewOutcome && (
                      <div className="p-2.5 rounded-xl bg-[#DCEFE2]">
                        <dt className="font-semibold text-[#2F6B45]">Outcome</dt>
                        <dd className="text-[#24523A] leading-relaxed">{req.reviewOutcome}</dd>
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
    <div
      ref={popupRef}
      role="dialog"
      aria-label="Sebenarnya.my extension"
      className="absolute top-12 right-6 z-50 w-[340px] max-w-[calc(100vw-2rem)] bg-[#EEEFF3] rounded-[28px] border border-[#E0DED9] overflow-hidden text-[#2A2A2A] font-['Montserrat',sans-serif] antialiased select-none flex flex-col"
      style={{
        boxShadow: '0 24px 48px -16px rgba(42, 42, 42, 0.3), 0 8px 16px -8px rgba(42, 42, 42, 0.12)',
      }}
    >
      {/* Header: official logo + ON/OFF + close */}
      <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
        <img
          src={`${import.meta.env.BASE_URL}images/sebenarnya-logo.png`}
          alt="Sebenarnya.my"
          className="h-8 w-auto"
          draggable={false}
        />
        <div className="flex items-center gap-2">
          <AIFALanguageToggle />
          {isSignedIn && (
          <button
            type="button"
            role="switch"
            onClick={toggleExtension}
            aria-checked={isExtensionEnabled}
            aria-label="Extension"
            title={isExtensionEnabled ? 'Disable extension' : 'Enable extension'}
            className={`relative w-[52px] h-7 rounded-full transition-colors duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-emerald-500/50 ${
              isExtensionEnabled ? 'bg-emerald-500' : 'bg-[#D6D4CF]'
            }`}
          >
            {/* Track label */}
            <span
              aria-hidden="true"
              className={`absolute top-1/2 -translate-y-1/2 text-[9px] font-bold tracking-wide ${
                isExtensionEnabled ? 'left-2 text-white' : 'right-1.5 text-[#5C5A56]'
              }`}
            >
              {isExtensionEnabled ? 'ON' : 'OFF'}
            </span>
            {/* Knob */}
            <span
              aria-hidden="true"
              className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.3)] flex items-center justify-center transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                isExtensionEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <Power
                className={`w-3 h-3 transition-colors duration-300 ${
                  isExtensionEnabled ? 'text-emerald-500' : 'text-[#6F6D69]'
                }`}
                strokeWidth={2.5}
              />
            </span>
          </button>
          )}
          <button type="button" onClick={onClose} className={roundIconButton} aria-label="Close popup">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isSignedIn ? (
        // Signed out: the extension can't be used until the user signs in.
        <div className="max-h-[75vh] overflow-y-auto px-4 pt-1 pb-4 select-text">
          <h2 className="text-lg font-bold tracking-tight text-[#2A2A2A]">Sign in to AIFA</h2>
          <p className="mt-1 mb-4 text-xs text-[#6F6D69] leading-relaxed">
            Sign in with your Sebenarnya.my account to verify articles and posts as you browse.
          </p>
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
      <div className="mx-3 mb-3 px-4 py-2.5 rounded-[20px] bg-white flex items-center justify-between gap-2 text-xs">
        {userProfile.isConnected ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-[#2A2A2A] shrink-0" />
            <div className="flex flex-col min-w-0 leading-tight">
              <span className="font-semibold text-[#2A2A2A] truncate">{userProfile.name}</span>
              <span className="text-[11px] text-[#6F6D69] truncate">{userProfile.email}</span>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-[#A31F30] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#D93043] shrink-0" />
              <span>Account disconnected</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                setSignInModalOpen(true);
              }}
              className="h-7 px-3 rounded-full bg-[#2A2A2A] text-white hover:bg-black font-semibold text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogIn className="w-3 h-3" />
              <span>Connect</span>
            </button>
          </>
        )}
      </div>

      {/* Body */}
      <div className="max-h-[60vh] overflow-y-auto">
        {view === 'main' ? renderMainView() : renderHistoryView()}
      </div>

      {/* Footer: Settings + User Guide + Chatbot (icon only), all opening inside the popup */}
      <div className="px-2 py-2 border-t border-[#E0DED9] flex items-center gap-1">
        <button type="button" onClick={() => setView('settings')} className={`${footerButton} flex-1`}>
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
        <button type="button" onClick={openGuide} className={`${footerButton} flex-1`}>
          <BookOpen className="w-3.5 h-3.5" />
          <span>User Guide</span>
        </button>
        <button
          type="button"
          onClick={() => setView('chat')}
          aria-label="AIFA Chatbot"
          title="AIFA Chatbot"
          className="w-9 h-9 shrink-0 mr-1 rounded-full bg-[#D93043] hover:bg-[#B92536] text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEFF3] focus-visible:ring-[#D93043]/50"
        >
          <BotMessageSquare className="w-[18px] h-[18px]" />
        </button>
      </div>
      </>
      )}
    </div>
  );
};
