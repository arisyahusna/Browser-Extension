import React from 'react';
import { ChevronDown, ChevronUp, MapPin, Send } from 'lucide-react';
import { Button, IconButton } from '@sebenarnya/design-system';
import { ClaimAnalysis, ClaimVerdict } from '../../types/aifa';
import { useAifa } from '../../context/AifaContext';
import { AssessmentLabel } from '../shared/AssessmentLabel';

interface AIFAClaimCardProps {
  claim: ClaimAnalysis;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  onLocate: () => void;
}

const VERDICT_WORDS: Record<ClaimVerdict, string> = {
  supported: 'Supported',
  false: 'False',
  misleading: 'Misleading',
  unverified: 'Unverified',
};

export const AIFAClaimCard: React.FC<AIFAClaimCardProps> = ({
  claim,
  isExpanded,
  isActive,
  onToggle,
  onLocate,
}) => {
  const { openFactCheckForm, locateClaimInSocialPost } = useAifa();

  const isSocialClaim = Boolean(claim.postId);

  return (
    <div
      className={`rounded-card bg-card border overflow-hidden transition-colors duration-fast ease-out ${
        isActive ? 'border-foreground' : 'border-transparent hover:border-border'
      }`}
    >
      {/* Card Header / Summary Row (accordion trigger: the design system has no accordion) */}
      <div
        onClick={onToggle}
        className="p-card-sm cursor-pointer flex items-start gap-12 select-none"
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggle();
          }
        }}
      >
        <div className="size-badge rounded-full bg-primary text-primary-foreground text-caption flex items-center justify-center shrink-0">
          #{claim.claimNumber}
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-6">
          <div className="flex items-center justify-between gap-inline">
            <div className="flex items-center gap-6">
              <span className="text-caption text-muted-foreground">Claim {claim.claimNumber}</span>
              <AssessmentLabel assessment={claim.verdict} label={VERDICT_WORDS[claim.verdict] ?? VERDICT_WORDS.unverified} />
            </div>

            {/* No onClick: the click bubbles to the row, as before */}
            <IconButton
              icon={isExpanded ? ChevronUp : ChevronDown}
              label={isExpanded ? 'Collapse claim' : 'Expand claim'}
              variant="quiet"
              size="icon-sm"
            />
          </div>

          <p className="text-body-sm font-medium text-foreground">"{claim.statement}"</p>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-card-sm pb-card-sm flex flex-col gap-12">
          {/* Explanation */}
          <div className="pt-12 border-t border-border flex flex-col gap-4">
            <h5 className="text-label-sm text-foreground">Assessment Analysis</h5>
            <p className="text-body-sm text-text-secondary">{claim.explanation}</p>
          </div>

          {/* Evidence / Source findings */}
          <div className="rounded-media bg-muted p-12 flex flex-col gap-4">
            <h5 className="text-label-sm text-foreground">Supporting Reference & Evidence</h5>
            <p className="text-body-sm text-text-secondary">{claim.evidence}</p>
            {claim.sourceLabel && (
              <p className="text-caption text-muted-foreground truncate">Source: {claim.sourceLabel}</p>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-inline">
            {isSocialClaim ? (
              <Button
                variant="secondary"
                size="sm"
                icon={MapPin}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  locateClaimInSocialPost(claim.id);
                }}
              >
                Locate in Post
              </Button>
            ) : (
              <Button
                variant="secondary"
                size="sm"
                icon={MapPin}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  onLocate();
                }}
                title="Locate and highlight this claim in the article"
              >
                Locate in Article
              </Button>
            )}

            {/* Request Fact-Check Button for Unverified Claims */}
            {claim.verdict === 'unverified' && (
              <Button
                size="sm"
                icon={Send}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  openFactCheckForm(claim);
                }}
                title="Request official fact-checking by Sebenarnya.my"
              >
                Request Fact-Check
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
