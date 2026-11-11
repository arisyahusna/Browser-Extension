import React from 'react';
import { BrowserTabBar } from './BrowserTabBar';
import { BrowserToolbar } from './BrowserToolbar';
import { BrowserBookmarksBar } from './BrowserBookmarksBar';
import { BrowserContent } from './BrowserContent';

export const BrowserShell: React.FC = () => {
  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-[#DEE1E6] select-none text-slate-800 font-sans">
      {/* Layer 1: Browser Tab Bar (Fixed at top) */}
      <BrowserTabBar />

      {/* Layer 2: Browser Navigation / Toolbar (Fixed at top) */}
      <BrowserToolbar />

      {/* Bookmarks Bar for quick demo site switching */}
      <BrowserBookmarksBar />

      {/* Layer 3: Website Content Area (Scrolls independently) */}
      <BrowserContent />
    </div>
  );
};

