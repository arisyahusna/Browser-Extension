import React from 'react';
import {
  Bell,
  CheckCheck,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { NotificationItem } from '../../types/aifa';

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
    <div className="space-y-5">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pt-2">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-[28px] leading-tight font-bold text-[#2A2A2A] tracking-tight">
              Activity & Review Notifications
            </h2>
            {unreadNotificationCount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#D93043] text-white">
                {unreadNotificationCount} New
              </span>
            )}
          </div>
          <p className="text-sm text-[#6F6D69] mt-1">
            Real-time updates regarding fact-checking inquiries and browser extension status.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="h-10 px-4 rounded-full bg-white border border-[#E0DED9] hover:bg-[#E2E4EA] text-[#2A2A2A] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-[28px] border border-[#E0DED9] p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-[#6F6D69]/50 mx-auto" />
            <h4 className="text-sm font-semibold text-[#2A2A2A]">No Notifications</h4>
            <p className="text-xs text-[#6F6D69] max-w-sm mx-auto">
              You are all caught up! Updates about your submitted requests will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-5 rounded-[24px] border transition-colors cursor-pointer flex items-start gap-4 ${
                item.isRead
                  ? 'bg-white border-[#E0DED9] hover:border-[#2A2A2A]/15'
                  : 'bg-white border-[#5774BC]/25 shadow-[0_12px_28px_-16px_rgba(87,116,188,0.45)] hover:border-[#5774BC]/45'
              }`}
            >
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${
                  item.type === 'request_completed'
                    ? 'bg-[#DCEFE2] text-[#2F6B45]'
                    : item.type === 'request_review'
                    ? 'bg-[#F4EBCB] text-[#715C1C]'
                    : 'bg-[#E8E6E2] text-[#5C5A56]'
                }`}
              >
                {item.type === 'request_completed' ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : item.type === 'request_review' ? (
                  <Clock className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className={`text-sm ${
                        item.isRead ? 'font-medium text-[#5C5A56]' : 'font-semibold text-[#2A2A2A]'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#5774BC] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#6F6D69] shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-xs text-[#6F6D69] mt-1 leading-relaxed">{item.message}</p>

                {item.referenceNumber && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span
                      className={`font-mono text-[10px] font-semibold text-[#5C5A56] px-2.5 py-1 rounded-full ${
                        'bg-[#F4F3F1]'
                      }`}
                    >
                      Ref: {item.referenceNumber}
                    </span>
                    <span className="text-[11px] text-[#3F5C9E] font-semibold hover:underline flex items-center gap-0.5">
                      <span>View details &rarr;</span>
                    </span>
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
