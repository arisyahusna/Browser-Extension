import React from 'react';
import { Plus, X, Globe } from 'lucide-react';
import { useBrowser } from '../../context/BrowserContext';

export const BrowserTabBar: React.FC = () => {
  const { tabs, activeTabId, selectTab, closeTab, openTab } = useBrowser();

  return (
    <div className="h-10 bg-[#DEE1E6] flex items-end px-2 select-none border-b border-[#CACDD1] relative z-20">
      {/* Window Controls (macOS Chrome style traffic light dots) */}
      <div className="flex items-center gap-2 px-3 py-3 mr-2">
        <span
          className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] hover:opacity-80 transition-opacity cursor-pointer"
          title="Close window (simulation)"
        />
        <span
          className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] hover:opacity-80 transition-opacity cursor-pointer"
          title="Minimize window (simulation)"
        />
        <span
          className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] hover:opacity-80 transition-opacity cursor-pointer"
          title="Maximize window (simulation)"
        />
      </div>

      {/* Tabs Container */}
      <div className="flex items-end flex-1 overflow-x-auto no-scrollbar max-w-[calc(100vw-180px)]">
        {tabs.map((tab, index) => {
          const isActive = tab.id === activeTabId;
          const isNextActive = tabs[index + 1]?.id === activeTabId;

          return (
            <div
              key={tab.id}
              onClick={() => selectTab(tab.id)}
              className={`group relative flex items-center h-8.5 px-3 max-w-[240px] min-w-[140px] flex-1 text-xs cursor-pointer select-none transition-colors duration-150 ${
                isActive
                  ? 'bg-white text-slate-800 font-medium rounded-t-lg shadow-[0_-1px_3px_rgba(0,0,0,0.06)] z-10'
                  : 'text-slate-600 hover:bg-[#E8EAED] hover:text-slate-900 rounded-t-md'
              }`}
            >
              {/* Vertical divider line for inactive tabs */}
              {!isActive && !isNextActive && (
                <span className="absolute right-0 top-2 bottom-2 w-[1px] bg-slate-300/80 group-hover:opacity-0 transition-opacity" />
              )}

              {/* Favicon */}
              <span className="mr-2 shrink-0 flex items-center justify-center text-sm">
                {tab.favicon ? (
                  <span>{tab.favicon}</span>
                ) : (
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                )}
              </span>

              {/* Tab Title */}
              <span className="truncate flex-1 text-[11.5px] leading-tight">
                {tab.title}
              </span>

              {/* Close Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeTab(tab.id);
                }}
                className={`ml-1.5 p-0.5 rounded-full hover:bg-slate-200 transition-colors ${
                  isActive ? 'text-slate-500 hover:text-slate-800' : 'text-slate-400 group-hover:text-slate-600'
                }`}
                aria-label={`Close tab ${tab.title}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}

        {/* New Tab Button */}
        <button
          type="button"
          onClick={() => openTab()}
          className="ml-1 mb-1 p-1 rounded-full text-slate-600 hover:text-slate-900 hover:bg-[#D3D6DC] transition-colors"
          title="New Tab"
          aria-label="Open new simulated tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

