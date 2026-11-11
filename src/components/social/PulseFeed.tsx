import React from 'react';
import { MOCK_PULSE_POSTS } from '../../data/mockSocialPosts';
import { SocialPostCard } from './SocialPostCard';
import {
  Hash,
  Home,
  Bell,
  Mail,
  Bookmark,
  Search,
  Sparkles,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const PulseFeed: React.FC = () => {
  return (
    <div className="min-h-full bg-white text-slate-900">
      <div className="max-w-6xl mx-auto flex min-h-screen">
        {/* Left Microblogging Nav Sidebar */}
        <aside className="w-16 sm:w-60 border-r border-slate-200 p-3 sm:p-4 flex flex-col justify-between shrink-0 select-none">
          <div className="space-y-4">
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-2 py-2">
              <div className="w-9 h-9 rounded-xl bg-slate-950 text-white font-mono font-bold text-lg flex items-center justify-center">
                P
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-base text-slate-900 tracking-tight leading-none block">
                  PulseFeed
                </span>
                <span className="text-[10px] text-slate-400 leading-none">Live Microblog</span>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="space-y-1 text-sm font-semibold text-slate-700">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-full bg-slate-100 text-slate-950 font-bold">
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-slate-50 cursor-pointer">
                <Hash className="w-5 h-5 text-slate-600" />
                <span className="hidden sm:inline">Explore</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-slate-50 cursor-pointer">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="hidden sm:inline">Notifications</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-slate-50 cursor-pointer">
                <Mail className="w-5 h-5 text-slate-600" />
                <span className="hidden sm:inline">Messages</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-full hover:bg-slate-50 cursor-pointer">
                <Bookmark className="w-5 h-5 text-slate-600" />
                <span className="hidden sm:inline">Bookmarks</span>
              </div>
            </nav>
          </div>

          {/* AIFA Active Extension Advisory Box */}
          <div className="hidden sm:block bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-[#D93043]">
              <ShieldCheck className="w-4 h-4" />
              <span>AIFA Microblog Scanner</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Detects viral claims and text embedded in shared post screenshots.
            </p>
          </div>
        </aside>

        {/* Central Feed Timeline */}
        <main className="flex-1 max-w-xl border-r border-slate-200 min-h-screen">
          {/* Timeline Header */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 py-3 z-10 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Home Timeline</h2>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </div>

          {/* Create Post Prompt */}
          <div className="p-4 border-b border-slate-100 flex gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
              U
            </div>
            <div className="flex-1 text-slate-400 text-sm py-2">
              Post your thoughts or news update...
            </div>
          </div>

          {/* Posts List */}
          <div className="divide-y divide-slate-100 p-4 space-y-4">
            {MOCK_PULSE_POSTS.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-72 hidden lg:block p-4 space-y-4 select-none">
          {/* Search bar */}
          <div className="bg-slate-100 rounded-full px-3.5 py-2 flex items-center gap-2 text-xs text-slate-500">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search PulseFeed"
              className="bg-transparent focus:outline-none w-full"
              readOnly
            />
          </div>

          {/* What's Happening */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-slate-700" />
              <span>Trends for you</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="cursor-pointer hover:bg-slate-100/70 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">Civic • Trending</span>
                <span className="font-bold text-slate-900">#RM500PaymentClaim</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">34.2K posts</span>
              </div>
              <div className="cursor-pointer hover:bg-slate-100/70 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">Digital Safety • Trending</span>
                <span className="font-bold text-slate-900">#VerifyBeforeShare</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">18.5K posts</span>
              </div>
              <div className="cursor-pointer hover:bg-slate-100/70 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block">Technology • Trending</span>
                <span className="font-bold text-slate-900">#MalaysiaAI2026</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">12.1K posts</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
