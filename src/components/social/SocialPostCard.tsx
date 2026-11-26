import React from 'react';
import { SocialPost } from '../../types/social';
import { useAifa } from '../../context/AifaContext';
import {
  ShieldCheck,
  Heart,
  Repeat2,
  MessageCircle,
  Share,
} from 'lucide-react';

interface SocialPostCardProps {
  post: SocialPost;
}

export const SocialPostCard: React.FC<SocialPostCardProps> = ({ post }) => {
  const {
    activeHoveredPostId,
    setActiveHoveredPostId,
    triggerVerification,
    verificationResult,
    activeClaimId,
    locateClaimInSocialPost,
    panelMode,
  } = useAifa();

  const isPostHovered = activeHoveredPostId === post.id;
  const isPostVerified = verificationResult?.contentId === post.id;
  const isHighlighted = isPostHovered || isPostVerified;

  const renderCaptionWithClaimHighlights = (caption: string) => {
    if (!isPostVerified || !verificationResult) {
      return caption;
    }

    // Check if any claim in verificationResult matches caption
    const claim = verificationResult.claims.find((c) => c.postId === post.id);

    if (!claim) return caption;

    const lowerCaption = caption.toLowerCase();
    const lowerMatch = claim.exactArticleText.toLowerCase();
    const index = lowerCaption.indexOf(lowerMatch);

    if (index === -1) {
      return caption;
    }

    const before = caption.slice(0, index);
    const matched = caption.slice(index, index + claim.exactArticleText.length);
    const after = caption.slice(index + claim.exactArticleText.length);
    const isSelected = activeClaimId === claim.id;

    return (
      <>
        {before}
        <span
          data-aifa-claim-id={claim.id}
          onClick={() => locateClaimInSocialPost(claim.id)}
          title={`AIFA Claim: ${claim.verdictLabel} (Click to inspect in verification panel)`}
          className={`transition-all duration-200 cursor-pointer rounded px-1 py-0.5 inline ${
            isSelected
              ? 'bg-amber-200/90 text-slate-900 border-b-2 border-amber-600 shadow-xs ring-2 ring-amber-400 font-medium'
              : 'bg-amber-100/70 hover:bg-amber-200/80 border-b border-amber-400 text-slate-900'
          }`}
        >
          {matched}
        </span>
        {after}
      </>
    );
  };

  return (
    <article
      id={post.id}
      data-aifa-detectable="true"
      data-aifa-type="social-post"
      data-post-id={post.id}
      onMouseEnter={() => setActiveHoveredPostId(post.id)}
      onMouseLeave={() => {
        // Small exit delay is handled or cleared when entering next post
        setActiveHoveredPostId(null);
      }}
      className={`relative p-4 rounded-2xl bg-white border transition-all duration-200 ${
        isHighlighted
          ? 'outline-2 outline-[#D93043] outline-offset-4 bg-[#D93043]/[0.015] border-rose-200/80 shadow-md'
          : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
      }`}
    >
      {/* Absolute Detection Pill on top border */}
      <div className="absolute -top-3.5 left-4 pointer-events-none z-20 select-none">
        <div
          className={`transition-all duration-200 ${
            isHighlighted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D93043] text-white text-[10px] font-bold tracking-wider uppercase shadow-xs border border-white/40">
            <ShieldCheck className="w-3 h-3" strokeWidth={2.4} />
            AIFA Detectable Post
          </span>
        </div>
      </div>

      {/* Floating "Verify with AIFA" Action Button for this specific post */}
      <div className="absolute top-3 right-3 z-30 pointer-events-auto">
        <div
          className={`transition-all duration-150 ${
            isHighlighted
              ? 'opacity-100 scale-100 pointer-events-auto'
              : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          {isPostVerified && panelMode === 'expanded' ? (
            <button
              type="button"
              onClick={() => triggerVerification(post)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl shadow-xs border border-slate-700 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
              <span>Panel Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => triggerVerification(post)}
              className="group flex items-center gap-1.5 px-3 py-1.5 bg-[#D93043] hover:bg-[#C02638] text-white text-xs font-semibold rounded-xl shadow-[0_4px_14px_rgba(217,48,67,0.35)] hover:scale-105 active:scale-95 transition-all duration-150 border border-white/20 cursor-pointer"
              title="Verify this social media post using AIFA"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2.4} />
              <span>Verify with AIFA</span>
            </button>
          )}
        </div>
      </div>

      {/* Post Author Row */}
      <div className="flex items-center gap-3 mb-3 pr-28">
        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg shrink-0">
          {post.author.avatar}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-slate-900 leading-tight">
              {post.author.name}
            </span>
            {post.author.verified && (
              <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{post.author.handle}</span>
            <span>•</span>
            <span>{post.timestamp}</span>
          </div>
        </div>
      </div>

      {/* Caption Content */}
      <div className="text-sm text-slate-800 leading-relaxed mb-3">
        <p className="whitespace-pre-line">
          {renderCaptionWithClaimHighlights(post.caption)}
        </p>
      </div>

      {/* Attached Image */}
      {post.image && (
        <div className="mb-3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
          <img src={post.image.url} alt={post.image.alt} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Reaction and Engagement Counters */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 select-none">
        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-rose-600 transition-colors p-1"
        >
          <Heart className="w-4 h-4" />
          <span>{post.likesCount}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors p-1"
        >
          <Repeat2 className="w-4 h-4" />
          <span>{post.repostsCount}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-blue-600 transition-colors p-1"
        >
          <MessageCircle className="w-4 h-4" />
          <span>{post.repliesCount}</span>
        </button>

        <button
          type="button"
          className="flex items-center gap-1.5 hover:text-slate-800 transition-colors p-1"
        >
          <Share className="w-4 h-4" />
          <span>{post.sharesCount}</span>
        </button>
      </div>
    </article>
  );
};
