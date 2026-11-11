import React, { useState } from 'react';
import {
  RotateCcw,
  BookOpen,
  Check,
  LogOut,
  LogIn,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

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
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Account & Extension Preferences
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure notification preferences, manage account connectivity, and control client simulation state.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Connected Profile
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-2xl">
              {userProfile.avatar || '👤'}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{userProfile.name}</div>
              <div className="text-xs text-slate-500">{userProfile.email}</div>
              <div className="flex items-center gap-1.5 mt-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    userProfile.isConnected ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
                <span className="text-[11px] text-slate-600 font-medium">
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
                className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Disconnect</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSignInModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#D93043] text-white hover:bg-[#B72435] font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Connect Account</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Notification Preferences
        </h3>
        <div className="space-y-3 divide-y divide-slate-100">
          <label className="pt-2 flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-semibold text-slate-800 text-xs">
                In-Browser Status Alerts
              </div>
              <div className="text-[11px] text-slate-500">
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
              className="w-4 h-4 text-[#D93043] rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
            />
          </label>

          <label className="pt-3 flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-semibold text-slate-800 text-xs">
                Simulated Email Updates
              </div>
              <div className="text-[11px] text-slate-500">
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
              className="w-4 h-4 text-[#D93043] rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Onboarding Guide */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Tutorial & Help
        </h3>
        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <div className="text-xs font-bold text-slate-800">AIFA Browser Assistant Tour</div>
            <div className="text-[11px] text-slate-500">
              Launch the interactive 3-step walkthrough guide
            </div>
          </div>
          <button
            type="button"
            onClick={openOnboarding}
            className="px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Replay Tour</span>
          </button>
        </div>
      </div>

      {/* Demo Controls & Data Reset */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Demo State Management
        </h3>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Clear Verification History</div>
              <div className="text-[11px] text-slate-500">
                Removes all stored verification findings
              </div>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-medium transition-colors cursor-pointer"
            >
              Clear History
            </button>
          </div>

          <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
            <div>
              <div className="font-semibold text-slate-800">Clear Demo Requests</div>
              <div className="text-[11px] text-slate-500">
                Reverts inquiries to initial sample inquiry
              </div>
            </div>
            <button
              type="button"
              onClick={clearDemoRequests}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 font-medium transition-colors cursor-pointer"
            >
              Clear Requests
            </button>
          </div>

          <div className="border-t border-slate-200 pt-3">
            {confirmReset ? (
              <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl space-y-2">
                <div className="font-bold text-rose-800">
                  Reset all simulation data to initial state?
                </div>
                <div className="text-[11px] text-rose-700">
                  This will reset all history records, requests, and notifications to default sample values.
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="px-3.5 py-1.5 bg-[#D93043] text-white rounded-lg font-bold hover:bg-[#B72435] cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-xl font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Demo Data to Defaults</span>
              </button>
            )}
          </div>
        </div>

        {saveToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Demo state restored to original defaults.</span>
          </div>
        )}
      </div>
    </div>
  );
};
