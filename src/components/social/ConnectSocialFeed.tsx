import React from 'react';
import { MOCK_CONNECT_POSTS } from '../../data/mockSocialPosts';
import { SocialPostCard } from './SocialPostCard';
import {
  Users,
  Home,
  Bookmark,
  Compass,
  Search,
  Bell,
  MessageSquare,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

export const ConnectSocialFeed: React.FC = () => {
  return (
    <div className="min-h-full bg-[#F0F2F5] text-slate-900">
      {/* Platform Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 px-4 sm:px-6 py-2.5 shadow-2xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center tracking-tighter">
              C
            </div>
            <div>
              <span className="font-bold text-lg text-blue-700 tracking-tight leading-none">
                ConnectSocial
              </span>
              <span className="text-[10px] text-slate-400 block leading-none">
                Malaysian Community Network
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-md hidden sm:flex items-center gap-2 bg-[#F0F2F5] rounded-full px-3 py-1.5 text-xs text-slate-500 border border-slate-200/60">
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search ConnectSocial posts, groups, tags..."
              className="bg-transparent focus:outline-none w-full text-slate-800"
              readOnly
            />
          </div>

          <div className="flex items-center gap-2 text-slate-600">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center border border-blue-200">
              ME
            </div>
          </div>
        </div>
      </header>

      {/* Main 3-Column Layout */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Navigation Sidebar */}
        <aside className="hidden md:block md:col-span-3 space-y-2 select-none">
          <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-2xs space-y-1 text-xs font-medium text-slate-700">
            <div className="flex items-center gap-2.5 p-2 rounded-lg bg-blue-50 text-blue-700 font-bold">
              <Home className="w-4 h-4" />
              <span>Public Feed</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Community Groups</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Explore Topics</span>
            </div>
            <div className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 cursor-pointer">
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Saved Posts</span>
            </div>
          </div>

          {/* AIFA Active Extension Advisory Box */}
          <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 text-xs text-rose-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#D93043]">
              <ShieldCheck className="w-4 h-4" />
              <span>AIFA Feed Scanner</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Hover over any social post in your feed to inspect its claims and extract image text.
            </p>
          </div>
        </aside>

        {/* Central Feed */}
        <main className="md:col-span-9 lg:col-span-6 space-y-6">
          {/* Post Creation Simulated Card */}
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                ME
              </div>
              <div className="flex-1 bg-[#F0F2F5] hover:bg-slate-200/70 rounded-full px-4 py-2 text-xs text-slate-400 cursor-text">
                What's on your mind? Share news, community updates...
              </div>
            </div>
          </div>

          {/* Posts Stream */}
          <div className="space-y-6">
            {MOCK_CONNECT_POSTS.map((post) => (
              <SocialPostCard key={post.id} post={post} />
            ))}
          </div>
        </main>

        {/* Right Trending / Suggested Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4 select-none">
          <div className="bg-white rounded-xl p-4 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 font-bold text-xs text-slate-900 uppercase tracking-wider">
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
              <span>Trending in Malaysia</span>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                  Policy • 42.8k posts
                </span>
                <span className="font-semibold text-slate-800">#RM500PaymentClaim</span>
              </div>
              <div className="cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                  Technology • 19.4k posts
                </span>
                <span className="font-semibold text-slate-800">#CyberjayaAIHub</span>
              </div>
              <div className="cursor-pointer hover:bg-slate-50 p-1.5 rounded">
                <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                  Civic Safety • 28.1k posts
                </span>
                <span className="font-semibold text-slate-800">#SebenarnyaCheck</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
