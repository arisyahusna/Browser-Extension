import React from 'react';
import {
  Bell,
  ChartColumn,
  FileSearch,
  History,
  HelpCircle,
  LayoutDashboard,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { DashboardNavigate, DashboardTab } from '../../dashboard/dashboardTypes';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onNavigate: DashboardNavigate;
}

interface NavItem {
  tab: DashboardTab;
  label: string;
  ariaLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  hasBadge?: boolean;
}

// The whole sidebar is a `group`: hovering it (or reaching it by keyboard) expands every
// button from a 44px icon circle into a pill showing its label. The pills are
// `w-max` inside a fixed-width aside, so they overlay the page instead of
// pushing the content sideways.
const pill =
  'w-max bg-[#2A2A2A] rounded-[28px] p-1.5 flex flex-col gap-2.5 transition-shadow duration-200 group-hover:shadow-lg group-has-[:focus-visible]:shadow-lg';
const navButton =
  'relative w-full h-11 pl-3 pr-3 rounded-full flex items-center text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#9DB2E3] group-hover:pr-5 group-has-[:focus-visible]:pr-5';
const idleButton = 'bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]';
const activeButton = 'bg-[#4A4A4A] text-white';
const labelText =
  'whitespace-nowrap overflow-hidden max-w-0 opacity-0 ml-0 transition-all duration-200 ease-out group-hover:max-w-[12rem] group-hover:opacity-100 group-hover:ml-3 group-has-[:focus-visible]:max-w-[12rem] group-has-[:focus-visible]:opacity-100 group-has-[:focus-visible]:ml-3 motion-reduce:transition-none';

const ButtonContent: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  hasBadge?: boolean;
}> = ({ icon: Icon, label, hasBadge }) => (
  <>
    <span className="relative shrink-0">
      <Icon className="w-5 h-5" />
      {hasBadge && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#D93043] ring-2 ring-[#2A2A2A]"
        />
      )}
    </span>
    <span aria-hidden="true" className={labelText}>
      {label}
    </span>
  </>
);

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeTab, onNavigate }) => {
  const { unreadNotificationCount, openOnboarding } = useAifa();

  const items: NavItem[] = [
    { tab: 'overview', label: 'Overview', ariaLabel: 'Overview', icon: LayoutDashboard },
    { tab: 'analytics', label: 'Analytics', ariaLabel: 'Analytics', icon: ChartColumn },
    { tab: 'history', label: 'History', ariaLabel: 'History', icon: History },
    {
      tab: 'requests',
      label: 'Fact-Check Inquiries',
      ariaLabel: 'Fact-Check Inquiries',
      icon: FileSearch,
    },
    {
      tab: 'notifications',
      label: 'Notifications',
      ariaLabel:
        unreadNotificationCount > 0
          ? `Notifications, ${unreadNotificationCount} unread`
          : 'Notifications',
      icon: Bell,
      hasBadge: unreadNotificationCount > 0,
    },
  ];

  return (
    <aside
      aria-label="Dashboard navigation"
      className="group relative z-20 shrink-0 w-[72px] sm:w-[80px] h-full pl-4 sm:pl-6 pt-2 pb-6 flex flex-col items-start justify-between gap-4"
    >
      {/* Main navigation pill */}
      <nav className={pill}>
        <ul className="flex flex-col gap-2.5">
          {items.map(({ tab, label, ariaLabel, icon, hasBadge }) => {
            const isActive = activeTab === tab;
            return (
              <li key={tab}>
                <button
                  type="button"
                  onClick={() => onNavigate(tab)}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={ariaLabel}
                  className={`${navButton} ${isActive ? activeButton : idleButton}`}
                >
                  <ButtonContent icon={icon} label={label} hasBadge={hasBadge} />
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Guide pill */}
      <div className={pill}>
        <button
          type="button"
          onClick={openOnboarding}
          aria-label="Guide"
          className={`${navButton} ${idleButton}`}
        >
          <ButtonContent icon={HelpCircle} label="Guide" />
        </button>
      </div>
    </aside>
  );
};
