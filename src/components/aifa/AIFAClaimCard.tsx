import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Send,
} from 'lucide-react';
import { ClaimAnalysis, ClaimVerdict } from '../../types/aifa';
import { useAifa } from '../../context/AifaContext';

interface AIFAClaimCardProps {
  claim: ClaimAnalysis;
  isExpanded: boolean;
  isActive: boolean;
  onToggle: () => void;
  onLocate: () => void;
}

const locateButton =
  'flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#F4EBCB] hover:bg-[#EDDFAF] text-[#715C1C] font-semibold text-[11px] transition-colors cursor-pointer';

export const AIFAClaimCard: React.FC<AIFAClaimCardProps> = ({
  claim,
  isExpanded,
  isActive,
  onToggle,
  onLocate,
}) => {
  const { openFactCheckForm, locateClaimInSocialPost } = useAifa();

  const getVerdictBadge = (verdict: ClaimVerdict) => {
    const base = 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold';
    switch (verdict) {
      case 'supported':
        return (
          <span className={`${base} bg-[#DFE6F5] text-[#3F5C9E]`}>
            <CheckCircle2 className="w-3 h-3" />
            Supported
          </span>
        );
      case 'false':
        return (
          <span className={`${base} bg-[#F7DEDB] text-[#9B3D36]`}>
            <XCircle className="w-3 h-3" />
            False
          </span>
        );
      case 'misleading':
        return (
          <span className={`${base} bg-[#F4EBCB] text-[#715C1C]`}>
            <AlertTriangle className="w-3 h-3" />
            Misleading
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className={`${base} bg-[#E2E4EA] text-[#5C5A56]`}>
            <HelpCircle className="w-3 h-3" />
            Unverified
          </span>
        );
    }
  };

  const isSocialClaim = Boolean(claim.postId);

  return (
    <div
      className={`rounded-[22px] bg-white border transition-colors duration-150 overflow-hidden ${
        isActive
          ? 'border-[#E8CF85] ring-2 ring-[#F4EBCB]'
          : 'border-transparent hover:border-[#2A2A2A]/10'
      }`}
    >
      {/* Card Header / Summary Row */}
      <div
        onClick={onToggle}
        className="p-4 cursor-pointer flex items-start gap-3 select-none"
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
        <div className="w-7 h-7 rounded-full bg-[#2A2A2A] text-white font-semibold text-[10px] flex items-center justify-center shrink-0">
          #{claim.claimNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-semibold text-[#6F6D69]">
                Claim {claim.claimNumber}
              </span>
              {getVerdictBadge(claim.verdict)}
            </div>

            <button
              type="button"
              className="w-7 h-7 flex items-center justify-center text-[#6F6D69] hover:text-[#2A2A2A] hover:bg-[#E2E4EA] rounded-full transition-colors"
              aria-label={isExpanded ? 'Collapse claim' : 'Expand claim'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[13px] font-medium text-[#2A2A2A] leading-snug">
            "{claim.statement}"
          </p>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-3 text-xs">
          {/* Explanation */}
          <div className="pt-3 border-t border-[#E0DED9]">
            <h5 className="text-[11px] font-semibold text-[#2A2A2A] mb-1">
              Assessment Analysis
            </h5>
            <p className="text-[#5C5A56] leading-relaxed text-[11.5px]">
              {claim.explanation}
            </p>
          </div>

          {/* Evidence / Source findings */}
          <div className="rounded-2xl bg-[#F4F3F1] p-3 space-y-1">
            <h5 className="text-[11px] font-semibold text-[#2A2A2A] flex items-center gap-1">
              <span>Supporting Reference & Evidence</span>
            </h5>
            <p className="text-[#5C5A56] text-[11px] leading-relaxed">
              {claim.evidence}
            </p>
            {claim.sourceLabel && (
              <div className="pt-1 text-[10.5px] text-[#6F6D69] flex items-center gap-1 font-mono">
                <span className="truncate">Source: {claim.sourceLabel}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {isSocialClaim ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    locateClaimInSocialPost(claim.id);
                  }}
                  className={locateButton}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Locate in Post</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocate();
                  }}
                  className={locateButton}
                  title="Locate and highlight this claim in the article"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Locate in Article</span>
                </button>
              )}
            </div>

            {/* Request Fact-Check Button for Unverified Claims */}
            {claim.verdict === 'unverified' && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  openFactCheckForm(claim);
                }}
                className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-[#2A2A2A] hover:bg-black text-white font-semibold text-[11px] transition-colors cursor-pointer"
                title="Request official fact-checking by Sebenarnya.my"
              >
                <Send className="w-3 h-3" />
                <span>Request Fact-Check</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
