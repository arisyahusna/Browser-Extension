import React from 'react';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Scan,
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

export const AIFAClaimCard: React.FC<AIFAClaimCardProps> = ({
  claim,
  isExpanded,
  isActive,
  onToggle,
  onLocate,
}) => {
  const { openFactCheckForm, locateClaimInSocialPost } = useAifa();

  const getVerdictBadge = (verdict: ClaimVerdict) => {
    switch (verdict) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Supported
          </span>
        );
      case 'false':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" />
            False
          </span>
        );
      case 'misleading':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            Misleading
          </span>
        );
      case 'unverified':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <HelpCircle className="w-3 h-3 text-slate-500" />
            Unverified
          </span>
        );
    }
  };

  const isSocialClaim = Boolean(claim.postId);

  return (
    <div
      className={`rounded-xl border transition-all duration-150 overflow-hidden ${
        isActive
          ? 'border-amber-400 bg-amber-50/20 shadow-sm ring-1 ring-amber-300'
          : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Card Header / Summary Row */}
      <div
        onClick={onToggle}
        className="p-3.5 cursor-pointer flex items-start gap-3 select-none"
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
        <div className="w-5 h-5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-slate-200">
          #{claim.claimNumber}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Claim {claim.claimNumber}
              </span>
              {getVerdictBadge(claim.verdict)}
            </div>

            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded"
              aria-label={isExpanded ? 'Collapse claim' : 'Expand claim'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-xs font-medium text-slate-800 leading-snug">
            "{claim.statement}"
          </p>
        </div>
      </div>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-100 space-y-3 bg-[#FAFBFD]/60 text-xs">
          {/* Explanation */}
          <div>
            <h5 className="text-[10.5px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Assessment Analysis
            </h5>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">
              {claim.explanation}
            </p>
          </div>

          {/* Evidence / Source findings */}
          <div className="rounded-lg bg-white border border-slate-200 p-2.5 space-y-1">
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
              <span>Supporting Reference & Evidence</span>
            </h5>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              {claim.evidence}
            </p>
            {claim.sourceLabel && (
              <div className="pt-1 text-[10.5px] text-slate-400 flex items-center gap-1 font-mono">
                <span className="truncate">Source: {claim.sourceLabel}</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {isSocialClaim ? (
                <>
                  {claim.locationType === 'image' ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        locateClaimInSocialPost(claim.id, 'image');
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      <Scan className="w-3.5 h-3.5 text-amber-600" />
                      <span>Locate in Image (OCR)</span>
                    </button>
                  ) : claim.locationType === 'both' ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          locateClaimInSocialPost(claim.id, 'caption');
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium text-[10.5px] transition-colors"
                      >
                        <MapPin className="w-3 h-3 text-amber-600" />
                        <span>In Caption</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          locateClaimInSocialPost(claim.id, 'image');
                        }}
                        className="flex items-center gap-1 px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium text-[10.5px] transition-colors"
                      >
                        <Scan className="w-3 h-3 text-amber-600" />
                        <span>In Image (OCR)</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        locateClaimInSocialPost(claim.id, 'caption');
                      }}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium text-[11px] transition-colors cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>Locate in Post</span>
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocate();
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-medium text-[11px] transition-colors cursor-pointer"
                  title="Locate and highlight this claim in the article"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
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
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-[#D93043] border border-rose-200 font-semibold text-[11px] transition-colors cursor-pointer"
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
