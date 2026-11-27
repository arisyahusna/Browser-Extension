import React from 'react';
import { ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { Button, Card, Icon, Meter } from '@sebenarnya/design-system';
import { useAifa } from '../../context/AifaContext';

export const AIFASimulatedAnalysis: React.FC = () => {
  const { analysisStep, analysisProgress, closePanel, detectedArticle, detectedSocialPost } =
    useAifa();

  const isSocial = Boolean(detectedSocialPost);

  const steps = isSocial
    ? [
        {
          id: 'extracting',
          title: 'Step 1 — Extracting Post Caption',
          desc: 'Reading the text of the selected social media post.',
        },
        {
          id: 'identifying',
          title: 'Step 2 — Identifying Claims',
          desc: 'Detecting factual statements in the post that can be verified.',
        },
        {
          id: 'reviewing',
          title: 'Step 3 — Reviewing Evidence Database',
          desc: 'Cross-referencing Sebenarnya.my and official public records.',
        },
        {
          id: 'complete',
          title: 'Step 4 — Verification Complete',
          desc: 'Post verification results ready.',
        },
      ]
    : [
        {
          id: 'extracting',
          title: 'Step 1 — Extracting Content',
          desc: 'Reading the selected article and identifying relevant information.',
        },
        {
          id: 'identifying',
          title: 'Step 2 — Identifying Claims',
          desc: 'Detecting factual statements that can be verified.',
        },
        {
          id: 'reviewing',
          title: 'Step 3 — Reviewing Evidence',
          desc: 'Comparing identified claims with available reference information.',
        },
        {
          id: 'complete',
          title: 'Step 4 — Analysis Complete',
          desc: 'Your verification results are ready.',
        },
      ];

  const getStepStatus = (stepId: string) => {
    const stepOrder = ['extracting', 'identifying', 'reviewing', 'complete'];
    const currentIndex = stepOrder.indexOf(analysisStep);
    const thisIndex = stepOrder.indexOf(stepId);

    if (thisIndex < currentIndex) return 'completed';
    if (thisIndex === currentIndex) return 'active';
    return 'pending';
  };

  const titleText = isSocial
    ? detectedSocialPost?.author.name || 'Social Media Post'
    : detectedArticle?.title || 'Selected Article';

  return (
    <div className="px-4 py-16 flex flex-col gap-block">
      {/* Top Banner */}
      <div className="pt-8 flex flex-col items-center gap-text text-center">
        <div className="size-avatar rounded-full bg-card text-foreground flex items-center justify-center">
          <Icon icon={ShieldCheck} size="xl" className="animate-pulse" />
        </div>
        <h3 className="text-heading text-foreground">AIFA Assistant Analysing Content</h3>
        <p className="w-full text-body-sm text-muted-foreground truncate">{titleText}</p>
      </div>

      {/* Progress */}
      <Meter label="Verification Pipeline" value={analysisProgress} max={100} valueText={`${analysisProgress}%`} />

      {/* Steps List */}
      <div className="flex flex-col gap-8">
        {steps.map((st) => {
          const status = getStepStatus(st.id);
          return (
            <Card
              key={st.id}
              variant={status === 'active' ? 'outline' : 'raised'}
              size="sm"
              className={`transition-opacity duration-base ease-out ${status === 'pending' ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start gap-12">
                <div className="shrink-0">
                  {status === 'completed' && <Icon icon={CheckCircle2} className="text-success" />}
                  {status === 'active' && <Icon icon={Loader2} className="animate-spin" />}
                  {status === 'pending' && (
                    <span className="block size-icon rounded-full border border-border" aria-hidden="true" />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className={`text-label-sm ${status === 'pending' ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {st.title}
                  </h4>
                  <p className="text-caption text-muted-foreground">{st.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Cancel option */}
      <div className="text-center">
        <Button variant="quiet" size="sm" onClick={closePanel}>
          Cancel Verification
        </Button>
      </div>
    </div>
  );
};
