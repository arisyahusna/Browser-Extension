import React, { useState, useRef } from 'react';
import { NewsArticle } from '../../types/news';
import { MOCK_ARTICLES, MOCK_TRENDING } from '../../data/mockArticles';
import { useBrowser } from '../../context/BrowserContext';
import { useAIFAArticleDetection } from '../../hooks/useAIFAArticleDetection';
import { AIFAArticleOverlay } from '../aifa/AIFAArticleOverlay';
import {
  Clock,
  Bookmark,
  Check,
  ChevronRight,
  Flame,
  ArrowLeft,
  AlertCircle,
  Copy,
} from 'lucide-react';

interface NewsArticlePageProps {
  article: NewsArticle;
}

export const NewsArticlePage: React.FC<NewsArticlePageProps> = ({ article }) => {
  const { navigate } = useBrowser();
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const articleRef = useRef<HTMLElement>(null);
  const { isHighlighted } = useAIFAArticleDetection({
    articleRef,
    articleId: article.id,
  });

  const relatedArticles = MOCK_ARTICLES.filter((a) =>
    article.relatedArticleIds.includes(a.id)
  );

  const openRelated = (rel: NewsArticle) => {
    navigate({
      pathname: `/articles/${rel.slug}`,
      title: `${rel.headline} — Malaysia News Daily`,
      articleId: rel.id,
    });
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-full bg-white text-slate-900">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-slate-100 bg-[#FAFBFD] px-4 sm:px-8 py-2.5 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-1.5 overflow-hidden">
            <button
              type="button"
              onClick={() =>
                navigate({
                  pathname: '/',
                  title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
                })
              }
              className="hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-slate-700 font-medium">{article.category}</span>
            <ChevronRight className="w-3 h-3 text-slate-300 hidden sm:inline" />
            <span className="text-slate-400 truncate hidden sm:inline max-w-md">
              {article.headline}
            </span>
          </nav>

          <span className="text-[11px] text-slate-400 font-mono">
            Article ID: {article.id}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Main Column */}
          <div className="lg:col-span-8">
            {/* 
              STAGE 1 REQUIREMENT:
              The main article content must be wrapped in a clear semantic container:
              <article data-aifa-detectable="true">
              Use separate elements for headline, summary, body paragraphs, and images.
              Advertisements, website navigation, trending stories and related articles 
              MUST NOT be inside this container.
            */}
            <article
              ref={articleRef}
              id={article.id}
              data-aifa-detectable="true"
              data-article-id={article.id}
              data-article-slug={article.slug}
              className={`space-y-6 relative transition-all duration-200 p-3 -m-3 rounded-xl ${
                isHighlighted
                  ? 'outline-2 outline-[#D93043] outline-offset-4 bg-[#D93043]/[0.015]'
                  : 'outline-2 outline-transparent outline-offset-4'
              }`}
            >
              {/* AIFA Smart Detection & Floating Action Overlay (Stage 2) */}
              <AIFAArticleOverlay />
              {/* Category & Metadata header */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span
                    data-aifa-role="category"
                    className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded border border-rose-200/60"
                  >
                    {article.category}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500 font-medium">{article.readTime}</span>
                </div>

                {/* Article Headline */}
                <h1
                  data-aifa-role="headline"
                  className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-slate-900 leading-[1.2] tracking-tight"
                >
                  {article.headline}
                </h1>

                {/* Introductory Summary */}
                <p
                  data-aifa-role="summary"
                  className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed border-l-2 border-slate-300 pl-4 py-0.5"
                >
                  {article.summary}
                </p>

                {/* Byline & Timestamp */}
                <div
                  data-aifa-role="byline"
                  className="flex flex-wrap items-center justify-between gap-4 pt-3 pb-4 border-y border-slate-100 text-xs text-slate-500"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700 text-sm">
                      {article.author.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">
                        {article.author.name}
                      </div>
                      <div className="text-slate-400">{article.author.role}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Published: {article.publishedAt}</span>
                  </div>
                </div>
              </div>

              {/* Main Editorial Image Container */}
              <figure data-aifa-role="featured-media" className="space-y-2">
                <div className="relative aspect-16/9 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={article.imageUrl}
                    alt={article.headline}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <figcaption className="text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 px-1">
                  <span>{article.imageCaption}</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Credit: {article.imageCredit}
                  </span>
                </figcaption>
              </figure>

              {/* Body Content with Paragraphs and Subheadings */}
              <div data-aifa-role="body" className="space-y-5 text-slate-800 pt-2">
                {article.paragraphs.map((item) => {
                  if (item.type === 'subheading') {
                    return (
                      <h2
                        key={item.id}
                        id={item.id}
                        data-paragraph-id={item.id}
                        className="font-serif text-xl sm:text-2xl font-bold text-slate-900 pt-5 pb-1 leading-snug"
                      >
                        {item.text}
                      </h2>
                    );
                  }

                  return (
                    <p
                      key={item.id}
                      id={item.id}
                      data-paragraph-id={item.id}
                      className="text-base sm:text-[17px] leading-[1.8] text-slate-700 font-normal tracking-normal"
                    >
                      {item.text}
                    </p>
                  );
                })}
              </div>
            </article>

            {/* 
              OUTSIDE DETECTABLE ARTICLE CONTAINER:
              Sharing controls, author box, and related articles
            */}
            <div className="mt-10 pt-6 border-t border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Share Story:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink()}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                    title="Share link"
                  >
                    X
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopyLink()}
                    className="p-1.5 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                    title="Share link"
                  >
                    FB
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isBookmarked
                      ? 'bg-amber-50 text-amber-800 border border-amber-200'
                      : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>{isBookmarked ? 'Bookmarked' : 'Save Story'}</span>
                </button>
              </div>
            </div>

            {/* Related Articles Section (Outside Detectable Container) */}
            {relatedArticles.length > 0 && (
              <section className="mt-12 pt-8 border-t-2 border-slate-900">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                    Related Coverage
                  </h3>
                  <span className="text-xs text-slate-500">More from our newsroom</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {relatedArticles.map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => openRelated(rel)}
                      className="group cursor-pointer border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-xs transition-all"
                    >
                      <div className="relative aspect-16/9 rounded bg-slate-100 overflow-hidden mb-3">
                        <img
                          src={rel.imageUrl}
                          alt={rel.headline}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                        {rel.category}
                      </span>
                      <h4 className="font-serif text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors mt-2 line-clamp-2">
                        {rel.headline}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{rel.summary}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Sidebar: Trending & Fact-Checking Context (Outside Detectable Container) */}
          <aside className="lg:col-span-4 space-y-8">
            {/* Fact Check Awareness Card */}
            <div className="bg-[#FAFBFD] border border-slate-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#D93043]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Verification Note
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                This article has been authored following standard journalistic guidelines. In Stage 2+,
                the AIFA browser extension will automatically inspect this content for verifiable claims.
              </p>
              <div className="text-[11px] text-slate-400 bg-white p-2.5 rounded border border-slate-200/80">
                Container Target: <code className="text-rose-700">data-aifa-detectable="true"</code>
              </div>
            </div>

            {/* Trending Articles Sidebar */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900">
                    Trending in Malaysia
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">Live</span>
              </div>

              <div className="space-y-4">
                {MOCK_TRENDING.map((trend) => (
                  <div
                    key={trend.id}
                    onClick={() => {
                      const matched = MOCK_ARTICLES.find((a) => a.slug === trend.slug);
                      if (matched) {
                        openRelated(matched);
                      }
                    }}
                    className="group cursor-pointer flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <span className="font-serif font-bold text-xl text-slate-300 group-hover:text-slate-900 transition-colors w-5 shrink-0">
                      {trend.rank}
                    </span>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {trend.category}
                      </span>
                      <h4 className="text-xs font-medium text-slate-800 group-hover:text-blue-900 line-clamp-2 leading-snug mt-0.5">
                        {trend.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
