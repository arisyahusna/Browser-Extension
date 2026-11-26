import { SocialPost } from '../types/social';
import { VerificationResult } from '../types/aifa';

export const MOCK_CONNECT_POSTS: SocialPost[] = [
  {
    id: 'post-fb-rm500',
    platform: 'ConnectSocial',
    author: {
      name: 'KL Community Bulletin',
      handle: '@kl_community_bulletin',
      avatar: '👥',
      verified: true,
    },
    timestamp: '2h ago • Public',
    caption:
      'VIRAL! Every Malaysian citizen will reportedly need to pay RM500 annually. Is this announcement genuine? Please share to all your WhatsApp groups so your family does not get fined! ⚠️ Read the attached circular below.',
    image: {
      url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      alt: 'Viral announcement poster regarding annual payment',
    },
    likesCount: '4.8k',
    repostsCount: '2.1k',
    repliesCount: '842',
    sharesCount: '1.9k',
    isViral: true,
  },
  {
    id: 'post-fb-tech',
    platform: 'ConnectSocial',
    author: {
      name: 'Selangor Innovation Hub',
      handle: '@selangor_hub',
      avatar: '🚀',
      verified: true,
    },
    timestamp: '5h ago • Public',
    caption:
      'Excited to welcome regional digital transformation partners to our Cyberjaya robotics hub today. Enterprise AI adoption is accelerating across Malaysia!',
    image: {
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      alt: 'Technology workshop exhibition in Cyberjaya',
    },
    likesCount: '1.2k',
    repostsCount: '190',
    repliesCount: '45',
    sharesCount: '120',
  },
];

export const MOCK_PULSE_POSTS: SocialPost[] = [
  {
    id: 'post-pulse-safety',
    platform: 'PulseFeed',
    author: {
      name: 'Digital Literacy MY',
      handle: '@literasi_digital',
      avatar: '🛡️',
      verified: true,
    },
    timestamp: '3h',
    caption:
      'Crucial reminder for digital communities: Always verify the primary source and timestamp before forwarding sensational claims. Outdated circulars often recirculate to generate confusion.',
    image: {
      url: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
      alt: 'Infographic on digital verification habits',
    },
    likesCount: '3.4k',
    repostsCount: '1.8k',
    repliesCount: '112',
    sharesCount: '980',
  },
  {
    id: 'post-pulse-text-only',
    platform: 'PulseFeed',
    author: {
      name: 'Rakyat Suara',
      handle: '@suara_rakyat_net',
      avatar: '💬',
    },
    timestamp: '4h',
    caption:
      'Heard viral rumors claiming public transport discounts for senior citizens will be discontinued next month. Can anyone verify if this is genuine or just WhatsApp hearsay?',
    likesCount: '890',
    repostsCount: '412',
    repliesCount: '154',
    sharesCount: '210',
    isViral: true,
  },
  {
    id: 'post-pulse-weather',
    platform: 'PulseFeed',
    author: {
      name: 'MetMalaysia Updates',
      handle: '@metmalaysia_info',
      avatar: '⛅',
      verified: true,
    },
    timestamp: '6h',
    caption:
      'Advisory: Afternoon thunderstorms expected across western coastal districts of Peninsular Malaysia. Stay safe on the road.',
    likesCount: '2.1k',
    repostsCount: '920',
    repliesCount: '38',
    sharesCount: '540',
  },
];

export const MOCK_SOCIAL_VERIFICATIONS: Record<string, VerificationResult> = {
  'post-fb-rm500': {
    contentId: 'post-fb-rm500',
    contentType: 'social-post',
    headline: 'Viral Social Claim: RM500 Annual Payment Mandate',
    platformName: 'ConnectSocial',
    sourceWebsite: 'connectsocial.example/feed',
    authorName: 'KL Community Bulletin (@kl_community_bulletin)',
    publishedAt: 'Today, 2:00 PM',
    verifiedAt: 'Just now (Simulated)',
    overallAssessment: 'unverified',
    overallLabel: 'Unverified',
    assessmentExplanation:
      'The viral post makes a sensational claim about a mandatory annual payment. No gazetted statutory order or official ministry announcement corroborates an annual RM500 citizen fee.',
    summary:
      'This viral post alleges an annual RM500 payment requirement for Malaysian citizens and urges readers to share it widely. No official source has announced such a payment. The claim lacks authentic factual substantiation.',
    captionText:
      'VIRAL! Every Malaysian citizen will reportedly need to pay RM500 annually. Is this announcement genuine? Please share to all your WhatsApp groups so your family does not get fined! ⚠️ Read the attached circular below.',
    demoNotice:
      'Demo assessment only — not an official fact-check.',
    claims: [
      {
        id: 'soc-claim-1',
        claimNumber: 1,
        postId: 'post-fb-rm500',
        statement: 'Every Malaysian citizen must pay RM500 annually.',
        exactArticleText: 'Every Malaysian citizen will reportedly need to pay RM500 annually',
        verdict: 'unverified',
        verdictLabel: 'Unverified',
        explanation:
          'The demonstration dataset does not include sufficient reliable evidence to establish this claim.',
        evidence:
          'No official treasury circular, parliamentary bill, or ministerial press release has been published announcing a universal RM500 citizen levy.',
        sourceLabel: 'Sebenarnya.my Verification Archive & National Gazette (Mock Search)',
      },
    ],
  },

  'post-pulse-safety': {
    contentId: 'post-pulse-safety',
    contentType: 'social-post',
    headline: 'Social Safety Guidance: Verifying Digital Claims',
    platformName: 'PulseFeed',
    sourceWebsite: 'pulsefeed.example/home',
    authorName: 'Digital Literacy MY (@literasi_digital)',
    publishedAt: 'Today, 1:00 PM',
    verifiedAt: 'Just now (Simulated)',
    overallAssessment: 'supported',
    overallLabel: 'Supported',
    assessmentExplanation:
      'The guidance in this post aligns directly with recommended verification habits published by national cyber-safety and communication authorities.',
    summary:
      'Educational microblog post urging digital users to check timestamps and primary sources before sharing viral messages. Factual statements are consistent with standard fact-checking methodologies.',
    captionText:
      'Crucial reminder for digital communities: Always verify the primary source and timestamp before forwarding sensational claims. Outdated circulars often recirculate to generate confusion.',
    demoNotice:
      'Demo assessment only — not an official fact-check.',
    claims: [
      {
        id: 'pulse-claim-1',
        claimNumber: 1,
        postId: 'post-pulse-safety',
        statement: 'Always verify the primary source and timestamp before forwarding sensational claims.',
        exactArticleText: 'Always verify the primary source and timestamp before forwarding sensational claims',
        verdict: 'supported',
        verdictLabel: 'Supported',
        explanation:
          'Corresponds directly with standard media literacy guidelines published by MCMC and Sebenarnya.my.',
        evidence:
          'Verifying publication dates and cross-referencing primary sources are standard verification procedures to combat re-circulated misinformation.',
        sourceLabel: 'National Media Literacy Framework',
      },
    ],
  },

  'post-pulse-text-only': {
    contentId: 'post-pulse-text-only',
    contentType: 'social-post',
    headline: 'Public Query: Public Transport Discount Rumors',
    platformName: 'PulseFeed',
    sourceWebsite: 'pulsefeed.example/home',
    authorName: 'Rakyat Suara (@suara_rakyat_net)',
    publishedAt: 'Today, 12:30 PM',
    verifiedAt: 'Just now (Simulated)',
    overallAssessment: 'unverified',
    overallLabel: 'Unverified',
    assessmentExplanation:
      'The viral rumor circulating regarding the cancellation of senior citizen transport discounts has not been corroborated by the Ministry of Transport or transit operators.',
    summary:
      'A text-only microblog post inquiring about circulating rumors regarding senior citizen transport concessions. No official operator has published announcements discontinuing concession fares.',
    captionText:
      'Heard viral rumors claiming public transport discounts for senior citizens will be discontinued next month. Can anyone verify if this is genuine or just WhatsApp hearsay?',
    demoNotice:
      'Demo assessment only — not an official fact-check.',
    claims: [
      {
        id: 'text-claim-1',
        claimNumber: 1,
        postId: 'post-pulse-text-only',
        statement: 'Public transport discounts for senior citizens will reportedly be discontinued next month.',
        exactArticleText: 'public transport discounts for senior citizens will be discontinued next month',
        verdict: 'unverified',
        verdictLabel: 'Unverified',
        explanation:
          'No official transit operator or ministry announcement indicates discontinuation of concession fares.',
        evidence:
          'Prasarana Malaysia and RapidKL concession policies remain active with no scheduled revocation on public record.',
        sourceLabel: 'RapidKL & Ministry of Transport Concession Portal',
      },
    ],
  },
};

