import React from 'react';
import { SocialImageOcr } from '../../types/social';
import { useAifa } from '../../context/AifaContext';
import { Scan, Eye } from 'lucide-react';

interface SocialImageWithOcrProps {
  imageOcr: SocialImageOcr;
  postId: string;
}

export const SocialImageWithOcr: React.FC<SocialImageWithOcrProps> = ({
  imageOcr,
  postId,
}) => {
  const { activeClaimId, verificationResult, locateClaimInSocialPost } = useAifa();

  const isVerifiedForThisPost = verificationResult?.contentId === postId;

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 select-none group">
      {/* Base Image Display */}
      <div className="relative aspect-4/3 w-full bg-slate-100 flex items-center justify-center overflow-hidden">
        <img
          src={imageOcr.imageUrl}
          alt={imageOcr.imageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-900/10 to-transparent pointer-events-none" />

        {/* Visible Simulated Poster Headline Overlay if image graphic represents circular */}
        {imageOcr.boundingBoxes.map((box) => {
          const matchingClaim = verificationResult?.claims.find(
            (c) => c.imageBoundingBoxId === box.id || (c.postId === postId && c.locationType === 'image')
          );
          const isBoxActive = matchingClaim && activeClaimId === matchingClaim.id;

          return (
            <div
              key={box.id}
              onClick={() => {
                if (matchingClaim) {
                  locateClaimInSocialPost(matchingClaim.id, 'image');
                }
              }}
              style={{
                top: `${box.top}%`,
                left: `${box.left}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
              }}
              className={`absolute flex items-center justify-center p-2 rounded transition-all duration-300 cursor-pointer ${
                isBoxActive
                  ? 'bg-amber-400/50 border-2 border-amber-400 shadow-lg ring-4 ring-amber-300/80 z-20'
                  : isVerifiedForThisPost
                  ? 'bg-amber-300/25 border border-amber-300/80 hover:bg-amber-300/40 z-10'
                  : 'bg-black/40 border border-white/20'
              }`}
            >
              <span
                className={`font-mono text-center font-bold tracking-wider uppercase drop-shadow-md text-xs sm:text-sm ${
                  isBoxActive ? 'text-amber-950 bg-amber-100/90 px-2 py-0.5 rounded' : 'text-white'
                }`}
              >
                {box.text}
              </span>

              {isBoxActive && (
                <span className="absolute -top-3.5 right-1 px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 text-[9px] font-bold shadow-xs">
                  OCR Match
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Subtle OCR Scan Badge Bar */}
      <div className="bg-slate-950/90 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-300 border-t border-slate-800">
        <span className="flex items-center gap-1.5 font-medium">
          <Scan className="w-3.5 h-3.5 text-rose-400" />
          <span>{imageOcr.badgeLabel}</span>
        </span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
          <Eye className="w-3 h-3 text-slate-400" />
          AIFA OCR Ready
        </span>
      </div>
    </div>
  );
};

