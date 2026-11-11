import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Tab, PageLocation, BrowserContextType } from '../types/browser';

const BASE_URL = 'https://www.malaysianews-demo.my';

const INITIAL_HOMEPAGE_LOCATION: PageLocation = {
  pathname: '/',
  title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
};

const INITIAL_TAB_1: Tab = {
  id: 'tab-1',
  title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
  favicon: '📰',
  history: [INITIAL_HOMEPAGE_LOCATION],
  historyIndex: 0,
};

const INITIAL_TAB_2: Tab = {
  id: 'tab-2',
  title: 'Viral RM500 Annual Payment Claim Sparks Questions...',
  favicon: '📰',
  history: [
    INITIAL_HOMEPAGE_LOCATION,
    {
      pathname: '/articles/viral-rm500-annual-payment-claim-sparks-questions',
      title: 'Viral RM500 Annual Payment Claim Sparks Questions — Malaysia News Daily',
      articleId: 'art-rm500-claim',
    },
  ],
  historyIndex: 1,
};

const BrowserContext = createContext<BrowserContextType | undefined>(undefined);

export const BrowserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tabs, setTabs] = useState<Tab[]>([INITIAL_TAB_1, INITIAL_TAB_2]);
  const [activeTabId, setActiveTabId] = useState<string>('tab-1');
  const [isAifaPopupOpen, setAifaPopupOpen] = useState<boolean>(false);
  const [refreshNonce, setRefreshNonce] = useState<number>(0);

  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  const currentLocation = useMemo(() => {
    if (!activeTab || !activeTab.history || activeTab.history.length === 0) {
      return INITIAL_HOMEPAGE_LOCATION;
    }
    return activeTab.history[activeTab.historyIndex] || activeTab.history[0];
  }, [activeTab]);

  const displayUrl = useMemo(() => {
    const path = currentLocation.pathname === '/' ? '' : currentLocation.pathname;
    return `${BASE_URL}${path}`;
  }, [currentLocation]);

  const canGoBack = (activeTab?.historyIndex ?? 0) > 0;
  const canGoForward = (activeTab?.historyIndex ?? 0) < ((activeTab?.history.length ?? 1) - 1);

  // Navigate within active tab
  const navigate = useCallback((newLocation: PageLocation) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        // Truncate any forward history and append new location
        const updatedHistory = tab.history.slice(0, tab.historyIndex + 1);
        updatedHistory.push(newLocation);
        return {
          ...tab,
          title: newLocation.title,
          history: updatedHistory,
          historyIndex: updatedHistory.length - 1,
        };
      })
    );
  }, [activeTabId]);

  const goBack = useCallback(() => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        if (tab.historyIndex > 0) {
          const newIndex = tab.historyIndex - 1;
          return {
            ...tab,
            title: tab.history[newIndex].title,
            historyIndex: newIndex,
          };
        }
        return tab;
      })
    );
  }, [activeTabId]);

  const goForward = useCallback(() => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id !== activeTabId) return tab;
        if (tab.historyIndex < tab.history.length - 1) {
          const newIndex = tab.historyIndex + 1;
          return {
            ...tab,
            title: tab.history[newIndex].title,
            historyIndex: newIndex,
          };
        }
        return tab;
      })
    );
  }, [activeTabId]);

  const refresh = useCallback(() => {
    setRefreshNonce((prev) => prev + 1);
    setTabs((prevTabs) =>
      prevTabs.map((tab) => {
        if (tab.id === activeTabId) {
          return { ...tab, isLoading: true };
        }
        return tab;
      })
    );
    setTimeout(() => {
      setTabs((prevTabs) =>
        prevTabs.map((tab) => {
          if (tab.id === activeTabId) {
            return { ...tab, isLoading: false };
          }
          return tab;
        })
      );
    }, 300);
  }, [activeTabId]);

  const openTab = useCallback((initialLocation: PageLocation = INITIAL_HOMEPAGE_LOCATION) => {
    const newTabId = `tab-${Date.now()}`;
    const newTab: Tab = {
      id: newTabId,
      title: initialLocation.title,
      favicon: '📰',
      history: [initialLocation],
      historyIndex: 0,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  }, []);

  const closeTab = useCallback((tabIdToClose: string) => {
    setTabs((prevTabs) => {
      if (prevTabs.length <= 1) {
        // If closing only tab, reset it to homepage rather than having zero tabs
        return [
          {
            id: `tab-${Date.now()}`,
            title: INITIAL_HOMEPAGE_LOCATION.title,
            favicon: '📰',
            history: [INITIAL_HOMEPAGE_LOCATION],
            historyIndex: 0,
          },
        ];
      }
      const filtered = prevTabs.filter((t) => t.id !== tabIdToClose);
      return filtered;
    });

    // If active tab was closed, switch active tab to an adjacent one
    setActiveTabId((currentActiveId) => {
      if (currentActiveId === tabIdToClose) {
        const remainingTabs = tabs.filter((t) => t.id !== tabIdToClose);
        return remainingTabs[remainingTabs.length - 1]?.id || 'tab-1';
      }
      return currentActiveId;
    });
  }, [tabs]);

  const selectTab = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const toggleAifaPopup = useCallback(() => {
    setAifaPopupOpen((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      tabs,
      activeTabId,
      activeTab,
      currentLocation,
      displayUrl,
      canGoBack,
      canGoForward,
      openTab,
      closeTab,
      selectTab,
      navigate,
      goBack,
      goForward,
      refresh,
      isAifaPopupOpen,
      setAifaPopupOpen,
      toggleAifaPopup,
      refreshNonce,
    }),
    [
      tabs,
      activeTabId,
      activeTab,
      currentLocation,
      displayUrl,
      canGoBack,
      canGoForward,
      openTab,
      closeTab,
      selectTab,
      navigate,
      goBack,
      goForward,
      refresh,
      isAifaPopupOpen,
      toggleAifaPopup,
      refreshNonce,
    ]
  );

  return <BrowserContext.Provider value={value}>{children}</BrowserContext.Provider>;
};

export const useBrowser = () => {
  const context = useContext(BrowserContext);
  if (!context) {
    throw new Error('useBrowser must be used within a BrowserProvider');
  }
  return context;
};
