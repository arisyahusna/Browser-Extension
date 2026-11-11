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
    imageOcr: {
      imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Viral announcement poster regarding annual payment',
      badgeLabel: 'Forwarded Graphic Attachment',
      extractedText:
        'RM500 ANNUAL PAYMENT\nEffective immediately for all citizens\nNational Registry Mandatory Contribution',
      formattingNotes:
        'Image text extracted (demo). Mimics formal ministry notice layout, but contains no official departmental seal or gazette registration.',
      boundingBoxes: [
        {
          id: 'ocr-box-1',
          claimId: 'soc-claim-1',
          top: 22,
          left: 10,
          width: 80,
          height: 18,
          text: 'RM500 ANNUAL PAYMENT',
        },
        {
          id: 'ocr-box-2',
          claimId: 'soc-claim-2',
          top: 52,
          left: 12,
          width: 76,
          height: 18,
          text: 'Effective immediately for all citizens',
        },
      ],
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
    imageOcr: {
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Technology workshop exhibition in Cyberjaya',
      badgeLabel: 'Official Event Photo',
      extractedText: 'CYBERJAYA TECH ACCELERATOR 2026\nPublic-Private Ecosystem Launch',
      formattingNotes: 'Standard event banner text extracted.',
      boundingBoxes: [
        {
          id: 'ocr-tech-1',
          top: 15,
          left: 15,
          width: 70,
          height: 22,
          text: 'CYBERJAYA TECH ACCELERATOR 2026',
        },
      ],
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
    imageOcr: {
      imageUrl: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
      imageAlt: 'Infographic on digital verification habits',
      badgeLabel: 'Infographic Guide',
      extractedText: '3-STEP CHECK:\n1. SOURCE CITATION\n2. TIMESTAMP\n3. OFFICIAL GAZETTES',
      formattingNotes: 'Infographic layout verified against public media literacy guidelines.',
      boundingBoxes: [
        {
          id: 'ocr-pulse-1',
          claimId: 'pulse-claim-1',
          top: 25,
          left: 15,
          width: 70,
          height: 35,
          text: '3-STEP CHECK: SOURCE • DATE • OFFICIAL SITES',
        },
      ],
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
      'The viral post combines a sensational social caption with an unverified poster graphic. No gazetted statutory order or official ministry announcement corroborates an annual RM500 citizen fee.',
    summary:
      'This viral post forwards an administrative graphic alleging an annual RM500 payment requirement for Malaysian citizens. Image analysis confirms that while text is formatted like a public announcement, it contains no authorized ministry seal or gazette instrument number. The claim lacks authentic factual substantiation.',
    captionText:
      'VIRAL! Every Malaysian citizen will reportedly need to pay RM500 annually. Is this announcement genuine? Please share to all your WhatsApp groups so your family does not get fined! ⚠️ Read the attached circular below.',
    extractedImageText:
      'RM500 ANNUAL PAYMENT\nEffective immediately for all citizens\nNational Registry Mandatory Contribution',
    imageOcrNotes:
      'Image text extracted (demo). Mimics formal circular formatting without institutional attribution.',
    demoNotice:
      'Demo assessment only — not an official fact-check.',
    claims: [
      {
        id: 'soc-claim-1',
        claimNumber: 1,
        postId: 'post-fb-rm500',
        locationType: 'both',
        imageBoundingBoxId: 'ocr-box-1',
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
      {
        id: 'soc-claim-2',
        claimNumber: 2,
        postId: 'post-fb-rm500',
        locationType: 'image',
        imageBoundingBoxId: 'ocr-box-2',
        statement: 'The payment takes effect immediately.',
        exactArticleText: 'Effective immediately for all citizens',
        verdict: 'unverified',
        verdictLabel: 'Unverified',
        explanation:
          'No authoritative implementation date is provided in the demonstration dataset.',
        evidence:
          'Circulating image text alleges immediate enactment, but statutory levies require gazetted parliamentary authorization before implementation.',
        sourceLabel: 'Federal Constitution of Malaysia (Article 96)',
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
    extractedImageText:
      '3-STEP CHECK: SOURCE • DATE • OFFICIAL SITES',
    imageOcrNotes:
      'Image text extracted (demo). Educational infographic layout verified.',
    demoNotice:
      'Demo assessment only — not an official fact-check.',
    claims: [
      {
        id: 'pulse-claim-1',
        claimNumber: 1,
        postId: 'post-pulse-safety',
        locationType: 'both',
        imageBoundingBoxId: 'ocr-pulse-1',
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
        locationType: 'caption',
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
