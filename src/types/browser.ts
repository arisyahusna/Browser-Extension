export interface PageLocation {
  pathname: string; // e.g. '/', '/articles/viral-rm500-annual-payment-claim', '/category/technology', '/connectsocial', '/pulsefeed'
  title: string;
  articleId?: string;
  category?: string;
  platform?: 'news' | 'connectsocial' | 'pulsefeed';
  customUrl?: string;
}

export interface Tab {
  id: string;
  title: string;
  favicon?: string;
  history: PageLocation[];
  historyIndex: number;
  isLoading?: boolean;
}

export interface BrowserContextType {
  tabs: Tab[];
  activeTabId: string;
  activeTab: Tab;
  currentLocation: PageLocation;
  displayUrl: string;
  canGoBack: boolean;
  canGoForward: boolean;
  openTab: (initialLocation?: PageLocation) => void;
  closeTab: (tabId: string) => void;
  selectTab: (tabId: string) => void;
  navigate: (location: PageLocation) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
  isAifaPopupOpen: boolean;
  setAifaPopupOpen: (open: boolean) => void;
  toggleAifaPopup: () => void;
  refreshNonce: number;
}

