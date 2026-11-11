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
    <div className="space-y-6">
      {/* Title & Actions */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Activity & Review Notifications
            </h2>
            {unreadNotificationCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-[#D93043]">
                {unreadNotificationCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time updates regarding fact-checking inquiries and browser extension status.
          </p>
        </div>

        {unreadNotificationCount > 0 && (
          <button
            type="button"
            onClick={markAllNotificationsAsRead}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No Notifications</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You are all caught up! Updates about your submitted requests will appear here.
            </p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                item.isRead
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-rose-50/30 border-rose-200/80 shadow-xs hover:bg-rose-50/50'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                  item.type === 'request_completed'
                    ? 'bg-emerald-100 text-emerald-700'
                    : item.type === 'request_review'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
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
                      className={`text-xs font-bold ${
                        item.isRead ? 'text-slate-800' : 'text-slate-900'
                      }`}
                    >
                      {item.title}
                    </h4>
                    {!item.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#D93043] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 shrink-0">{item.timestamp}</span>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.message}</p>

                {item.referenceNumber && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Ref: {item.referenceNumber}
                    </span>
                    <span className="text-[10px] text-teal-700 font-semibold hover:underline flex items-center gap-0.5">
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
