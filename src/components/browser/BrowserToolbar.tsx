import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Lock,
  Puzzle,
  MoreVertical,
  Star,
} from 'lucide-react';
import { useBrowser } from '../../context/BrowserContext';
import { AIFAExtensionIcon } from '../../extension/toolbar/AIFAExtensionIcon';
import { AIFAToolbarPopup } from '../../extension/popup/AIFAToolbarPopup';

export const BrowserToolbar: React.FC = () => {
  const {
    displayUrl,
    canGoBack,
    canGoForward,
    goBack,
    goForward,
    refresh,
    activeTab,
    isAifaPopupOpen,
    toggleAifaPopup,
    setAifaPopupOpen,
  } = useBrowser();

  const [showExtensionMenu, setShowExtensionMenu] = useState(false);
  const [showChromeMenu, setShowChromeMenu] = useState(false);

  const parsedUrl = React.useMemo(() => {
    try {
      const url = new URL(displayUrl);
      return {
        protocol: `${url.protocol}//`,
        host: url.host,
        pathname: url.pathname === '/' ? '' : url.pathname,
      };
    } catch {
      return {
        protocol: 'https://',
        host: 'www.malaysianews-demo.my',
        pathname: '',
      };
    }
  }, [displayUrl]);

  return (
    <div className="h-11 bg-white border-b border-[#E0E2E6] flex items-center px-3 gap-2 relative z-30 select-none shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Navigation Controls: Back, Forward, Refresh */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={goBack}
          disabled={!canGoBack}
          title="Click to go back"
          className={`p-1.5 rounded-full transition-colors ${
            canGoBack
              ? 'text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer'
              : 'text-slate-300 cursor-default'
          }`}
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={goForward}
          disabled={!canGoForward}
          title="Click to go forward"
          className={`p-1.5 rounded-full transition-colors ${
            canGoForward
              ? 'text-slate-700 hover:bg-slate-100 active:bg-slate-200 cursor-pointer'
              : 'text-slate-300 cursor-default'
          }`}
          aria-label="Forward"
        >
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={refresh}
          title="Reload this page"
          className="p-1.5 rounded-full text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors cursor-pointer"
          aria-label="Reload"
        >
          <RotateCw
            className={`w-4 h-4 ${activeTab.isLoading ? 'animate-spin text-[#D93043]' : ''}`}
          />
        </button>
      </div>

      {/* Omnibox / Address Bar */}
      <div className="flex-1 flex items-center h-8 bg-[#F1F3F4] hover:bg-[#E8EAED] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500/30 rounded-full px-3 text-xs text-slate-800 transition-all border border-transparent hover:border-slate-300/50">
        {/* Site info / security icon */}
        <div className="flex items-center gap-1.5 mr-2 text-slate-500 shrink-0">
          <div className="p-0.5 rounded hover:bg-slate-300/50 cursor-pointer" title="View site information: Secure connection">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
          </div>
        </div>

        {/* Address text */}
        <div className="flex-1 truncate font-mono text-[11.5px] text-slate-700 select-all cursor-text">
          <span className="text-slate-400">{parsedUrl.protocol}</span>
          <span className="font-semibold text-slate-800">{parsedUrl.host}</span>
          <span className="text-slate-600">{parsedUrl.pathname}</span>
        </div>

        {/* Omnibox right action icons */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            className="p-1 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
            title="Bookmark this tab"
          >
            <Star className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Extensions & Chrome Action Icons */}
      <div className="flex items-center gap-1 shrink-0 relative">
        {/* Chrome Extensions Puzzle Icon */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExtensionMenu((prev) => !prev)}
            title="Extensions"
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Extensions"
          >
            <Puzzle className="w-4 h-4" />
          </button>

          {showExtensionMenu && (
            <div className="absolute right-0 top-10 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-3 z-50 text-xs">
              <div className="font-semibold text-slate-800 mb-2">Installed Extensions</div>
              <div className="flex items-center justify-between p-2 rounded hover:bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-rose-50 flex items-center justify-center text-[#D93043]">
                    🛡️
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">AIFA Assistant</div>
                    <div className="text-[10px] text-slate-400">Access to malaysianews-demo.my</div>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Active" />
              </div>
            </div>
          )}
        </div>

        {/* Dedicated AIFA Extension Icon */}
        <AIFAExtensionIcon isOpen={isAifaPopupOpen} onClick={toggleAifaPopup} />

        {/* AIFA Extension Popup Dropdown */}
        <AIFAToolbarPopup
          isOpen={isAifaPopupOpen}
          onClose={() => setAifaPopupOpen(false)}
        />

        {/* Chrome Menu Button (3 dots) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowChromeMenu((prev) => !prev)}
            title="Customize and control Google Chrome (Simulation)"
            className="p-1.5 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200 transition-colors"
            aria-label="Chrome menu"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showChromeMenu && (
            <div className="absolute right-0 top-10 w-52 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 text-xs text-slate-700">
              <div className="px-3 py-1.5 font-semibold text-slate-900 border-b border-slate-100">
                Chrome Simulation Menu
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.reload();
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>Reload Demo App</span>
                <span className="text-[10px] text-slate-400">Ctrl+R</span>
              </button>
              <div className="px-3 py-1.5 text-[11px] text-slate-400 border-t border-slate-100">
                AIFA Browser Extension Mockup — Stage 1
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
