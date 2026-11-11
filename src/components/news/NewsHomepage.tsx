import React from 'react';
import { MOCK_ARTICLES, MOCK_TRENDING } from '../../data/mockArticles';
import { useBrowser } from '../../context/BrowserContext';
import { TrendingUp, Clock, Flame } from 'lucide-react';
import { NewsArticle } from '../../types/news';

export const NewsHomepage: React.FC = () => {
  const { navigate } = useBrowser();

  const leadStory = MOCK_ARTICLES[0];
  const secondaryStories = MOCK_ARTICLES.slice(1);

  const openArticle = (article: NewsArticle) => {
    navigate({
      pathname: `/articles/${article.slug}`,
      title: `${article.headline} — Malaysia News Daily`,
      articleId: article.id,
    });
  };

  return (
    <div className="min-h-full bg-white text-slate-900">
      {/* Breaking / Top Alert Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-8 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="shrink-0 font-bold uppercase tracking-wider text-[11px] bg-slate-900 text-white px-2 py-0.5 rounded">
              Trending Notice
            </span>
            <span
              onClick={() => openArticle(leadStory)}
              className="truncate text-slate-700 hover:text-slate-950 hover:underline cursor-pointer font-medium"
            >
              Public inquiries reported regarding unverified RM500 annual levy claims online
            </span>
          </div>
          <span className="hidden md:inline text-slate-400 shrink-0 text-[11px]">
            Updated 15 mins ago
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {/* Main Grid: 8 Cols Editorial Content + 4 Cols Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Editorial Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Prominent Lead Story */}
            {leadStory && (
              <div
                onClick={() => openArticle(leadStory)}
                className="group cursor-pointer border-b border-slate-200 pb-8 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                    {leadStory.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {leadStory.publishedAt}
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold leading-tight text-slate-900 group-hover:text-blue-900 transition-colors mb-3">
                  {leadStory.headline}
                </h2>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
                  {leadStory.summary}
                </p>

                {/* Lead Image */}
                <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                  <img
                    src={leadStory.imageUrl}
                    alt={leadStory.headline}
                    className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-300"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent pointer-events-none" />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{leadStory.author.name}</span>
                    <span>•</span>
                    <span>{leadStory.author.role}</span>
                  </div>
                  <span className="text-slate-500 font-medium">{leadStory.readTime}</span>
                </div>
              </div>
            )}

            {/* Secondary Stories Grid */}
            <div>
              <div className="flex items-center justify-between mb-6 pb-2 border-b-2 border-slate-900">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                  National & Technological Coverage
                </h3>
                <span className="text-xs text-slate-500 font-medium">Selected Reports</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secondaryStories.map((story) => (
                  <div
                    key={story.id}
                    onClick={() => openArticle(story)}
                    className="group cursor-pointer flex flex-col justify-between border-b sm:border-b-0 sm:border-r last:border-r-0 border-slate-100 sm:pr-4 pb-6 sm:pb-0"
                  >
                    <div>
                      {/* Story Image */}
                      <div className="relative aspect-16/10 rounded-md overflow-hidden bg-slate-100 mb-3 border border-slate-200">
                        <img
                          src={story.imageUrl}
                          alt={story.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      </div>

                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                          {story.category}
                        </span>
                        <span className="text-[11px] text-slate-400">{story.readTime}</span>
                      </div>

                      <h4 className="font-serif text-lg font-bold leading-snug text-slate-900 group-hover:text-blue-900 transition-colors mb-2">
                        {story.headline}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                        {story.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <span>{story.author.name}</span>
                      <span>{story.publishedAt.split(',')[0]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Trending & Latest Bulletins */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Trending News Section */}
            <div className="bg-[#FAFBFD] rounded-xl p-5 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                    Most Read Today
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Live Metrics</span>
              </div>

              <div className="space-y-4">
                {MOCK_TRENDING.map((trend) => (
                  <div
                    key={trend.id}
                    onClick={() => {
                      const matched = MOCK_ARTICLES.find((a) => a.slug === trend.slug);
                      if (matched) {
                        openArticle(matched);
                      }
                    }}
                    className="group cursor-pointer flex items-start gap-3 pb-3 border-b border-slate-200/60 last:border-0 last:pb-0"
                  >
                    <span className="font-serif font-bold text-2xl text-slate-300 group-hover:text-slate-900 transition-colors w-6 shrink-0 leading-none">
                      {trend.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        {trend.category}
                      </span>
                      <h4 className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 line-clamp-2 leading-snug mt-0.5">
                        {trend.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1">{trend.viewsLabel}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Fact-Checking Awareness Notice Box */}
            <div className="rounded-xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
                <TrendingUp className="w-4 h-4" />
                <span>Verification Advisory</span>
              </div>
              <h4 className="font-serif text-base font-semibold leading-snug">
                Encountering Unverified Online Information?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Before forwarding messages containing purported policy mandates or statutory fees,
                check for corroborated announcements via verified civic channels.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    const guideArticle = MOCK_ARTICLES.find((a) => a.id === 'art-verify-info');
                    if (guideArticle) openArticle(guideArticle);
                  }}
                  className="w-full text-center text-xs font-medium py-2 px-3 rounded bg-white text-slate-900 hover:bg-slate-100 transition-colors"
                >
                  Read Verification Guidelines →
                </button>
              </div>
            </div>

            {/* Newsletter / Subscription simulation */}
            <div className="border border-slate-200 rounded-xl p-5 text-center space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Daily Morning Dispatch
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Curated digest of Malaysia's top verified stories delivered to your inbox every morning at 7 AM.
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@example.my"
                  className="flex-1 text-xs border border-slate-200 rounded px-2.5 py-1.5 focus:outline-none focus:border-slate-400"
                  readOnly
                  value="reader@malaysia-demo.my"
                />
                <button
                  type="button"
                  className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded hover:bg-slate-800 transition-colors"
                >
                  Join
                </button>
              </div>
              <p className="text-[10px] text-slate-400">Simulation demo • No email sent</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
