import React from 'react';
import { X, ExternalLink, CheckCircle } from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { useBrowser } from '../../context/BrowserContext';

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
    <div className="fixed top-16 right-5 z-50 max-w-sm w-full bg-white rounded-xl shadow-2xl border-2 border-emerald-500 overflow-hidden animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              Sebenarnya.my Update
            </span>
            <button
              type="button"
              onClick={dismissToastNotification}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-xs font-bold text-slate-900 mt-1">
            {activeToastNotification.title}
          </h4>
          <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
            {activeToastNotification.message}
          </p>

          {activeToastNotification.referenceNumber && (
            <div className="mt-2 text-[10px] font-mono font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded inline-block">
              Ref: {activeToastNotification.referenceNumber}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleViewInDashboard}
              className="px-2.5 py-1 text-[11px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-sm transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>View in Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={dismissToastNotification}
              className="px-2 py-1 text-[11px] text-slate-500 hover:text-slate-700 transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <div className="h-1 bg-emerald-500 w-full animate-pulse" />
    </div>
  );
};
