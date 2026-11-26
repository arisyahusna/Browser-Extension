import React, { useEffect, useRef, useState } from 'react';
import {
  Bell,
  BellOff,
  CheckCheck,
  ChevronDown,
  Clock,
  LogIn,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { NotificationItem } from '../../types/aifa';
import { DASHBOARD_SECTION_IDS, DashboardNavigate, DashboardTab } from './dashboardTypes';

interface DashboardHeaderProps {
  activeTab: DashboardTab;
  onNavigate: DashboardNavigate;
}

type OpenMenu = 'notifications' | 'account' | null;

const DROPDOWN_PREVIEW_LIMIT = 5;

const getInitials = (name: string) => {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return initials || 'U';
};

const NotificationTypeIcon: React.FC<{ type: NotificationItem['type'] }> = ({ type }) => {
  const styles =
    type === 'request_completed'
      ? 'bg-[#DCEFE2] text-[#2F6B45]'
      : type === 'request_review'
      ? 'bg-[#F4EBCB] text-[#715C1C]'
      : 'bg-[#E8E6E2] text-[#5C5A56]';

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${styles}`}>
      {type === 'request_completed' ? (
        <ShieldCheck className="w-4 h-4" />
      ) : type === 'request_review' ? (
        <Clock className="w-4 h-4" />
      ) : (
        <Bell className="w-4 h-4" />
      )}
    </div>
  );
};

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeTab, onNavigate }) => {
  const {
    userProfile,
    setSignInModalOpen,
    disconnectAccount,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    submittedRequests,
    openEmailPreview,
  } = useAifa();

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const bellButtonRef = useRef<HTMLButtonElement>(null);
  const accountButtonRef = useRef<HTMLButtonElement>(null);

  // Close the open dropdown on outside click or Escape (focus returns to its trigger).
  useEffect(() => {
    if (!openMenu) return;

    const handleMouseDown = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const trigger = openMenu === 'notifications' ? bellButtonRef.current : accountButtonRef.current;
        setOpenMenu(null);
        trigger?.focus();
      }
    };

    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenu]);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    setOpenMenu((current) => (current === menu ? null : menu));
  };

  // Same behaviour as clicking an item on the full Notifications page.
  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    setOpenMenu(null);
    if (item.relatedRequestId) {
      const req = submittedRequests.find((r) => r.id === item.relatedRequestId);
      if (req && req.status === 'Completed') {
        openEmailPreview(req);
        return;
      }
      onNavigate('requests');
    }
  };

  const goTo = (tab: DashboardTab, sectionId?: string) => {
    setOpenMenu(null);
    onNavigate(tab, sectionId);
  };

  const previewNotifications = notifications.slice(0, DROPDOWN_PREVIEW_LIMIT);
  const badgeLabel = unreadNotificationCount > 9 ? '9+' : String(unreadNotificationCount);
  const initials = getInitials(userProfile.name);

  const dropdownPanel =
    'absolute right-0 top-full mt-3 bg-white rounded-[28px] border border-[#E0DED9] shadow-[0_24px_48px_-16px_rgba(42,42,42,0.28)] overflow-hidden z-40';
  const menuItem =
    'w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer';

  return (
    <header className="h-20 shrink-0 z-30">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: official logo → Overview */}
        <div className="flex items-center gap-4 min-w-0">
          <button
            type="button"
            onClick={() => goTo('overview')}
            aria-label="Sebenarnya.my — go to Overview"
            className="shrink-0 rounded-full p-1 -m-1 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5774BC]/40"
          >
            <img
              src="/images/sebenarnya-logo.png"
              alt="Sebenarnya.my"
              className="h-9 w-auto select-none"
              draggable={false}
            />
          </button>
          <span className="hidden md:block h-7 w-px bg-[#E0DED9]" aria-hidden="true" />
          <span className="hidden md:block text-sm font-medium text-[#6F6D69] truncate">
            Fact-Check Dashboard
          </span>
        </div>

        {/* Right: notifications + account */}
        <div ref={actionsRef} className="relative flex items-center gap-2.5 sm:gap-3">
          {/* Notification bell */}
          <div className="relative">
            <button
              ref={bellButtonRef}
              type="button"
              onClick={() => toggleMenu('notifications')}
              aria-haspopup="true"
              aria-expanded={openMenu === 'notifications'}
              aria-label={
                unreadNotificationCount > 0
                  ? `Notifications, ${unreadNotificationCount} unread`
                  : 'Notifications'
              }
              className={`relative w-11 h-11 rounded-full text-white flex items-center justify-center transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#eeeff3] focus-visible:ring-[#5774BC]/50 ${
                openMenu === 'notifications' || activeTab === 'notifications'
                  ? 'bg-[#4A4A4A]'
                  : 'bg-[#2A2A2A] hover:bg-[#3A3A3A]'
              }`}
            >
              <Bell className="w-[18px] h-[18px]" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#D93043] text-white text-[10px] font-bold leading-[18px] text-center ring-2 ring-[#eeeff3]">
                  {badgeLabel}
                </span>
              )}
            </button>

            {openMenu === 'notifications' && (
              <div
                role="dialog"
                aria-label="Notifications"
                className={`${dropdownPanel} w-[380px] max-w-[calc(100vw-2rem)]`}
              >
                <div className="px-5 pt-5 pb-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[15px] font-semibold text-[#2A2A2A]">Notifications</h2>
                    {unreadNotificationCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#D93043] text-white">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotificationCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsAsRead}
                      className="text-xs font-medium text-[#6F6D69] hover:text-[#2A2A2A] flex items-center gap-1 rounded-full px-2.5 py-1.5 hover:bg-[#E2E4EA] transition-colors cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Mark all as read</span>
                    </button>
                  )}
                </div>

                {previewNotifications.length === 0 ? (
                  <div className="px-6 py-10 text-center">
                    <div className="w-12 h-12 rounded-full bg-[#F4F3F1] text-[#6F6D69] flex items-center justify-center mx-auto">
                      <BellOff className="w-5 h-5" />
                    </div>
                    <p className="mt-3 text-sm font-semibold text-[#2A2A2A]">You're all caught up</p>
                    <p className="mt-1 text-xs text-[#6F6D69] leading-relaxed">
                      Updates about your fact-check inquiries will appear here.
                    </p>
                  </div>
                ) : (
                  <ul className="max-h-[360px] overflow-y-auto px-2 space-y-1">
                    {previewNotifications.map((item) => (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(item)}
                          className={`w-full text-left px-3 py-3 rounded-[20px] flex items-start gap-3 transition-colors cursor-pointer focus:outline-none focus-visible:bg-[#F4F3F1] ${
                            item.isRead ? 'hover:bg-[#E2E4EA]' : 'bg-[#F4F3F1] hover:bg-[#E2E4EA]'
                          }`}
                        >
                          <NotificationTypeIcon type={item.type} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`text-[13px] leading-snug ${
                                  item.isRead ? 'font-medium text-[#5C5A56]' : 'font-semibold text-[#2A2A2A]'
                                }`}
                              >
                                {item.title}
                              </p>
                              {!item.isRead && (
                                <span className="mt-1.5 w-2 h-2 rounded-full bg-[#5774BC] shrink-0">
                                  <span className="sr-only">Unread</span>
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-xs text-[#6F6D69] leading-relaxed line-clamp-2">
                              {item.message}
                            </p>
                            <p className="mt-1 text-[11px] text-[#6F6D69]">
                              {item.timestamp}
                              {item.isRead ? ' · Read' : ''}
                            </p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="p-3">
                  <button
                    type="button"
                    onClick={() => goTo('notifications')}
                    className="w-full h-10 rounded-full bg-[#2A2A2A] text-white text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                  >
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="relative">
            <button
              ref={accountButtonRef}
              type="button"
              onClick={() => toggleMenu('account')}
              aria-haspopup="menu"
              aria-expanded={openMenu === 'account'}
              aria-label={`Account menu for ${userProfile.name}`}
              className={`flex items-center gap-2 rounded-full p-0.5 md:pr-3 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#EEEFF3] focus-visible:ring-[#5774BC]/50 ${
                openMenu === 'account' ? 'md:bg-white' : 'md:hover:bg-white'
              }`}
            >
              <span className="relative">
                <span
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold ${
                    userProfile.isConnected ? 'bg-[#2A2A2A] text-white' : 'bg-[#E8E6E2] text-[#5C5A56]'
                  }`}
                >
                  {initials}
                </span>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#eeeff3] ${
                    userProfile.isConnected ? 'bg-emerald-500' : 'bg-[#6F6D69]/40'
                  }`}
                  aria-hidden="true"
                />
              </span>
              <span className="hidden md:block text-sm font-semibold text-[#2A2A2A] max-w-[140px] truncate">
                {userProfile.isConnected ? userProfile.name : 'Not connected'}
              </span>
              <ChevronDown
                className={`hidden md:block w-4 h-4 text-[#6F6D69] transition-transform ${
                  openMenu === 'account' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {openMenu === 'account' && (
              <div role="menu" aria-label="Account" className={`${dropdownPanel} w-72`}>
                <div className="m-2 p-4 rounded-[22px] bg-[#F4F3F1] flex items-center gap-3">
                  <span
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
                      userProfile.isConnected ? 'bg-[#2A2A2A] text-white' : 'bg-[#E8E6E2] text-[#5C5A56]'
                    }`}
                  >
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#2A2A2A] truncate">{userProfile.name}</p>
                    <p className="text-xs text-[#6F6D69] truncate">{userProfile.email}</p>
                    <p
                      className={`mt-0.5 text-[11px] font-medium flex items-center gap-1 ${
                        userProfile.isConnected ? 'text-emerald-700' : 'text-[#6F6D69]'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          userProfile.isConnected ? 'bg-emerald-500' : 'bg-[#6F6D69]/40'
                        }`}
                      />
                      {userProfile.isConnected ? 'Connected to Sebenarnya.my' : 'Not connected'}
                    </p>
                  </div>
                </div>

                <div className="px-2 pb-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => goTo('settings', DASHBOARD_SECTION_IDS.account)}
                    className={menuItem}
                  >
                    <UserRound className="w-4 h-4 text-[#6F6D69]" />
                    <span>My Account</span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => goTo('settings', DASHBOARD_SECTION_IDS.preferences)}
                    className={menuItem}
                  >
                    <Settings className="w-4 h-4 text-[#6F6D69]" />
                    <span>Settings</span>
                  </button>
                </div>

                <div className="p-2 border-t border-[#E0DED9]">
                  {userProfile.isConnected ? (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenMenu(null);
                        disconnectAccount();
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-medium text-[#9B3D36] hover:bg-[#F7DEDB] transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log out</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setOpenMenu(null);
                        setSignInModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-[#3F5C9E] hover:bg-[#DFE6F5] transition-colors cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Connect account</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
