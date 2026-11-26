import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { useAifa } from '../../context/AifaContext';
import { DashboardLogin } from './DashboardLogin';
import { DashboardOverview } from './DashboardOverview';
import { DashboardHistory } from './DashboardHistory';
import { DashboardAnalytics } from './DashboardAnalytics';
import { DashboardRequests } from './DashboardRequests';
import { DashboardNotifications } from './DashboardNotifications';
import { DashboardSettings } from './DashboardSettings';
import { DashboardHeader } from './DashboardHeader';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTab } from './dashboardTypes';

export const SebenarnyaDashboard: React.FC = () => {
  const { currentLocation } = useBrowser();
  const { isDashboardSignedIn, userProfile } = useAifa();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  // Verdict filter History opens with; set by the Overview stat cards, reset by normal navigation.
  const [historyFilter, setHistoryFilter] = useState<string>('all');
  const mainRef = useRef<HTMLDivElement>(null);

  // If URL has a hash like #requests or #history, activate that tab
  useEffect(() => {
    if (currentLocation.customUrl) {
      if (currentLocation.customUrl.includes('#requests')) {
        setActiveTab('requests');
      } else if (currentLocation.customUrl.includes('#analytics')) {
        setActiveTab('analytics');
      } else if (currentLocation.customUrl.includes('#history')) {
        setActiveTab('history');
      } else if (currentLocation.customUrl.includes('#notifications')) {
        setActiveTab('notifications');
      } else if (currentLocation.customUrl.includes('#settings')) {
        setActiveTab('settings');
      }
    }
  }, [currentLocation.customUrl]);

  // Switch page; optionally jump to a section on that page, otherwise scroll to top.
  const navigateTo = useCallback((tab: DashboardTab, sectionId?: string) => {
    setActiveTab(tab);
    setHistoryFilter('all');
    window.setTimeout(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        mainRef.current?.scrollTo({ top: 0 });
      }
    }, 0);
  }, []);

  const openHistoryFiltered = useCallback(
    (assessmentFilter: string) => {
      navigateTo('history');
      setHistoryFilter(assessmentFilter);
    },
    [navigateTo]
  );

  // Signed out (or the account was disconnected from the extension): show the login page.
  if (!isDashboardSignedIn || !userProfile.isConnected) {
    return <DashboardLogin />;
  }

  return (
    <div className="h-full min-h-0 bg-[#eeeff3] text-[#2A2A2A] flex flex-col font-['Montserrat',sans-serif] antialiased select-text">
      {/* 1. Top navigation bar */}
      <DashboardHeader activeTab={activeTab} onNavigate={navigateTo} />

      <div className="flex-1 min-h-0 flex">
        {/* 2. Left sidebar navigation */}
        <DashboardSidebar activeTab={activeTab} onNavigate={navigateTo} />

        {/* 3. Scrollable content column */}
        <div ref={mainRef} className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 lg:pt-4">
            {activeTab === 'overview' && (
              <DashboardOverview onSwitchTab={navigateTo} onOpenHistory={openHistoryFiltered} />
            )}
            {activeTab === 'analytics' && (
              <DashboardAnalytics onSwitchTab={navigateTo} onOpenHistory={openHistoryFiltered} />
            )}
            {activeTab === 'history' && (
              <DashboardHistory key={historyFilter} initialAssessmentFilter={historyFilter} />
            )}
            {activeTab === 'requests' && <DashboardRequests />}
            {activeTab === 'notifications' && <DashboardNotifications onSwitchTab={navigateTo} />}
            {activeTab === 'settings' && <DashboardSettings />}
          </main>

          {/* Footer */}
          <footer className="py-5 text-xs text-[#6F6D69]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#2A2A2A]">Sebenarnya.my</span>
                <span aria-hidden="true">•</span>
                <span>AIFA Interactive Client Simulation Prototype (Stage 5)</span>
              </div>
              <div className="text-[11px] text-[#6F6D69]">
                Sebenarnya.my Fact-Checking Initiative • Strictly for client demonstration
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};
