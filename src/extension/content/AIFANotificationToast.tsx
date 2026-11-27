import React from 'react';
import { X, ExternalLink, CheckCircle } from 'lucide-react';
import { Badge, Button, Icon, IconButton } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';
import { ExtensionSurface } from '../shared/ExtensionSurface';

/**
 * In-browser notification shown when a fact-check request changes status.
 * Built from preset classes and DS parts rather than the DS Toast: that one is fire-and-forget
 * (auto-dismiss), while this one is driven by app state with its own actions.
 */
export const AIFANotificationToast: React.FC = () => {
  const { activeToastNotification, dismissToastNotification } = useAifa();
  const { navigate } = useBrowser();

  if (!activeToastNotification) return null;

  const handleViewInDashboard = () => {
    dismissToastNotification();
    navigate({
      pathname: '/sebenarnya-dashboard',
      title: 'Sebenarnya.my — AIFA Fact-Checking User Dashboard',
      platform: 'dashboard',
      customUrl: 'https://sebenarnya-dashboard.example/',
    });
  };

  return (
    <ExtensionSurface density="compact">
      <div
        role="status"
        className="fixed top-64 right-20 z-floating w-toast max-w-full bg-card rounded-card border border-border shadow-overlay overflow-hidden font-sans text-foreground"
      >
        <div className="p-card flex items-start gap-12">
          <div className="size-avatar-sm rounded-full bg-muted text-success flex items-center justify-center shrink-0">
            <Icon icon={CheckCircle} size="lg" />
          </div>

          <div className="flex-1 min-w-0 flex flex-col gap-4">
            <div className="flex items-center justify-between gap-inline">
              <Badge size="sm" className="self-center">Sebenarnya.my Update</Badge>
              <IconButton
                icon={X}
                label="Dismiss notification"
                variant="quiet"
                size="icon-sm"
                onClick={dismissToastNotification}
              />
            </div>

            <h4 className="text-label-sm text-foreground">{activeToastNotification.title}</h4>
            <p className="text-body-sm text-text-secondary">{activeToastNotification.message}</p>

            {activeToastNotification.referenceNumber && (
              <Badge size="sm" variant="outline">
                Ref: {activeToastNotification.referenceNumber}
              </Badge>
            )}

            <div className="mt-8 flex items-center gap-inline">
              <Button size="sm" iconEnd={ExternalLink} onClick={handleViewInDashboard}>
                View in Dashboard
              </Button>
              <Button variant="quiet" size="sm" onClick={dismissToastNotification}>
                Dismiss
              </Button>
            </div>
          </div>
        </div>
        <div className="h-4 w-full bg-success animate-pulse" />
      </div>
    </ExtensionSurface>
  );
};
