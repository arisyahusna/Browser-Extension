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
import { Avatar, Badge, Button, EmptyState, Icon, IconButton } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { NotificationItem } from '../types/aifa';
import { ExtensionSurface } from '../extension/shared/ExtensionSurface';
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

/** Notification type mark: completed reviews take the success colour; the rest stay neutral. */
export const NotificationTypeIcon: React.FC<{ type: NotificationItem['type'] }> = ({ type }) => (
  <div
    className={`size-avatar rounded-full bg-muted flex items-center justify-center shrink-0 ${
      type === 'request_completed' ? 'text-success' : 'text-foreground'
    }`}
  >
    <Icon icon={type === 'request_completed' ? ShieldCheck : type === 'request_review' ? Clock : Bell} />
  </div>
);

// Menus: the design system's DropdownMenu only holds links, so these panels and rows use preset classes.
const dropdownPanel =
  'absolute right-0 top-full mt-12 bg-card rounded-menu border border-border shadow-float overflow-hidden z-dropdown';
const menuItem =
  'w-full flex items-center gap-inline px-12 h-control rounded-menu-item text-label-sm hover:bg-muted transition-colors duration-fast ease-out cursor-pointer';

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
  // The design-system buttons do not forward refs, so triggers are focused by id.
  const triggerIds = { notifications: 'dashboard-notifications-trigger', account: 'dashboard-account-trigger' };

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
        const trigger = document.getElementById(triggerIds[openMenu]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  const statusDot = userProfile.isConnected ? 'bg-success' : 'bg-muted-foreground';

  return (
    <ExtensionSurface density="compact">
      <header className="h-72 shrink-0 z-sticky font-sans text-foreground">
        <div className="h-full px-page-x flex items-center justify-between gap-group">
          {/* Left: official logo → Overview */}
          <div className="flex items-center gap-group min-w-0">
            <button
              type="button"
              onClick={() => goTo('overview')}
              aria-label="Sebenarnya.my — go to Overview"
              className="shrink-0 rounded-control p-4 -m-4 cursor-pointer"
            >
              <img
                src={`${import.meta.env.BASE_URL}images/sebenarnya-logo.png`}
                alt="Sebenarnya.my"
                className="h-36 w-auto select-none"
                draggable={false}
              />
            </button>
            <span className="md:hidden h-28 w-px bg-border" aria-hidden="true" />
            <span className="md:hidden text-label-sm text-muted-foreground truncate">Fact-Check Dashboard</span>
          </div>

          {/* Right: notifications + account */}
          <div ref={actionsRef} className="relative flex items-center gap-12">
            {/* Notification bell */}
            <div className="relative">
              <IconButton
                id={triggerIds.notifications}
                icon={Bell}
                label={
                  unreadNotificationCount > 0 ? `Notifications, ${unreadNotificationCount} unread` : 'Notifications'
                }
                variant={openMenu === 'notifications' || activeTab === 'notifications' ? 'filled' : 'outline'}
                onClick={() => toggleMenu('notifications')}
                aria-haspopup="true"
                aria-expanded={openMenu === 'notifications'}
              />
              {unreadNotificationCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-4 -right-4 min-w-badge-sm h-badge-sm px-badge-x-sm rounded-badge bg-primary text-primary-foreground text-caption flex items-center justify-center pointer-events-none"
                >
                  {badgeLabel}
                </span>
              )}

              {openMenu === 'notifications' && (
                <div role="dialog" aria-label="Notifications" className={`${dropdownPanel} aifa-menu-frame`}>
                  <div className="px-16 pt-16 pb-8 flex items-center justify-between gap-12">
                    <div className="flex items-center gap-inline">
                      <h2 className="text-label text-foreground">Notifications</h2>
                      {unreadNotificationCount > 0 && <Badge size="sm">{unreadNotificationCount} new</Badge>}
                    </div>
                    {unreadNotificationCount > 0 && (
                      <Button variant="quiet" size="sm" icon={CheckCheck} onClick={markAllNotificationsAsRead}>
                        Mark all as read
                      </Button>
                    )}
                  </div>

                  {previewNotifications.length === 0 ? (
                    <EmptyState
                      icon={BellOff}
                      title="You're all caught up"
                      description="Updates about your fact-check inquiries will appear here."
                    />
                  ) : (
                    <ul className="aifa-menu-list overflow-y-auto px-8 flex flex-col gap-4">
                      {previewNotifications.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => handleNotificationClick(item)}
                            className={`w-full text-left p-12 rounded-media flex items-start gap-12 transition-colors duration-fast ease-out cursor-pointer hover:bg-muted-strong ${
                              item.isRead ? '' : 'bg-muted'
                            }`}
                          >
                            <NotificationTypeIcon type={item.type} />
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                              <div className="flex items-start justify-between gap-inline">
                                <p className={item.isRead ? 'text-body-sm text-text-secondary' : 'text-label-sm text-foreground'}>
                                  {item.title}
                                </p>
                                {!item.isRead && (
                                  <span className="mt-6 size-dot rounded-full bg-foreground shrink-0">
                                    <span className="sr-only">Unread</span>
                                  </span>
                                )}
                              </div>
                              <p className="text-caption text-muted-foreground line-clamp-2">{item.message}</p>
                              <p className="text-caption text-muted-foreground">
                                {item.timestamp}
                                {item.isRead ? ' · Read' : ''}
                              </p>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="p-12">
                    <Button onClick={() => goTo('notifications')} className="w-full">
                      View all notifications
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Account */}
            <div className="relative">
              <Button
                id={triggerIds.account}
                variant={openMenu === 'account' ? 'secondary' : 'quiet'}
                onClick={() => toggleMenu('account')}
                aria-haspopup="menu"
                aria-expanded={openMenu === 'account'}
                aria-label={`Account menu for ${userProfile.name}`}
                icon={
                  <span className="relative shrink-0">
                    <Avatar alt={userProfile.name} fallback={initials} size="sm" />
                    <span className={`absolute bottom-0 right-0 size-dot rounded-full ring-2 ring-card ${statusDot}`} aria-hidden="true" />
                  </span>
                }
                iconEnd={
                  <Icon
                    icon={ChevronDown}
                    className={`md:hidden transition-transform duration-fast ease-out ${openMenu === 'account' ? 'rotate-180' : ''}`}
                  />
                }
              >
                <span className="md:hidden max-w-menu truncate">
                  {userProfile.isConnected ? userProfile.name : 'Not connected'}
                </span>
              </Button>

              {openMenu === 'account' && (
                <div role="menu" aria-label="Account" className={`${dropdownPanel} w-menu-lg`}>
                  <div className="m-8 p-12 rounded-media bg-muted flex items-center gap-12">
                    <Avatar alt={userProfile.name} fallback={initials} />
                    <div className="min-w-0">
                      <p className="text-label-sm text-foreground truncate">{userProfile.name}</p>
                      <p className="text-caption text-muted-foreground truncate">{userProfile.email}</p>
                      <p
                        className={`text-caption flex items-center gap-4 ${
                          userProfile.isConnected ? 'text-success' : 'text-muted-foreground'
                        }`}
                      >
                        <span className={`size-dot rounded-full ${statusDot}`} />
                        {userProfile.isConnected ? 'Connected to Sebenarnya.my' : 'Not connected'}
                      </p>
                    </div>
                  </div>

                  <div className="px-8 pb-4">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => goTo('settings', DASHBOARD_SECTION_IDS.account)}
                      className={`${menuItem} text-foreground`}
                    >
                      <Icon icon={UserRound} className="text-muted-foreground" />
                      <span>My Account</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => goTo('settings', DASHBOARD_SECTION_IDS.preferences)}
                      className={`${menuItem} text-foreground`}
                    >
                      <Icon icon={Settings} className="text-muted-foreground" />
                      <span>Settings</span>
                    </button>
                  </div>

                  <div className="p-8 border-t border-border">
                    {userProfile.isConnected ? (
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          setOpenMenu(null);
                          disconnectAccount();
                        }}
                        className={`${menuItem} text-destructive`}
                      >
                        <Icon icon={LogOut} />
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
                        className={`${menuItem} text-foreground`}
                      >
                        <Icon icon={LogIn} />
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
    </ExtensionSurface>
  );
};
