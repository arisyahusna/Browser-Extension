import React, { useRef, useEffect } from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { MOCK_ARTICLES } from '../../data/mockArticles';
import { NewsHeader } from '../news/NewsHeader';
import { NewsHomepage } from '../news/NewsHomepage';
import { NewsArticlePage } from '../news/NewsArticlePage';
import { NewsCategoryPage } from '../news/NewsCategoryPage';
import { NewsFooter } from '../news/NewsFooter';
import { ConnectSocialFeed } from '../social/ConnectSocialFeed';
import { PulseFeed } from '../social/PulseFeed';
import { AIFAVerificationPanel } from '../aifa/AIFAVerificationPanel';
import { AIFAMinimizedFloatingButton } from '../aifa/AIFAMinimizedFloatingButton';

export const BrowserContent: React.FC = () => {
  const { currentLocation, activeTabId, activeTab } = useBrowser();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // When changing pages or tabs, reset scroll position smoothly to top
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentLocation.pathname, activeTabId]);

  const isConnectSocial = currentLocation.pathname.startsWith('/connectsocial');
  const isPulseFeed = currentLocation.pathname.startsWith('/pulsefeed');
  const isSocialPlatform = isConnectSocial || isPulseFeed;

  // Determine which page to render
  const renderCurrentView = () => {
    const { pathname, articleId } = currentLocation;

    if (isConnectSocial) {
      return <ConnectSocialFeed />;
    }

    if (isPulseFeed) {
      return <PulseFeed />;
    }

    if (pathname.startsWith('/articles/')) {
      const slug = pathname.replace('/articles/', '');
      const article =
        MOCK_ARTICLES.find((a) => a.slug === slug || a.id === articleId) ||
        MOCK_ARTICLES[0];

      return <NewsArticlePage article={article} />;
    }

    if (pathname.startsWith('/category/')) {
      const categorySlug = pathname.replace('/category/', '');
      return <NewsCategoryPage categorySlug={categorySlug} />;
    }

    return <NewsHomepage />;
  };

  const currentCategory =
    currentLocation.category ||
    (currentLocation.pathname.startsWith('/category/')
      ? currentLocation.pathname.replace('/category/', '')
      : 'home');

  return (
    <div className="flex-1 w-full h-[calc(100vh-112px)] flex flex-row overflow-hidden relative">
      {/* 
        Website / Platform Content Viewport:
        Scrolls independently beneath the browser tab bar, toolbar & bookmarks bar.
        Smoothly resizes to accommodate the AIFA verification panel when opened.
      */}
      <div
        ref={scrollContainerRef}
        className={`flex-1 h-full overflow-y-auto overflow-x-hidden relative select-text scroll-smooth ${
          isConnectSocial ? 'bg-[#F0F2F5]' : 'bg-white'
        }`}
        style={{
          scrollbarGutter: 'stable',
        }}
      >
        {/* Visual subtle loader bar when activeTab is loading */}
        {activeTab.isLoading && (
          <div className="sticky top-0 left-0 right-0 h-0.5 bg-rose-600 animate-pulse z-50" />
        )}

        {isSocialPlatform ? (
          /* Render standalone social platform */
          renderCurrentView()
        ) : (
          /* Render news portal with its own header & footer */
          <>
            <NewsHeader currentCategory={currentCategory} />
            <main className="min-h-[calc(100vh-280px)]">{renderCurrentView()}</main>
            <NewsFooter />
          </>
        )}
      </div>

      {/* Stage 3 & 4: AIFA Verification Panel (Right-side drawer) */}
      <AIFAVerificationPanel />

      {/* Stage 3 & 4: Minimized Floating Action Pill */}
      <AIFAMinimizedFloatingButton />
    </div>
  );
};
