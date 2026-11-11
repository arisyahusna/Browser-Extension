export interface ArticleParagraph {
  id: string; // Stable ID for future claim-level highlighting in Stage 2
  type: 'paragraph' | 'subheading';
  text: string;
}

export interface NewsArticle {
  id: string; // Stable article ID (e.g. 'art-rm500-claim')
  slug: string;
  category: string;
  headline: string;
  summary: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string; // e.g. '11 November 2026, 4:15 PM'
  readTime: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  paragraphs: ArticleParagraph[];
  relatedArticleIds: string[];
  isFeatured?: boolean;
}

export interface TrendingItem {
  id: string;
  rank: number;
  category: string;
  title: string;
  slug: string;
  viewsLabel: string;
}

