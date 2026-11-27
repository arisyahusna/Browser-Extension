export type DashboardTab = 'overview' | 'analytics' | 'history' | 'requests' | 'notifications' | 'settings';

/** Section anchors inside DashboardSettings that the account menu can jump to. */
export const DASHBOARD_SECTION_IDS = {
  account: 'dashboard-account-section',
  preferences: 'dashboard-preferences-section',
} as const;

export type DashboardNavigate = (tab: DashboardTab, sectionId?: string) => void;
