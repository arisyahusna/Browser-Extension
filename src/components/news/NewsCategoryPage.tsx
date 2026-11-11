import React from 'react';
import { MOCK_ARTICLES } from '../../data/mockArticles';
import { useBrowser } from '../../context/BrowserContext';
import { ArrowLeft, Filter, Sparkles } from 'lucide-react';
import { NewsArticle } from '../../types/news';

interface NewsCategoryPageProps {
  categorySlug: string;
}

export const NewsCategoryPage: React.FC<NewsCategoryPageProps> = ({ categorySlug }) => {
  const { navigate } = useBrowser();

  const formattedName =
    categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1);

  // Filter articles matching this category (case-insensitive)
  const filteredArticles = MOCK_ARTICLES.filter(
    (a) => a.category.toLowerCase() === categorySlug.toLowerCase()
  );

  const openArticle = (article: NewsArticle) => {
    navigate({
      pathname: `/articles/${article.slug}`,
      title: `${article.headline} — Malaysia News Daily`,
      articleId: article.id,
    });
  };

  return (
    <div className="min-h-full bg-white text-slate-900">
      {/* Category Header */}
      <div className="border-b border-slate-200 bg-[#FAFBFD] px-4 sm:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <button
              type="button"
              onClick={() =>
                navigate({
                  pathname: '/',
                  title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
                })
              }
              className="hover:text-slate-900 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </button>
            <span>/</span>
            <span className="font-semibold text-slate-700">Categories</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400">
                Editorial Section
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 mt-1">
                {formattedName} Desk
              </h1>
            </div>

            <div className="text-xs text-slate-500 flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Showing {filteredArticles.length} curated {filteredArticles.length === 1 ? 'report' : 'reports'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => openArticle(article)}
                className="group cursor-pointer border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                    <img
                      src={article.imageUrl}
                      alt={article.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                      {article.category}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors mt-2 mb-2 line-clamp-2">
                      {article.headline}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{article.author.name}</span>
                  <span>{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Polished placeholder for unfinished categories */
          <div className="max-w-xl mx-auto py-16 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-slate-900">
              {formattedName} Coverage Expanding
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our {formattedName.toLowerCase()} editorial desk is currently preparing scheduled
              investigative pieces for the upcoming edition. Sample articles for the AIFA Fact-Checking
              demonstration are currently available under{' '}
              <button
                type="button"
                onClick={() =>
                  navigate({
                    pathname: '/category/malaysia',
                    title: 'Malaysia — Malaysia News Daily',
                    category: 'malaysia',
                  })
                }
                className="font-semibold text-rose-600 hover:underline"
              >
                Malaysia
              </button>
              {' '}and{' '}
              <button
                type="button"
                onClick={() =>
                  navigate({
                    pathname: '/category/technology',
                    title: 'Technology — Malaysia News Daily',
                    category: 'technology',
                  })
                }
                className="font-semibold text-blue-600 hover:underline"
              >
                Technology
              </button>
              .
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() =>
                  navigate({
                    pathname: '/',
                    title: 'Malaysia News Daily — Credible Malaysian News & Analysis',
                  })
                }
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-medium hover:bg-slate-800 transition-colors"
              >
                Return to News Homepage
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
