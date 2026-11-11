import { VerificationResult } from '../types/aifa';

export const MOCK_VERIFICATION_RESULTS: Record<string, VerificationResult> = {
  'art-rm500-claim': {
    contentId: 'art-rm500-claim',
    contentType: 'article',
    headline: 'Viral RM500 Annual Payment Claim Sparks Questions Among Malaysians',
    platformName: 'Malaysia News Daily',
    sourceWebsite: 'malaysianews-demo.my',
    authorName: 'Farid Zakaria',
    publishedAt: '11 Nov 2026, 2:45 PM',
    verifiedAt: 'Just now (Simulated)',
    overallAssessment: 'unverified',
    overallLabel: 'Unverified',
    assessmentExplanation:
      'The demonstration dataset does not contain sufficient reliable evidence to confirm official government implementation of this annual payment. No official gazette or ministerial circular exists.',
    summary:
      'A viral message claims Malaysian citizens will be mandated to pay RM500 annually to a national registry. Independent checks reveal no statutory notice, ministerial circular, or parliamentary policy on record. The claim currently lacks administrative origin.',
    demoNotice:
      'Demo assessment only. This is not a real fact-check or official finding.',
    claims: [
      {
        id: 'claim-001',
        claimNumber: 1,
        paragraphId: 'claim-para-1',
        statement:
          'All adult citizens will soon be required to remit an annual administrative contribution of RM500 to a newly designated national registry fund.',
        exactArticleText:
          'all adult citizens will soon be required to remit an annual administrative contribution of RM500 to a newly designated national registry fund',
        verdict: 'unverified',
        verdictLabel: 'Unverified',
        explanation:
          'The demonstration dataset does not contain sufficient reliable evidence to establish whether this claim is true or false.',
        evidence:
          'A search across official gazette archives and treasury notices reveals no statutory instrument, bill, or gazetted registry fund establishing an RM500 annual levy on citizens.',
        sourceLabel: 'National Gazette & Legislative Repository (Mock Archive)',
      },
      {
        id: 'claim-002',
        claimNumber: 2,
        paragraphId: 'claim-para-2',
        statement:
          'The purported requirement would take effect in the coming calendar year, with penalties for non-compliance.',
        exactArticleText:
          'the purported requirement would take effect in the coming calendar year, with penalties for non-compliance',
        verdict: 'unverified',
        verdictLabel: 'Unverified',
        explanation:
          'No verifiable implementation date or authoritative supporting document is included in this demonstration dataset.',
        evidence:
          'Independent media literacy monitors report that the circulating forwarded graphic does not reference an authorized departmental spokesperson, enactment date, or legal penalty code.',
        sourceLabel: 'Sebenarnya.my Public Monitoring Feed (Demo Ref: SEB-2026-118)',
      },
      {
        id: 'claim-003',
        claimNumber: 3,
        paragraphId: 'claim-para-5',
        statement:
          'Fiscal obligations and statutory levies must undergo formal parliamentary tabling and gazettement before implementation.',
        exactArticleText:
          'fiscal obligations and statutory levies must undergo formal parliamentary tabling and gazettement before implementation',
        verdict: 'supported',
        verdictLabel: 'Supported',
        explanation:
          'Standard constitutional and statutory procedures require parliamentary approval and gazetting for any national levy.',
        evidence:
          'Under Malaysian constitutional law (Article 96 of the Federal Constitution), no tax or rate shall be levied by or for the purposes of the Federation except under the authority of federal law.',
        sourceLabel: 'Federal Constitution of Malaysia (Article 96)',
      },
    ],
  },

  'art-ai-services': {
    contentId: 'art-ai-services',
    contentType: 'article',
    headline: "Malaysia's Digital Economy Sees Growing Interest in AI-Powered Services",
    platformName: 'Malaysia News Daily',
    sourceWebsite: 'malaysianews-demo.my',
    authorName: 'Nadia S. Ariff',
    publishedAt: '11 Nov 2026, 11:20 AM',
    verifiedAt: 'Just now (Simulated)',
    overallAssessment: 'supported',
    overallLabel: 'Supported',
    assessmentExplanation:
      'The factual statements in this article correspond with documented industry initiatives, regional tech ecosystem investments, and published policy papers.',
    summary:
      'The article discusses general technological adoption and enterprise automation in Malaysia. The statements align with observed digital transformation announcements across regional innovation hubs in Cyberjaya and Penang.',
    demoNotice:
      'Demo assessment only. This is not a real fact-check or official finding.',
    claims: [
      {
        id: 'claim-201',
        claimNumber: 1,
        paragraphId: 'tech-para-1',
        statement:
          'Private corporations, regional startups, and public service providers actively explore the integration of artificial intelligence into their operational frameworks.',
        exactArticleText:
          'private corporations, regional startups, and public service providers actively explore the integration of artificial intelligence and automated language models into their operational frameworks',
        verdict: 'supported',
        verdictLabel: 'Supported',
        explanation:
          'Documented enterprise adoption reports and corporate technology disclosures corroborate rising exploration of AI workflows.',
        evidence:
          'Regional enterprise announcements and public sector digital initiatives document pilot deployments of automated language and processing tools.',
        sourceLabel: 'Industry Digital Transformation Briefing (Mock Reference)',
      },
      {
        id: 'claim-202',
        claimNumber: 2,
        paragraphId: 'tech-para-4',
        statement:
          'Initiatives bridging academic research and private-sector product roadmaps are emerging in technology corridors such as Cyberjaya and Penang.',
        exactArticleText:
          'Initiatives bridging academic research and private-sector product roadmaps are emerging in technology corridors such as Cyberjaya and Penang',
        verdict: 'supported',
        verdictLabel: 'Supported',
        explanation:
          'Consistent with publicly announced technology development programs and innovation sandbox partnerships.',
        evidence:
          'Partnerships between universities and tech hubs in Selangor and Penang have active commercialization roadmaps.',
        sourceLabel: 'National Innovation Sandbox Archives',
      },
    ],
  },

  'art-verify-info': {
    contentId: 'art-verify-info',
    contentType: 'article',
    headline: 'Experts Encourage Malaysians to Verify Information Before Sharing Online',
    platformName: 'Malaysia News Daily',
    sourceWebsite: 'malaysianews-demo.my',
    authorName: 'Kenneth Lee',
    publishedAt: '10 Nov 2026, 5:10 PM',
    verifiedAt: 'Just now (Simulated)',
    overallAssessment: 'supported',
    overallLabel: 'Supported',
    assessmentExplanation:
      'The advice aligns directly with established national media literacy guidelines and empirical fact-checking recommendations.',
    summary:
      'An educational news feature recommending critical evaluation habits before forwarding social messages. The points raised match best practices published by communication authorities and digital safety councils.',
    demoNotice:
      'Demo assessment only. This is not a real fact-check or official finding.',
    claims: [
      {
        id: 'claim-301',
        claimNumber: 1,
        paragraphId: 'safety-para-2',
        statement:
          'Misleading narratives frequently exploit sensational emotional hooks, urgent calls to action, and ambiguous attributions to bypass readers’ natural skepticism.',
        exactArticleText:
          'misleading narratives frequently exploit sensational emotional hooks, urgent calls to action, and ambiguous attributions to bypass readers’ natural skepticism',
        verdict: 'supported',
        verdictLabel: 'Supported',
        explanation:
          'Extensive behavioural research into digital misinformation demonstrates that urgency and emotional triggers decrease cognitive scrutiny.',
        evidence:
          'Media literacy studies and fact-checking organization training manuals emphasize identifying emotional triggers as primary indicators of suspect content.',
        sourceLabel: 'Digital Literacy Educational Framework (Sebenarnya.my Educational Desk)',
      },
      {
        id: 'claim-302',
        claimNumber: 2,
        paragraphId: 'safety-para-4',
        statement:
          'Checking the publication timestamp is particularly crucial, as outdated news items from previous years are frequently recirculated during periods of heightened public discussion.',
        exactArticleText:
          'Checking the publication timestamp is particularly crucial, as outdated news items from previous years are frequently recirculated during periods of heightened public discussion, creating unwarranted confusion',
        verdict: 'supported',
        verdictLabel: 'Supported',
        explanation:
          'Outdated news re-sharing is documented as one of the most frequent vectors for civic confusion in digital messaging groups.',
        evidence:
          'Fact-checking archives indicate recurrent surges of previously debunked or archived circulars re-entering circulation during policy debate cycles.',
        sourceLabel: 'National Fact-Checking Incident Database',
      },
    ],
  },
};
