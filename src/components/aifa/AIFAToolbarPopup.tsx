import React, { useEffect, useRef } from 'react';
import {
  ShieldCheck,
  X,
  ExternalLink,
  Settings,
  BookOpen,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  FileQuestion,
  Power,
  LogIn,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';
import { OverallAssessment } from '../../types/aifa';

interface AIFAToolbarPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIFAToolbarPopup: React.FC<AIFAToolbarPopupProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const {
    detectedArticle,
    detectedSocialPost,
    triggerVerification,
    verificationHistory,
    userProfile,
    setSignInModalOpen,
    openOnboarding,
    setSettingsModalOpen,
    isExtensionEnabled,
    toggleExtension,
  } = useAifa();

  const { navigate, currentLocation } = useBrowser();

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

  const handleOpenDashboard = (tab?: string) => {
    onClose();
    navigate({
      pathname: '/sebenarnya-dashboard',
      title: 'Sebenarnya.my — AIFA Fact-Checking User Dashboard',
      platform: 'dashboard',
      customUrl: `https://sebenarnya-dashboard.example/${tab ? '#' + tab : ''}`,
    });
  };

  const getAssessmentBadge = (assessment: OverallAssessment) => {
    switch (assessment) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
            <CheckCircle className="w-2.5 h-2.5" />
            Supported
          </span>
        );
      case 'false':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
            <AlertTriangle className="w-2.5 h-2.5" />
            False
          </span>
        );
      case 'misleading':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
            <AlertTriangle className="w-2.5 h-2.5" />
            Misleading
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
            <FileQuestion className="w-2.5 h-2.5" />
            Unverified
          </span>
        );
    }
  };

  const isDashboard = currentLocation.pathname.startsWith('/sebenarnya-dashboard');

  return (
    <div
      ref={popupRef}
      className="absolute top-12 right-6 z-50 w-88 bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-[#171B26] animate-in fade-in zoom-in-95 duration-150 select-none flex flex-col"
      style={{
        boxShadow:
          '0 20px 40px -10px rgba(23, 27, 38, 0.2), 0 8px 16px -4px rgba(23, 27, 38, 0.1)',
      }}
    >
      {/* Extension Header */}
      <div className="bg-[#171B26] text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#D93043] flex items-center justify-center text-white text-sm font-black shadow-sm">
            🛡️
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight flex items-center gap-1.5">
              <span>AIFA Assistant</span>
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-white/20 text-white">
                v2.5
              </span>
            </div>
            <div className="text-[10px] text-slate-300">Sebenarnya.my Fact-Checking</div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Extension Toggle Switch */}
          <button
            type="button"
            onClick={toggleExtension}
            title={isExtensionEnabled ? 'Disable AIFA Extension' : 'Enable AIFA Extension'}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-semibold ${
              isExtensionEnabled
                ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{isExtensionEnabled ? 'ON' : 'OFF'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Account Connection Status Strip */}
      <div className="px-4 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
        {userProfile.isConnected ? (
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-medium text-slate-700 truncate">{userProfile.name}</span>
            <span className="text-[10px] text-slate-400 font-mono truncate">
              ({userProfile.email})
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-rose-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
            <span>Account Disconnected</span>
          </div>
        )}

        <div className="flex items-center gap-1">
          {userProfile.isConnected ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                setSettingsModalOpen(true);
              }}
              title="Settings"
              className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onClose();
                setSignInModalOpen(true);
              }}
              className="px-2 py-0.5 rounded bg-rose-50 text-[#D93043] hover:bg-rose-100 font-semibold text-[10px] flex items-center gap-1 cursor-pointer"
            >
              <LogIn className="w-3 h-3" />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Contextual Status Card */}
        {!isExtensionEnabled ? (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-slate-600">Extension is Paused</div>
            <div className="text-[11px] text-slate-500">
              Click the power switch above to resume automatic article and social post detection.
            </div>
          </div>
        ) : isDashboard ? (
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Sebenarnya.my Dashboard Active</span>
            </div>
            <p className="text-[11px] text-teal-700 leading-snug">
              You are currently viewing the official fact-checking management dashboard.
            </p>
          </div>
        ) : detectedSocialPost ? (
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                Social Post Detected
              </span>
              <span className="text-[10px] text-slate-500">{detectedSocialPost.platform}</span>
            </div>

            <div className="text-xs font-medium text-slate-800 line-clamp-2">
              "{detectedSocialPost.caption}"
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                triggerVerification(detectedSocialPost);
              }}
              className="w-full py-2 bg-[#D93043] hover:bg-[#B72435] text-white rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Verify This Post with AIFA</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : detectedArticle ? (
          <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                News Article Detected
              </span>
              <span className="text-[10px] text-slate-500">Malaysia News Daily</span>
            </div>

            <div className="text-xs font-bold text-slate-900 line-clamp-2">
              {detectedArticle.title}
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                triggerVerification();
              }}
              className="w-full py-2 bg-[#D93043] hover:bg-[#B72435] text-white rounded-lg font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Verify Full Article</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-1">
            <div className="text-xs font-bold text-slate-700">Ready to Detect Content</div>
            <p className="text-[11px] text-slate-500 leading-snug">
              Hover your cursor over any news story or social media post to trigger instant verification.
            </p>
          </div>
        )}

        {/* Recent Verifications Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Recent Verifications
            </div>
            <button
              type="button"
              onClick={() => handleOpenDashboard('history')}
              className="text-[11px] font-semibold text-[#D93043] hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {verificationHistory.length === 0 ? (
            <div className="p-3 text-center text-xs text-slate-400 bg-slate-50 rounded-lg">
              No recent verifications yet.
            </div>
          ) : (
            <div className="space-y-1.5">
              {verificationHistory.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleOpenDashboard('history')}
                  className="p-2.5 rounded-lg border border-slate-200 hover:border-rose-200 hover:bg-rose-50/30 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    {getAssessmentBadge(item.overallAssessment)}
                    <span className="text-[10px] text-slate-400">{item.verifiedAt}</span>
                  </div>
                  <div className="text-xs font-semibold text-slate-800 group-hover:text-[#D93043] transition-colors line-clamp-1">
                    {item.headline}
                  </div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">
                    {item.platformName} • {item.claimsCount} claims checked
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Dashboard CTA */}
        <button
          type="button"
          onClick={() => handleOpenDashboard('overview')}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-between cursor-pointer shadow"
        >
          <div className="flex items-center gap-2">
            <span>🛡️</span>
            <span>Open Sebenarnya.my Dashboard</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
        </button>
      </div>

      {/* Extension Footer */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <button
          type="button"
          onClick={() => {
            onClose();
            openOnboarding();
          }}
          className="hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Tour</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onClose();
            setSettingsModalOpen(true);
          }}
          className="hover:text-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>

        <span className="text-[10px] text-slate-400">Sebenarnya.my</span>
      </div>
    </div>
  );
};
