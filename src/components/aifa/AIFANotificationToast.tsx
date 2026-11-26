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
    <div className="fixed top-16 right-5 z-50 max-w-sm w-full bg-[#EEEFF3] rounded-[26px] shadow-[0_24px_48px_-16px_rgba(42,42,42,0.35)] border border-[#E0DED9] overflow-hidden font-['Montserrat',sans-serif] antialiased animate-in slide-in-from-top-4 duration-300">
      <div className="p-4 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-[#DCEFE2] text-[#3A8656] flex items-center justify-center shrink-0">
          <CheckCircle className="w-5 h-5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] font-semibold text-[#2F6B45] bg-[#DCEFE2] px-2.5 py-1 rounded-full">
              Sebenarnya.my Update
            </span>
            <button
              type="button"
              onClick={dismissToastNotification}
              className="w-7 h-7 flex items-center justify-center text-[#6F6D69] hover:text-[#2A2A2A] hover:bg-[#E2E4EA] rounded-full transition-colors cursor-pointer"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <h4 className="text-[13px] font-semibold text-[#2A2A2A] mt-1.5">
            {activeToastNotification.title}
          </h4>
          <p className="text-[11px] text-[#5C5A56] mt-0.5 leading-snug">
            {activeToastNotification.message}
          </p>

          {activeToastNotification.referenceNumber && (
            <div className="mt-2 text-[10px] font-mono font-semibold text-[#5C5A56] bg-white px-2.5 py-1 rounded-full inline-block">
              Ref: {activeToastNotification.referenceNumber}
            </div>
          )}

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleViewInDashboard}
              className="h-8 px-3.5 text-[11px] font-semibold text-white bg-[#2A2A2A] hover:bg-black rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>View in Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={dismissToastNotification}
              className="h-8 px-3 text-[11px] font-semibold text-[#6F6D69] hover:text-[#2A2A2A] hover:bg-[#E2E4EA] rounded-full transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
      <div className="h-1 bg-[#3A8656] w-full animate-pulse" />
    </div>
  );
};
