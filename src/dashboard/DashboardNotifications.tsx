import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Badge, Button, Card, EmptyState } from '@sebenarnya/design-system';
import { useAifa } from '../context/AifaContext';
import { NotificationItem } from '../types/aifa';
import { NotificationTypeIcon } from './DashboardHeader';

interface DashboardNotificationsProps {
  onSwitchTab: (tab: 'requests') => void;
}

export const DashboardNotifications: React.FC<DashboardNotificationsProps> = ({ onSwitchTab }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotificationCount,
    submittedRequests,
    openEmailPreview,
  } = useAifa();

  const handleNotificationClick = (item: NotificationItem) => {
    markNotificationAsRead(item.id);
    if (item.relatedRequestId) {
      const req = submittedRequests.find((r) => r.id === item.relatedRequestId);
      if (req && req.status === 'Completed') {
        openEmailPreview(req);
        return;
      }
      onSwitchTab('requests');
    }
  };

  return (
    <div className="flex flex-col gap-block">
      {/* Title & Actions */}
      <div className="flex flex-row md:flex-col items-end md:items-start justify-between gap-group pt-8">
        <div className="flex flex-col gap-text">
          <div className="flex items-center gap-inline">
            <h1 className="text-heading-lg text-foreground">Activity & Review Notifications</h1>
            {unreadNotificationCount > 0 && <Badge className="self-center">{unreadNotificationCount} New</Badge>}
          </div>
          <p className="text-body text-muted-foreground">
            Real-time updates regarding fact-checking inquiries and browser extension status.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <Button variant="outline" icon={CheckCheck} onClick={markAllNotificationsAsRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex flex-col gap-12">
        {notifications.length === 0 ? (
          <Card variant="raised">
            <EmptyState
              icon={Bell}
              title="No Notifications"
              description="You are all caught up! Updates about your submitted requests will appear here."
            />
          </Card>
        ) : (
          notifications.map((item) => (
            // A clickable notification row: the design system has no list-item component.
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-card rounded-card bg-card border transition-colors duration-fast ease-out cursor-pointer flex items-start gap-group ${
                item.isRead ? 'border-border hover:border-border-strong' : 'border-foreground shadow-float'
              }`}
            >
              <NotificationTypeIcon type={item.type} />

              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-inline">
                  <div className="flex items-center gap-inline">
                    <h3 className={item.isRead ? 'text-body-sm text-text-secondary' : 'text-label-sm text-foreground'}>
                      {item.title}
                    </h3>
                    {!item.isRead && <span className="size-dot rounded-full bg-foreground shrink-0" />}
                  </div>
                  <span className="text-caption text-muted-foreground shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-body-sm text-muted-foreground">{item.message}</p>

                {item.referenceNumber && (
                  <div className="mt-4 flex items-center gap-inline">
                    <Badge size="sm" className="self-center">Ref: {item.referenceNumber}</Badge>
                    <span className="text-caption text-foreground underline underline-offset-4">View details →</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
