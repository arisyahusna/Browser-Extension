export interface SocialImage {
  url: string;
  alt: string;
}

export interface SocialAuthor {
  name: string;
  handle: string;
  avatar: string;
  verified?: boolean;
}

export interface SocialPost {
  id: string;
  platform: 'ConnectSocial' | 'PulseFeed';
  author: SocialAuthor;
  timestamp: string;
  caption: string;
  image?: SocialImage;
  likesCount: string;
  repostsCount: string;
  repliesCount: string;
  sharesCount: string;
  isViral?: boolean;
}

export type FactCheckRequestStatus = 'Submitted' | 'Under Review' | 'Completed';

export interface FactCheckRequest {
  id: string;
  referenceNumber: string; // e.g. 'AIFA-DEMO-001'
  claimId: string;
  claimText: string;
  articleOrPostId: string;
  title: string;
  sourceUrl: string;
  sourcePlatform: string;
  additionalNotes: string;
  includeSupportingContent: boolean;
  supportingContentSummary: string;
  timestamp: string;
  status: FactCheckRequestStatus;
  reviewOutcome?: string;
  lastUpdated: string;
}
