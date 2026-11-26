import React from 'react';
import { X, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFASignInModal: React.FC = () => {
  const { isSignInModalOpen, setSignInModalOpen, connectAccount, isConnectingAccount } = useAifa();

  if (!isSignInModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-['Montserrat',sans-serif] antialiased">
      <div
        className="w-full max-w-md bg-[#EEEFF3] rounded-[32px] shadow-[0_32px_64px_-16px_rgba(42,42,42,0.4)] border border-[#E0DED9] overflow-hidden flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signin-modal-title"
      >
        {/* Header with decorative badge */}
        <div className="relative m-2 mb-0 rounded-[26px] bg-[#2A2A2A] p-6 text-white">
          <button
            type="button"
            onClick={() => setSignInModalOpen(false)}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border-[1.5px] border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5 mb-3">
            <img
              src="/images/sebenarnya-icon.png"
              alt=""
              className="w-9 h-9 object-contain rounded-lg bg-white p-0.5"
              draggable={false}
            />
            <div className="text-xs font-semibold text-white/70">AIFA & Sebenarnya.my</div>
          </div>

          <h2 id="signin-modal-title" className="text-xl font-bold tracking-tight text-white">
            Connect AIFA Assistant
          </h2>
          <p className="text-xs text-white/70 mt-1.5 leading-relaxed">
            Link your browser extension to Sebenarnya.my to sync your verification history, track custom fact-check requests, and receive reviewer notifications.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Features Checklist */}
          <div className="space-y-2.5 text-xs text-[#5C5A56]">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3A8656] shrink-0 mt-0.5" />
              <span>Real-time claim verification on news articles and social media.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3A8656] shrink-0 mt-0.5" />
              <span>Submit unverified claims for official Sebenarnya.my review.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3A8656] shrink-0 mt-0.5" />
              <span>Personal dashboard with searchable history and status updates.</span>
            </div>
          </div>

          {/* Account Picker simulation */}
          <div className="space-y-2">
            <div className="text-[13px] font-semibold text-[#2A2A2A] px-1">Select Demo Account</div>
            <div className="flex items-center gap-3.5 p-3 rounded-[22px] bg-white">
              <div className="w-11 h-11 rounded-full bg-[#DFE6F5] flex items-center justify-center text-xl">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#2A2A2A] truncate">AIFA Demo User</div>
                <div className="text-xs text-[#6F6D69] truncate">demo@example.com</div>
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#F4F3F1] text-[#5C5A56]">
                Default
              </span>
            </div>
          </div>

          {/* Action button */}
          <button
            type="button"
            onClick={connectAccount}
            disabled={isConnectingAccount}
            className="w-full h-12 flex items-center justify-center gap-2.5 px-4 rounded-full bg-[#2A2A2A] hover:bg-black text-white font-semibold text-sm transition-colors cursor-pointer disabled:opacity-60"
          >
            {isConnectingAccount ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connecting Sebenarnya.my...</span>
              </>
            ) : (
              <>
                {/* Google SVG G-logo */}
                <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                </span>
                <span>Continue as AIFA Demo User</span>
              </>
            )}
          </button>

          {/* Demo notice */}
          <div className="flex items-center gap-1.5 justify-center text-[11px] text-[#6F6D69]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Interactive client demonstration — simulated connection only.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
