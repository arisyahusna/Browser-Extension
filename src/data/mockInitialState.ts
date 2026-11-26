import { VerificationHistoryRecord, NotificationItem, UserProfile } from '../types/aifa';
import { FactCheckRequest } from '../types/social';
import { MOCK_VERIFICATION_RESULTS } from './mockVerificationResults';

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'AIFA Demo User',
  email: 'demo@example.com',
  avatar: '👤',
  isConnected: true, // Default connected so all features are interactive immediately, with disconnect/reconnect option
  connectedAt: '11 Nov 2026, 10:00 AM',
};

export const INITIAL_HISTORY: VerificationHistoryRecord[] = [
  {
    id: 'hist-001',
    contentId: 'art-ai-services',
    contentType: 'article',
    headline: "Malaysia's Digital Economy Sees Growing Interest in AI-Powered Services",
    platformName: 'Malaysia News Daily',
    sourceUrl: 'https://www.malaysianews-demo.my/articles/malaysias-digital-economy-sees-growing-interest-in-ai-powered-services',
    verifiedAt: '11 Nov 2026, 11:25 AM',
    overallAssessment: 'supported',
    overallLabel: 'Supported',
    summary: 'The article discusses general technological adoption and enterprise automation in Malaysia. Statements align with documented initiatives in Cyberjaya and Penang.',
    claimsCount: 2,
    result: MOCK_VERIFICATION_RESULTS['art-ai-services'],
  },
  {
    id: 'hist-002',
    contentId: 'art-verify-info',
    contentType: 'article',
    headline: 'Experts Encourage Malaysians to Verify Information Before Sharing Online',
    platformName: 'Malaysia News Daily',
    sourceUrl: 'https://www.malaysianews-demo.my/articles/experts-encourage-malaysians-to-verify-information-before-sharing-online',
    verifiedAt: '10 Nov 2026, 5:15 PM',
    overallAssessment: 'supported',
    overallLabel: 'Supported',
    summary: 'An educational news feature recommending critical evaluation habits before forwarding social messages. Aligns with national media literacy guidance.',
    claimsCount: 2,
    result: MOCK_VERIFICATION_RESULTS['art-verify-info'],
  },
];

export const INITIAL_REQUESTS: FactCheckRequest[] = [
  {
    id: 'req-init-1',
    referenceNumber: 'AIFA-DEMO-001',
    claimId: 'claim-001',
    claimText: 'All adult citizens will soon be required to remit an annual administrative contribution of RM500 to a newly designated national registry fund.',
    articleOrPostId: 'art-rm500-claim',
    title: 'Viral RM500 Annual Payment Claim Sparks Questions Among Malaysians',
    sourceUrl: 'https://www.malaysianews-demo.my/articles/viral-rm500-annual-payment-claim-sparks-questions',
    sourcePlatform: 'Malaysia News Daily',
    additionalNotes: 'Forwarded in numerous community groups. Citizen inquired whether there is any official gazette or ministerial circular.',
    includeSupportingContent: true,
    supportingContentSummary: 'Circulating unverified social forward claiming mandatory RM500 fee.',
    timestamp: '11 Nov 2026, 2:50 PM',
    status: 'Submitted',
    lastUpdated: '11 Nov 2026, 2:50 PM',
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-001',
    title: 'AIFA Extension Connected',
    message: 'Your Sebenarnya.my account has been linked to the AIFA browser extension.',
    relatedRequestId: '',
    referenceNumber: '',
    timestamp: '11 Nov 2026, 10:00 AM',
    isRead: false,
    type: 'system',
  },
];

