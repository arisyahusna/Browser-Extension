import React from 'react';
import { ExtensionSurface } from '../extension/shared/ExtensionSurface';
import { DashboardOverview } from './DashboardOverview';
import { DashboardHistory } from './DashboardHistory';
import { DashboardAnalytics } from './DashboardAnalytics';
import { DashboardRequests } from './DashboardRequests';
import { DashboardNotifications } from './DashboardNotifications';
import { DashboardSettings } from './DashboardSettings';
import { DashboardNavigate, DashboardTab } from './dashboardTypes';

interface DashboardMainProps {
  activeTab: DashboardTab;
  /** Verdict filter History opens with. */
  historyFilter: string;
  onNavigate: DashboardNavigate;
  onOpenHistory: (assessmentFilter: string) => void;
}

/** The dashboard's content column: the active page and the footer. */
export const DashboardMain: React.FC<DashboardMainProps> = ({ activeTab, historyFilter, onNavigate, onOpenHistory }) => (
  <ExtensionSurface density="compact">
    <main className="flex-1 w-full px-page-x pt-8 pb-32 font-sans text-body-sm text-foreground">
      {activeTab === 'overview' && <DashboardOverview onSwitchTab={onNavigate} onOpenHistory={onOpenHistory} />}
      {activeTab === 'analytics' && <DashboardAnalytics onSwitchTab={onNavigate} onOpenHistory={onOpenHistory} />}
      {activeTab === 'history' && <DashboardHistory key={historyFilter} initialAssessmentFilter={historyFilter} />}
      {activeTab === 'requests' && <DashboardRequests />}
      {activeTab === 'notifications' && <DashboardNotifications onSwitchTab={onNavigate} />}
      {activeTab === 'settings' && <DashboardSettings />}
    </main>

    {/* Footer */}
    <footer className="px-page-x py-20 font-sans text-caption text-muted-foreground flex flex-row sm:flex-col items-center justify-between gap-8">
      <div className="flex items-center gap-8">
        <span className="text-foreground">Sebenarnya.my</span>
        <span aria-hidden="true">•</span>
        <span>AIFA Interactive Client Simulation Prototype (Stage 5)</span>
      </div>
      <div>Sebenarnya.my Fact-Checking Initiative • Strictly for client demonstration</div>
    </footer>
  </ExtensionSurface>
);
