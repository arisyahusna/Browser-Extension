import { NewsArticle, TrendingItem } from '../types/news';

export const MOCK_ARTICLES: NewsArticle[] = [
  {
    id: 'art-rm500-claim',
    slug: 'viral-rm500-annual-payment-claim-sparks-questions',
    category: 'Malaysia',
    headline: 'Viral RM500 Annual Payment Claim Sparks Questions Among Malaysians',
    summary:
      'A widely circulated social media message alleging a mandatory recurring fee has drawn public attention, though independent verification reveals no verified administrative origin.',
    author: {
      name: 'Farid Zakaria',
      role: 'Senior Domestic Affairs Correspondent',
    },
    publishedAt: '11 November 2026, 2:45 PM',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'A smartphone screen displaying social messaging forwards in Kuala Lumpur.',
    imageCredit: 'MND Photo / Ahmad Izzat',
    isFeatured: true,
    paragraphs: [
      {
        id: 'claim-para-1',
        type: 'paragraph',
        text: 'A viral message circulating across popular messaging applications and social media platforms has sparked widespread discussion among Malaysians over the past forty-eight hours. The unverified post claims that all adult citizens will soon be required to remit an annual administrative contribution of RM500 to a newly designated national registry fund.',
      },
      {
        id: 'claim-para-2',
        type: 'paragraph',
        text: 'The claims, frequently accompanied by formatted text graphics imitating formal announcements, suggest that the purported requirement would take effect in the coming calendar year, with penalties for non-compliance.',
      },
      {
        id: 'claim-sub-1',
        type: 'subheading',
        text: 'Origins of the Online Circulation',
      },
      {
        id: 'claim-para-3',
        type: 'paragraph',
        text: 'A review of public discussion channels indicates that the message began circulating within community chat groups before being republished by several high-engagement social media pages. However, the posts fail to cite any gazetted policy document, legislative reference, or identifiable institution.',
      },
      {
        id: 'claim-para-4',
        type: 'paragraph',
        text: 'Community monitors observe that the forwarded messages lack standard verification markers, including referenced departmental circulars or authorized spokesperson statements. The text relies largely on sensational phrasing intended to encourage swift forwarding.',
      },
      {
        id: 'claim-sub-2',
        type: 'subheading',
        text: 'Independent Scrutiny and Public Caution',
      },
      {
        id: 'claim-para-5',
        type: 'paragraph',
        text: 'Civic transparency observers have highlighted that fiscal obligations and statutory levies must undergo formal parliamentary tabling and gazettement before implementation. No such statutory proposal or policy debate has been documented on the public record.',
      },
      {
        id: 'claim-para-6',
        type: 'paragraph',
        text: 'Members of the public are advised to exercise critical discernment when encountering unverified messages regarding financial requirements, and to cross-check claims against primary institutional publication channels before forwarding them to friends and family.',
      },
    ],
    relatedArticleIds: ['art-verify-info', 'art-ai-services'],
  },
  {
    id: 'art-ai-services',
    slug: 'malaysias-digital-economy-sees-growing-interest-in-ai-powered-services',
    category: 'Technology',
    headline: "Malaysia's Digital Economy Sees Growing Interest in AI-Powered Services",
    summary:
      'Enterprises and public agencies are progressively evaluating intelligent automation tools to enhance workflow efficiency and service delivery across diverse sectors.',
    author: {
      name: 'Nadia S. Ariff',
      role: 'Technology & Innovation Reporter',
    },
    publishedAt: '11 November 2026, 11:20 AM',
    readTime: '5 min read',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Technology researchers testing localized automated workflows at an innovation center in Cyberjaya.',
    imageCredit: 'Tech In Asia / MND Archive',
    isFeatured: false,
    paragraphs: [
      {
        id: 'tech-para-1',
        type: 'paragraph',
        text: "Malaysia's technological landscape is observing a marked shift as private corporations, regional startups, and public service providers actively explore the integration of artificial intelligence and automated language models into their operational frameworks.",
      },
      {
        id: 'tech-para-2',
        type: 'paragraph',
        text: 'Industry practitioners report that interest has moved beyond conceptual experimentation toward targeted functional deployments, including automated customer service interfaces, multilingual document processing, and assistive research tooling.',
      },
      {
        id: 'tech-sub-1',
        type: 'subheading',
        text: 'Focus on Regional Infrastructure and Skills',
      },
      {
        id: 'tech-para-3',
        type: 'paragraph',
        text: 'Technology leaders emphasize that sustainable adoption requires reliable domestic computational infrastructure, localized language models capable of understanding regional dialects, and continuous training programs for technical workforces.',
      },
      {
        id: 'tech-para-4',
        type: 'paragraph',
        text: 'Initiatives bridging academic research and private-sector product roadmaps are emerging in technology corridors such as Cyberjaya and Penang, signaling broader confidence in regional technical capabilities.',
      },
      {
        id: 'tech-sub-2',
        type: 'subheading',
        text: 'Governance and Ethical Deployment',
      },
      {
        id: 'tech-para-5',
        type: 'paragraph',
        text: 'Concurrently, industry roundtables have placed growing emphasis on data privacy, ethical parameters, and transparent system oversight. Ensuring that algorithmic models operate with appropriate accountability remains a cornerstone of the emerging regulatory conversation.',
      },
    ],
    relatedArticleIds: ['art-rm500-claim', 'art-verify-info'],
  },
  {
    id: 'art-verify-info',
    slug: 'experts-encourage-malaysians-to-verify-information-before-sharing-online',
    category: 'Online Safety',
    headline: 'Experts Encourage Malaysians to Verify Information Before Sharing Online',
    summary:
      'Digital literacy advocates underscore the importance of examining publication dates, institutional sources, and corroborating evidence to curb the spread of misinformation.',
    author: {
      name: 'Kenneth Lee',
      role: 'Media Literacy & Society Desk',
    },
    publishedAt: '10 November 2026, 5:10 PM',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'A participant reviewing source citations during a digital literacy workshop in Petaling Jaya.',
    imageCredit: 'Editorial Media Group',
    isFeatured: false,
    paragraphs: [
      {
        id: 'safety-para-1',
        type: 'paragraph',
        text: 'With digital communication channels enabling near-instantaneous content dissemination, media literacy advocates are renewing calls for internet users to cultivate habits of systematic information verification prior to sharing materials with online networks.',
      },
      {
        id: 'safety-para-2',
        type: 'paragraph',
        text: 'Researchers observe that misleading narratives frequently exploit sensational emotional hooks, urgent calls to action, and ambiguous attributions to bypass readers’ natural skepticism.',
      },
      {
        id: 'safety-sub-1',
        type: 'subheading',
        text: 'Three Practical Verification Habits',
      },
      {
        id: 'safety-para-3',
        type: 'paragraph',
        text: 'Experts recommend a simple three-step approach: first, inspect the primary source of the claim; second, cross-reference the report across established news outlets; and third, verify whether attached photographs or video clips have been reused out of original context.',
      },
      {
        id: 'safety-para-4',
        type: 'paragraph',
        text: 'Checking the publication timestamp is particularly crucial, as outdated news items from previous years are frequently recirculated during periods of heightened public discussion, creating unwarranted confusion.',
      },
      {
        id: 'safety-sub-2',
        type: 'subheading',
        text: 'The Role of Modern Verification Tools',
      },
      {
        id: 'safety-para-5',
        type: 'paragraph',
        text: 'The advent of assistive browser-based verification tools and national fact-checking repositories provides users with increasingly accessible means to evaluate disputed content in real-time. By building a routine of pausing before forwarding, digital communities contribute directly to a healthier information ecosystem.',
      },
    ],
    relatedArticleIds: ['art-rm500-claim', 'art-ai-services'],
  },
  {
    id: 'art-cyber-security',
    slug: 'financial-institutions-enhance-security-protocols-for-online-banking',
    category: 'Business',
    headline: 'Commercial Banks Implement Additional Safeguards for Digital Transactions',
    summary:
      'Banking groups continue rolling out enhanced multi-factor verification features to protect consumer deposits against emerging social engineering methods.',
    author: {
      name: 'Tan Mei Ling',
      role: 'Banking & Financial Markets',
    },
    publishedAt: '11 November 2026, 9:15 AM',
    readTime: '3 min read',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Digital banking application running secure verification protocol on tablet.',
    imageCredit: 'MND Business',
    isFeatured: false,
    paragraphs: [
      {
        id: 'biz-para-1',
        type: 'paragraph',
        text: 'Commercial banking institutions across the country are refining their application security checkpoints, integrating device binding and behavioral analytics to counter sophisticated phishing schemes.',
      },
      {
        id: 'biz-para-2',
        type: 'paragraph',
        text: 'Representatives from the banking association noted that customer awareness campaigns remain an essential counterpart to technical safeguards, encouraging customers to never disclose verification codes to third parties.',
      },
    ],
    relatedArticleIds: ['art-verify-info', 'art-ai-services'],
  },
  {
    id: 'art-clean-energy',
    slug: 'solar-energy-adoption-gains-traction-among-industrial-estates',
    category: 'Business',
    headline: 'Rooftop Solar Installations Expand Across Industrial Parks',
    summary:
      'Manufacturing facilities in Selangor and Johor are turning toward photovoltaic arrays to manage utility expenditures and achieve environmental benchmarks.',
    author: {
      name: 'Zulhazmi Rahman',
      role: 'Energy & Infrastructure',
    },
    publishedAt: '10 November 2026, 3:30 PM',
    readTime: '4 min read',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Commercial solar array installed atop an industrial logistics hub.',
    imageCredit: 'CleanTech Images',
    isFeatured: false,
    paragraphs: [
      {
        id: 'energy-para-1',
        type: 'paragraph',
        text: 'Industrial estates across the central and southern corridors of Peninsular Malaysia are seeing accelerated rooftop solar adoption as companies look to offset peak daytime operating costs.',
      },
      {
        id: 'energy-para-2',
        type: 'paragraph',
        text: 'Corporate sustainability disclosures and export supply-chain criteria are also motivating enterprise operators to transition toward renewable on-site power generation.',
      },
    ],
    relatedArticleIds: ['art-ai-services', 'art-rm500-claim'],
  },
];

export const MOCK_TRENDING: TrendingItem[] = [
  {
    id: 'trend-1',
    rank: 1,
    category: 'Malaysia',
    title: 'Viral RM500 Annual Payment Claim Sparks Questions Among Malaysians',
    slug: 'viral-rm500-annual-payment-claim-sparks-questions',
    viewsLabel: '42.8k views today',
  },
  {
    id: 'trend-2',
    rank: 2,
    category: 'Online Safety',
    title: 'Experts Encourage Malaysians to Verify Information Before Sharing Online',
    slug: 'experts-encourage-malaysians-to-verify-information-before-sharing-online',
    viewsLabel: '28.1k views today',
  },
  {
    id: 'trend-3',
    rank: 3,
    category: 'Technology',
    title: "Malaysia's Digital Economy Sees Growing Interest in AI-Powered Services",
    slug: 'malaysias-digital-economy-sees-growing-interest-in-ai-powered-services',
    viewsLabel: '19.4k views today',
  },
  {
    id: 'trend-4',
    rank: 4,
    category: 'Business',
    title: 'Commercial Banks Implement Additional Safeguards for Digital Transactions',
    slug: 'financial-institutions-enhance-security-protocols-for-online-banking',
    viewsLabel: '15.6k views today',
  },
  {
    id: 'trend-5',
    rank: 5,
    category: 'Business',
    title: 'Rooftop Solar Installations Expand Across Industrial Parks',
    slug: 'solar-energy-adoption-gains-traction-among-industrial-estates',
    viewsLabel: '11.2k views today',
  },
];

export const CATEGORIES = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'malaysia', label: 'Malaysia', path: '/category/malaysia' },
  { id: 'world', label: 'World', path: '/category/world' },
  { id: 'politics', label: 'Politics', path: '/category/politics' },
  { id: 'business', label: 'Business', path: '/category/business' },
  { id: 'technology', label: 'Technology', path: '/category/technology' },
  { id: 'lifestyle', label: 'Lifestyle', path: '/category/lifestyle' },
];
