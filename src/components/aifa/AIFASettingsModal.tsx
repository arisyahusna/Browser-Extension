import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  BookOpen,
  Info,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const AIFASettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setSettingsModalOpen,
    userProfile,
    disconnectAccount,
    setSignInModalOpen,
    openOnboarding,
    notificationPreferences,
    updateNotificationPreferences,
    clearHistory,
    clearDemoRequests,
    resetAllDemoData,
  } = useAifa();

  const [confirmReset, setConfirmReset] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  if (!isSettingsModalOpen) return null;

  const handleResetData = () => {
    resetAllDemoData();
    setConfirmReset(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#D93043] text-white flex items-center justify-center text-sm font-black shadow-sm">
              🛡️
            </span>
            <div>
              <h2 id="settings-modal-title" className="text-base font-bold text-slate-900">
                AIFA Extension Settings
              </h2>
              <div className="text-[11px] text-slate-500">
                Preferences, connected accounts, and demo controls
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSettingsModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
            aria-label="Close settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Content */}
        <div className="p-6 space-y-6 overflow-y-auto text-xs text-slate-700">
          {/* Section 1: Connected Account */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Connected Account
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-lg shrink-0">
                  {userProfile.avatar || '👤'}
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {userProfile.name}
                  </div>
                  <div className="text-slate-500 truncate">{userProfile.email}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        userProfile.isConnected ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                    />
                    <span className="text-[10px] text-slate-500">
                      {userProfile.isConnected ? 'Connected to Sebenarnya.my' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              {userProfile.isConnected ? (
                <button
                  type="button"
                  onClick={disconnectAccount}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSettingsModalOpen(false);
                    setSignInModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#D93043] text-white hover:bg-[#B72435] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Connect</span>
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Notification Preferences */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Notification Preferences
            </h3>
            <div className="space-y-2 border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-t-xl">
                <div>
                  <div className="font-semibold text-slate-800">Browser In-App Alerts</div>
                  <div className="text-[11px] text-slate-500">
                    Display toast banner when a fact-check review status changes
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.browserNotifications}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      browserNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-[#D93043] rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
              </label>

              <label className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-b-xl">
                <div>
                  <div className="font-semibold text-slate-800">Simulated Email Notifications</div>
                  <div className="text-[11px] text-slate-500">
                    Allow viewing email updates from no-reply@sebenarnya.my
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notificationPreferences.emailNotifications}
                  onChange={(e) =>
                    updateNotificationPreferences({
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-[#D93043] rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Tutorial & Guide */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Onboarding & Guide
            </h3>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <div className="font-semibold text-slate-800">AIFA Guided Tour</div>
                <div className="text-[11px] text-slate-500">
                  Revisit the 3-step feature walkthrough
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSettingsModalOpen(false);
                  openOnboarding();
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Replay Tour</span>
              </button>
            </div>
          </div>

          {/* Section 4: Data Management & Reset Controls */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Demo Data & Storage
            </h3>
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Clear Verification History</div>
                  <div className="text-[11px] text-slate-500">
                    Removes all locally saved verified claim records
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              </div>

              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Clear Submitted Requests</div>
                  <div className="text-[11px] text-slate-500">
                    Removes custom requests and reverts to sample
                  </div>
                </div>
                <button
                  type="button"
                  onClick={clearDemoRequests}
                  className="px-2.5 py-1 text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  Clear Requests
                </button>
              </div>

              <div className="border-t border-slate-200 pt-3">
                {confirmReset ? (
                  <div className="bg-rose-50 border border-rose-200 p-3 rounded-lg space-y-2">
                    <div className="text-xs font-bold text-rose-800">
                      Reset all demo state to defaults?
                    </div>
                    <div className="text-[11px] text-rose-700">
                      This will reset history, notifications, and request status to initial demo data.
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleResetData}
                        className="px-3 py-1 bg-[#D93043] text-white rounded font-bold text-xs hover:bg-[#B72435] cursor-pointer"
                      >
                        Yes, Reset Everything
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmReset(false)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmReset(true)}
                    className="w-full py-2 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Demonstration Data</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Feedback banner */}
          {saveToast && (
            <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Demo state successfully reset to initial defaults.</span>
            </div>
          )}

          {/* About notice */}
          <div className="flex items-start gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-400">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              AIFA Browser Extension Demonstration Mockup. Associated with Sebenarnya.my. All analysis results and reviewer submissions are for client visualization only.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={() => setSettingsModalOpen(false)}
            className="px-4 py-2 text-xs font-bold text-white bg-[#171B26] hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
