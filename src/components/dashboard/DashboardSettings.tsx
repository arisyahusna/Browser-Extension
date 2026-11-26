import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { DASHBOARD_SECTION_IDS } from './dashboardTypes';

const cardClass = 'bg-white rounded-[28px] border border-[#E0DED9] p-5 sm:p-6 space-y-4';
const cardTitleClass = 'text-[15px] font-semibold text-[#2A2A2A]';
const secondaryButton =
  'h-9 px-4 rounded-full bg-white border border-[#E0DED9] text-[#2A2A2A] font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer';

export const DashboardSettings: React.FC = () => {
  const {
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

  const handleResetData = () => {
    resetAllDemoData();
    setConfirmReset(false);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="pt-2 pb-1">
        <h2 className="text-[28px] leading-tight font-bold text-[#2A2A2A] tracking-tight">
          Account & Extension Preferences
        </h2>
        <p className="text-sm text-[#6F6D69] mt-1">
          Configure notification preferences, manage account connectivity, and control client simulation state.
        </p>
      </div>

      {/* Profile Card */}
      <div id={DASHBOARD_SECTION_IDS.account} className={`${cardClass} scroll-mt-6`}>
        <h3 className={cardTitleClass}>Connected Profile</h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-[22px] bg-[#F4F3F1]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-[#DFE6F5] flex items-center justify-center text-2xl">
              {userProfile.avatar || '👤'}
            </div>
            <div>
              <div className="text-sm font-semibold text-[#2A2A2A]">{userProfile.name}</div>
              <div className="text-xs text-[#6F6D69]">{userProfile.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    userProfile.isConnected ? 'bg-emerald-500' : 'bg-[#6F6D69]/40'
                  }`}
                />
                <span className="text-[11px] text-[#5C5A56] font-medium">
                  {userProfile.isConnected
                    ? 'Connected to Sebenarnya.my Cloud Archive'
                    : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

          <div>
            {userProfile.isConnected ? (
              <button
                type="button"
                onClick={disconnectAccount}
                className={`${secondaryButton} hover:bg-[#F7DEDB] hover:text-[#9B3D36] hover:border-transparent`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSignInModalOpen(true)}
                className="h-9 px-4 rounded-full bg-[#2A2A2A] text-white hover:bg-black font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connect Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div id={DASHBOARD_SECTION_IDS.preferences} className={`${cardClass} scroll-mt-6`}>
        <h3 className={cardTitleClass}>Notification Preferences</h3>
        <div className="rounded-[22px] bg-[#F4F3F1] px-4 divide-y divide-[#E0DED9]">
          <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-[#2A2A2A] text-xs">
                In-Browser Status Alerts
              </div>
              <div className="text-[11px] text-[#6F6D69]">
                Display floating toast notifications when fact-check reviews are published
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
              className="w-[18px] h-[18px] shrink-0 accent-[#2A2A2A] cursor-pointer"
            />
          </label>

          <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-[#2A2A2A] text-xs">
                Simulated Email Updates
              </div>
              <div className="text-[11px] text-[#6F6D69]">
                Enable interactive email previews dispatched by no-reply@sebenarnya.my
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
              className="w-[18px] h-[18px] shrink-0 accent-[#2A2A2A] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Onboarding Guide */}
      <div className={cardClass}>
        <h3 className={cardTitleClass}>Tutorial & Help</h3>
        <div className="flex items-center justify-between gap-4 p-4 rounded-[22px] bg-[#F4F3F1]">
          <div>
            <div className="text-xs font-semibold text-[#2A2A2A]">AIFA Browser Assistant Tour</div>
            <div className="text-[11px] text-[#6F6D69]">
              Launch the interactive 3-step walkthrough guide
            </div>
          </div>
          <button
            type="button"
            onClick={openOnboarding}
            className={`${secondaryButton} shrink-0 hover:bg-[#E2E4EA]`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Replay Tour</span>
          </button>
        </div>
      </div>

      {/* Demo Controls & Data Reset */}
      <div className={cardClass}>
        <h3 className={cardTitleClass}>Demo State Management</h3>
        <div className="p-4 rounded-[22px] bg-[#F4F3F1] space-y-4 text-xs">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-[#2A2A2A]">Clear Verification History</div>
              <div className="text-[11px] text-[#6F6D69]">
                Removes all stored verification findings
              </div>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className={`${secondaryButton} shrink-0 font-medium hover:bg-[#F7DEDB] hover:text-[#9B3D36] hover:border-transparent`}
            >
              Clear History
            </button>
          </div>

          <div className="border-t border-[#E0DED9] pt-4 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-[#2A2A2A]">Clear Demo Requests</div>
              <div className="text-[11px] text-[#6F6D69]">
                Reverts inquiries to initial sample inquiry
              </div>
            </div>
            <button
              type="button"
              onClick={clearDemoRequests}
              className={`${secondaryButton} shrink-0 font-medium hover:bg-[#F7DEDB] hover:text-[#9B3D36] hover:border-transparent`}
            >
              Clear Requests
            </button>
          </div>

          <div className="border-t border-[#E0DED9] pt-4">
            {confirmReset ? (
              <div className="bg-[#F7DEDB] p-4 rounded-[20px] space-y-2">
                <div className="font-semibold text-[#9B3D36]">
                  Reset all simulation data to initial state?
                </div>
                <div className="text-[11px] text-[#9B3D36]/90">
                  This will reset all history records, requests, and notifications to default sample values.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="h-9 px-4 bg-[#9B3D36] text-white rounded-full font-semibold hover:bg-[#82322C] transition-colors cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="h-9 px-4 text-[#2A2A2A] font-medium hover:bg-[#E2E4EA] rounded-full transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full h-11 bg-white hover:bg-[#F7DEDB] text-[#9B3D36] border border-[#E9928B]/50 rounded-full font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Demo Data to Defaults</span>
              </button>
            )}
          </div>
        </div>

        {saveToast && (
          <div className="p-3.5 bg-[#DFE6F5] text-[#3F5C9E] text-xs font-medium rounded-full flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>Demo state restored to original defaults.</span>
          </div>
        )}
      </div>
    </div>
  );
};
