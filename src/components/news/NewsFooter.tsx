import React from 'react';
import { ShieldCheck, Globe } from 'lucide-react';

export const NewsFooter: React.FC = () => {
  return (
    <footer className="bg-[#0F172A] text-slate-300 border-t border-slate-800 pt-12 pb-16 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Identity */}
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-white">
              MALAYSIA NEWS DAILY
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Independent national journalism committed to verified reporting, transparent civic
              coverage, and regional Southeast Asian perspectives.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Kuala Lumpur Editorial Bureau
              </span>
            </div>
          </div>

          {/* Column 2: News Sections */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              News Desks
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Malaysia Affairs</li>
              <li className="hover:text-white transition-colors cursor-pointer">World & ASEAN</li>
              <li className="hover:text-white transition-colors cursor-pointer">Parliament & Governance</li>
              <li className="hover:text-white transition-colors cursor-pointer">Digital Economy & AI</li>
              <li className="hover:text-white transition-colors cursor-pointer">Energy & Sustainability</li>
            </ul>
          </div>

          {/* Column 3: Standards & Verification */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Editorial Standards
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="hover:text-white transition-colors cursor-pointer">Fact-Checking Protocol</li>
              <li className="hover:text-white transition-colors cursor-pointer">Corrections & Clarifications</li>
              <li className="hover:text-white transition-colors cursor-pointer">Source Transparency Policy</li>
              <li className="hover:text-white transition-colors cursor-pointer">Journalistic Code of Conduct</li>
              <li className="hover:text-white transition-colors cursor-pointer">Community Feedback</li>
            </ul>
          </div>

          {/* Column 4: Prototype Disclaimer & AIFA Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#D93043]" />
              AIFA Demonstration Site
            </h4>
            <div className="rounded-lg bg-slate-800/80 p-3 border border-slate-700 text-xs text-slate-400 leading-relaxed space-y-2">
              <p>
                <strong className="text-slate-200">Interactive Prototype:</strong> All articles and
                domains on this portal are fictional mock data created to demonstrate the{' '}
                <span className="text-rose-400 font-medium">AIFA (AI Fact-Checking Assistant)</span>{' '}
                browser extension by <span className="text-slate-200 font-medium">Sebenarnya.my</span>.
              </p>
              <p className="text-[11px] text-slate-400">
                No actual live news website has been loaded or scraped.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Malaysia News Daily (Interactive Client Prototype). All rights reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Notice</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Simulated Content Advisory</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
