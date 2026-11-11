import React from 'react';
import { useBrowser } from '../../context/BrowserContext';
import { Newspaper, Users, MessageSquareQuote, ShieldAlert } from 'lucide-react';

export const BrowserBookmarksBar: React.FC = () => {
  const { navigate, currentLocation } = useBrowser();

  const bookmarks = [
    {
      id: 'b-news',
      title: 'Malaysia News Daily',
      url: 'https://www.malaysianews-demo.my/',
      location: {
        pathname: '/',
        title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
        platform: 'news' as const,
      },
      icon: <Newspaper className="w-3.5 h-3.5 text-blue-600" />,
      isActive: !currentLocation.pathname.startsWith('/connectsocial') && !currentLocation.pathname.startsWith('/pulsefeed'),
    },
    {
      id: 'b-connect',
      title: 'ConnectSocial (Facebook-style)',
      url: 'https://connectsocial.example/feed',
      location: {
        pathname: '/connectsocial',
        title: 'ConnectSocial — Community Feed',
        platform: 'connectsocial' as const,
        customUrl: 'https://connectsocial.example/feed',
      },
      icon: <Users className="w-3.5 h-3.5 text-sky-600" />,
      isActive: currentLocation.pathname.startsWith('/connectsocial'),
    },
    {
      id: 'b-pulse',
      title: 'PulseFeed (X-style)',
      url: 'https://pulsefeed.example/home',
      location: {
        pathname: '/pulsefeed',
        title: 'PulseFeed — Live Timeline',
        platform: 'pulsefeed' as const,
        customUrl: 'https://pulsefeed.example/home',
      },
      icon: <MessageSquareQuote className="w-3.5 h-3.5 text-slate-800" />,
      isActive: currentLocation.pathname.startsWith('/pulsefeed'),
    },
    {
      id: 'b-viral',
      title: 'Viral Claim Story',
      url: 'https://www.malaysianews-demo.my/articles/viral-rm500-annual-payment-claim-sparks-questions',
      location: {
        pathname: '/articles/viral-rm500-annual-payment-claim-sparks-questions',
        title: 'Viral RM500 Annual Payment Claim Sparks Questions — Malaysia News Daily',
        articleId: 'art-rm500-claim',
        platform: 'news' as const,
      },
      icon: <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />,
      isActive: currentLocation.pathname.includes('viral-rm500'),
    },
  ];

  return (
    <div className="h-7 bg-white border-b border-[#E0E2E6] flex items-center px-2.5 gap-1.5 select-none text-[11px] text-slate-700 z-20 shadow-[0_1px_1px_rgba(0,0,0,0.01)] overflow-x-auto no-scrollbar">
      <span className="text-[10px] uppercase font-bold text-slate-400 mr-1 tracking-wider">
        Demo Sites:
      </span>

      {bookmarks.map((bm) => (
        <button
          key={bm.id}
          type="button"
          onClick={() => navigate(bm.location)}
          className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md transition-all duration-150 cursor-pointer ${
            bm.isActive
              ? 'bg-slate-100 font-semibold text-slate-900 border border-slate-200'
              : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title={`Simulate opening ${bm.url}`}
        >
          {bm.icon}
          <span className="truncate max-w-[170px]">{bm.title}</span>
        </button>
      ))}
    </div>
  );
};
