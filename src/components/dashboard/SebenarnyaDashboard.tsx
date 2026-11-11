import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  History,
  FileQuestion,
  Bell,
  Settings,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';
import { DemoControlsBar } from './DemoControlsBar';
import { DashboardOverview } from './DashboardOverview';
import { DashboardHistory } from './DashboardHistory';
import { DashboardRequests } from './DashboardRequests';
import { DashboardNotifications } from './DashboardNotifications';
import { DashboardSettings } from './DashboardSettings';

export const SebenarnyaDashboard: React.FC = () => {
  const {
    userProfile,
    verificationHistory,
    submittedRequests,
    unreadNotificationCount,
    setSignInModalOpen,
  } = useAifa();

  const { currentLocation } = useBrowser();

  // Tab state
  const [activeTab, setActiveTab] = useState<
    'overview' | 'history' | 'requests' | 'notifications' | 'settings'
  >('overview');

  // If URL has a hash like #requests or #history, activate that tab
  useEffect(() => {
    if (currentLocation.customUrl) {
      if (currentLocation.customUrl.includes('#requests')) {
        setActiveTab('requests');
      } else if (currentLocation.customUrl.includes('#history')) {
        setActiveTab('history');
      } else if (currentLocation.customUrl.includes('#notifications')) {
        setActiveTab('notifications');
      } else if (currentLocation.customUrl.includes('#settings')) {
        setActiveTab('settings');
      }
    }
  }, [currentLocation.customUrl]);

  return (
    <div className="min-h-full bg-[#F8F9FA] text-slate-800 flex flex-col font-sans select-text">
      {/* 1. Official Sebenarnya.my Top Portal Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Platform Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B72435] to-[#D93043] text-white flex items-center justify-center text-xl font-black shadow-sm">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  SEBENARNYA.MY
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-100 text-[#D93043]">
                  AIFA Assistant Portal
                </span>
              </div>
              <div className="text-[11px] text-slate-500 font-medium italic">
                "Tidak Pasti, Jangan Kongsi" — Official Malaysian Fact-Checking System
              </div>
            </div>
          </div>

          {/* User Account Chip */}
          <div className="flex items-center gap-3">
            {userProfile.isConnected ? (
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-7 h-7 rounded-full bg-rose-100 border border-rose-200 flex items-center justify-center text-xs">
                  {userProfile.avatar || '👤'}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-slate-800 leading-tight">
                    {userProfile.name}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-medium leading-none flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </div>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSignInModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#D93043] text-white text-xs font-bold hover:bg-[#B72435] transition-all cursor-pointer shadow-sm"
              >
                Connect Account
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. Interactive Presenter Simulation Controls Bar */}
      <DemoControlsBar />

      {/* 3. Dashboard Navigation Tabs Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-10 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar">
            {/* Overview */}
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`py-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'overview'
                  ? 'border-[#D93043] text-[#D93043]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Overview</span>
            </button>

            {/* History */}
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`py-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'history'
                  ? 'border-[#D93043] text-[#D93043]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Verification History</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
                {verificationHistory.length}
              </span>
            </button>

            {/* Fact-Check Requests */}
            <button
              type="button"
              onClick={() => setActiveTab('requests')}
              className={`py-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'requests'
                  ? 'border-[#D93043] text-[#D93043]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <FileQuestion className="w-4 h-4" />
              <span>Fact-Check Inquiries</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-600 font-mono">
                {submittedRequests.length}
              </span>
            </button>

            {/* Notifications */}
            <button
              type="button"
              onClick={() => setActiveTab('notifications')}
              className={`py-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'notifications'
                  ? 'border-[#D93043] text-[#D93043]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
              {unreadNotificationCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-mono font-bold">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Settings */}
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`py-3.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer shrink-0 ${
                activeTab === 'settings'
                  ? 'border-[#D93043] text-[#D93043]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Preferences</span>
            </button>
          </nav>
        </div>
      </div>

      {/* 4. Tab Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        {activeTab === 'overview' && <DashboardOverview onSwitchTab={setActiveTab} />}
        {activeTab === 'history' && <DashboardHistory />}
        {activeTab === 'requests' && <DashboardRequests />}
        {activeTab === 'notifications' && <DashboardNotifications onSwitchTab={setActiveTab} />}
        {activeTab === 'settings' && <DashboardSettings />}
      </main>

      {/* 5. Sebenarnya.my Official Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">SEBENARNYA.MY</span>
            <span>•</span>
            <span>AIFA Interactive Client Simulation Prototype (Stage 5)</span>
          </div>
          <div className="text-[11px] text-slate-400">
            Sebenarnya.my Fact-Checking Initiative • Strictly for client demonstration
          </div>
        </div>
      </footer>
    </div>
  );
};
