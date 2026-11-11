import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileQuestion,
  ArrowRight,
  TrendingUp,
  ExternalLink,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { OverallAssessment } from '../../types/aifa';

interface DashboardOverviewProps {
  onSwitchTab: (tab: 'history' | 'requests' | 'notifications' | 'settings') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSwitchTab }) => {
  const {
    verificationHistory,
    submittedRequests,
    userProfile,
    openEmailPreview,
  } = useAifa();

  // Metrics
  const totalVerified = verificationHistory.length;
  const supportedCount = verificationHistory.filter(
    (h) => h.overallAssessment === 'supported'
  ).length;
  const falseOrMisleadingCount = verificationHistory.filter(
    (h) => h.overallAssessment === 'false' || h.overallAssessment === 'misleading'
  ).length;
  const pendingRequests = submittedRequests.filter((r) => r.status !== 'Completed').length;
  const completedRequests = submittedRequests.filter((r) => r.status === 'Completed').length;

  const getAssessmentBadge = (assessment: OverallAssessment) => {
    switch (assessment) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" />
            Supported
          </span>
        );
      case 'false':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3 h-3" />
            False
          </span>
        );
      case 'misleading':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3 h-3" />
            Misleading
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <FileQuestion className="w-3 h-3" />
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#171B26] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs tracking-wider uppercase">
            <span>🛡️</span>
            <span>AIFA Integrated Fact-Checking</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight mt-1">
            Welcome back, {userProfile.name}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
            Your browser extension is connected to Sebenarnya.my. Review your recent verifications, track editorial investigations, and submit newly discovered viral claims for expert evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSwitchTab('requests')}
            className="px-4 py-2.5 rounded-xl bg-[#D93043] hover:bg-[#B72435] text-white text-xs font-bold shadow transition-all cursor-pointer flex items-center gap-2"
          >
            <span>Track Requests ({pendingRequests})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Card 1: Total Verifications */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{totalVerified}</div>
            <div className="text-xs font-medium text-slate-500">Verified Stories</div>
          </div>
        </div>

        {/* Card 2: Supported Claims */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{supportedCount}</div>
            <div className="text-xs font-medium text-slate-500">Supported Claims</div>
          </div>
        </div>

        {/* Card 3: Refuted Claims */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{falseOrMisleadingCount}</div>
            <div className="text-xs font-medium text-slate-500">False / Misleading</div>
          </div>
        </div>

        {/* Card 4: Fact-Check Inquiries */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{submittedRequests.length}</div>
            <div className="text-xs font-medium text-slate-500">
              Inquiries ({completedRequests} Completed)
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recent Verifications & Active Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Recent Verifications */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <h3 className="font-bold text-sm text-slate-900">Recent Verifications</h3>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('history')}
              className="text-xs font-semibold text-[#D93043] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View All History</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {verificationHistory.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No verifications recorded yet.
              </div>
            ) : (
              verificationHistory.slice(0, 3).map((hist) => (
                <div
                  key={hist.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    {getAssessmentBadge(hist.overallAssessment)}
                    <span className="text-[11px] text-slate-400">{hist.verifiedAt}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                    {hist.headline}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {hist.summary}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span>
                      {hist.platformName} • {hist.claimsCount} claims
                    </span>
                    <button
                      type="button"
                      onClick={() => onSwitchTab('history')}
                      className="text-[#D93043] hover:underline font-semibold"
                    >
                      Details &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Editorial Review Inquiries */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
              <h3 className="font-bold text-sm text-slate-900">
                Official Fact-Check Inquiries
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('requests')}
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Requests</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {submittedRequests.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No active fact-check requests submitted.
              </div>
            ) : (
              submittedRequests.slice(0, 3).map((req) => (
                <div
                  key={req.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-slate-800">
                      Ref: {req.referenceNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Under Review'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-800 italic bg-white p-2 rounded border border-slate-200 line-clamp-2">
                    "{req.claimText}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Submitted: {req.timestamp}</span>
                    {req.status === 'Completed' && (
                      <button
                        type="button"
                        onClick={() => openEmailPreview(req)}
                        className="text-teal-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Preview Notification</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
