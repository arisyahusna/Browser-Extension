import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { useAifa } from '../../context/AifaContext';
import { DashboardLogin } from '../../dashboard/DashboardLogin';
import { DashboardHeader } from '../../dashboard/DashboardHeader';
import { DashboardMain } from '../../dashboard/DashboardMain';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTab } from '../../dashboard/dashboardTypes';

export const SebenarnyaDashboard: React.FC = () => {
  const { currentLocation } = useBrowser();
  const { isSignedIn } = useAifa();

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
  if (!isSignedIn) {
    return <DashboardLogin />;
  }

  // Layout shell only. The header and the pages use the Sebenarnya design system (src/dashboard,
  // each wrapped in its own .sb-extension scope); the sidebar keeps its own design, so it stays
  // outside that scope. The page background reads the design-system token.
  return (
    <div className="h-full min-h-0 bg-[var(--color-muted)] text-[#2A2A2A] flex flex-col font-['Montserrat',sans-serif] antialiased select-text">
      {/* 1. Top navigation bar */}
      <DashboardHeader activeTab={activeTab} onNavigate={navigateTo} />

      <div className="flex-1 min-h-0 flex">
        {/* 2. Left sidebar navigation */}
        <DashboardSidebar activeTab={activeTab} onNavigate={navigateTo} />

        {/* 3. Scrollable content column */}
        <div ref={mainRef} className="flex-1 min-w-0 overflow-y-auto flex flex-col">
          <DashboardMain
            activeTab={activeTab}
            historyFilter={historyFilter}
            onNavigate={navigateTo}
            onOpenHistory={openHistoryFiltered}
          />
        </div>
      </div>
    </div>
  );
};
