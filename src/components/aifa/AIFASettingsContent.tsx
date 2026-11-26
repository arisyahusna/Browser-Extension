import React, { useState } from 'react';
import { RotateCcw, BookOpen, Info, Check, LogOut, LogIn } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

const sectionTitle = 'text-[15px] font-semibold text-[#2A2A2A] px-1';
const secondaryButton =
  'h-9 px-4 rounded-full border border-[#2A2A2A]/15 text-[#2A2A2A] font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0';

interface AIFASettingsContentProps {
  /** Open the user guide (as a modal, or as a view inside the popup). */
  onOpenGuide: () => void;
  /** Start connecting a disconnected account. */
  onConnect: () => void;
}

/** Settings sections shared by the Settings modal and the toolbar popup's Settings view. */
export const AIFASettingsContent: React.FC<AIFASettingsContentProps> = ({ onOpenGuide, onConnect }) => {
  const {
    userProfile,
    disconnectAccount,
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
    <div className="space-y-5 text-xs text-[#5C5A56]">
      {/* Connected account */}
      <div className="space-y-2.5">
        <h3 className={sectionTitle}>Connected Account</h3>
        {/* Wraps the button under the details when narrow (toolbar popup); one row in the modal. */}
        <div className="p-4 rounded-[22px] bg-white flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1 basis-[180px]">
            <div className="w-11 h-11 rounded-full bg-[#DFE6F5] flex items-center justify-center text-lg shrink-0">
              {userProfile.avatar || '👤'}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-[#2A2A2A] truncate">{userProfile.name}</div>
              <div className="text-[#6F6D69] truncate">{userProfile.email}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    userProfile.isConnected ? 'bg-emerald-500' : 'bg-[#6F6D69]/40'
                  }`}
                />
                <span className="text-[11px] text-[#5C5A56] font-medium truncate">
                  {userProfile.isConnected ? 'Connected to Sebenarnya.my' : 'Disconnected'}
                </span>
              </div>
            </div>
          </div>

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
              onClick={onConnect}
              className="h-9 px-4 rounded-full bg-[#2A2A2A] text-white hover:bg-black font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification preferences */}
      <div className="space-y-2.5">
        <h3 className={sectionTitle}>Notification Preferences</h3>
        <div className="rounded-[22px] bg-white px-4 divide-y divide-[#E0DED9]">
          <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-[#2A2A2A]">Browser In-App Alerts</div>
              <div className="text-[11px] text-[#6F6D69]">
                Display toast banner when a fact-check review status changes
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationPreferences.browserNotifications}
              onChange={(e) => updateNotificationPreferences({ browserNotifications: e.target.checked })}
              className="w-[18px] h-[18px] shrink-0 accent-[#2A2A2A] cursor-pointer"
            />
          </label>

          <label className="py-4 flex items-center justify-between gap-4 cursor-pointer">
            <div>
              <div className="font-semibold text-[#2A2A2A]">Simulated Email Notifications</div>
              <div className="text-[11px] text-[#6F6D69]">
                Allow viewing email updates from no-reply@sebenarnya.my
              </div>
            </div>
            <input
              type="checkbox"
              checked={notificationPreferences.emailNotifications}
              onChange={(e) => updateNotificationPreferences({ emailNotifications: e.target.checked })}
              className="w-[18px] h-[18px] shrink-0 accent-[#2A2A2A] cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* User guide */}
      <div className="space-y-2.5">
        <h3 className={sectionTitle}>User Guide</h3>
        <div className="p-4 rounded-[22px] bg-white flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="font-semibold text-[#2A2A2A]">AIFA User Guide</div>
            <div className="text-[11px] text-[#6F6D69]">Revisit the 3-step feature walkthrough</div>
          </div>
          <button type="button" onClick={onOpenGuide} className={`${secondaryButton} hover:bg-[#E2E4EA]`}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Replay</span>
          </button>
        </div>
      </div>

      {/* Demo data */}
      <div className="space-y-2.5">
        <h3 className={sectionTitle}>Demo Data & Storage</h3>
        <div className="rounded-[22px] p-4 bg-white space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-[#2A2A2A]">Clear Verification History</div>
              <div className="text-[11px] text-[#6F6D69]">Removes all locally saved verified claim records</div>
            </div>
            <button
              type="button"
              onClick={clearHistory}
              className={`${secondaryButton} hover:bg-[#F7DEDB] hover:text-[#9B3D36] hover:border-transparent`}
            >
              Clear
            </button>
          </div>

          <div className="border-t border-[#E0DED9] pt-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="font-semibold text-[#2A2A2A]">Clear Submitted Requests</div>
              <div className="text-[11px] text-[#6F6D69]">Removes custom requests and reverts to sample</div>
            </div>
            <button
              type="button"
              onClick={clearDemoRequests}
              className={`${secondaryButton} hover:bg-[#F7DEDB] hover:text-[#9B3D36] hover:border-transparent`}
            >
              Clear
            </button>
          </div>

          <div className="border-t border-[#E0DED9] pt-4">
            {confirmReset ? (
              <div className="bg-[#F7DEDB] p-4 rounded-[20px] space-y-2">
                <div className="text-xs font-semibold text-[#9B3D36]">Reset all demo state to defaults?</div>
                <div className="text-[11px] text-[#9B3D36]/90">
                  This will reset history, notifications, and request status to initial demo data.
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="h-9 px-4 bg-[#9B3D36] text-white rounded-full font-semibold text-xs hover:bg-[#82322C] transition-colors cursor-pointer"
                  >
                    Yes, reset everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmReset(false)}
                    className="h-9 px-4 text-[#2A2A2A] font-medium hover:bg-[#E2E4EA] rounded-full text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="w-full h-11 bg-white hover:bg-[#F7DEDB] text-[#9B3D36] border border-[#E9928B]/50 rounded-full font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Demonstration Data</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {saveToast && (
        <div role="status" className="px-4 py-3 bg-[#DCEFE2] text-[#2F6B45] text-xs font-medium rounded-full flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>Demo state reset to initial defaults.</span>
        </div>
      )}

      {/* About */}
      <div className="flex items-start gap-2 pt-3 border-t border-[#E0DED9] text-[11px] text-[#6F6D69]">
        <Info className="w-4 h-4 shrink-0 mt-0.5" />
        <span>
          AIFA Browser Extension Demonstration Mockup. Associated with Sebenarnya.my. All analysis results and
          reviewer submissions are for client visualization only.
        </span>
      </div>
    </div>
  );
};
