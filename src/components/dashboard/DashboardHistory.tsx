import React, { useState } from 'react';
import {
  Search,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  Eye,
  X,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';
import { VerificationHistoryRecord, OverallAssessment } from '../../types/aifa';

export const DashboardHistory: React.FC = () => {
  const { verificationHistory, deleteHistoryRecord, clearHistory } = useAifa();

  const [searchQuery, setSearchQuery] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState<string>('all');
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<VerificationHistoryRecord | null>(null);

  // Filtered records
  const filteredRecords = verificationHistory.filter((record) => {
    const matchesSearch =
      record.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAssessment =
      assessmentFilter === 'all' || record.overallAssessment === assessmentFilter;

    const matchesContentType =
      contentTypeFilter === 'all' || record.contentType === contentTypeFilter;

    return matchesSearch && matchesAssessment && matchesContentType;
  });

  const getAssessmentBadge = (assessment: OverallAssessment) => {
    switch (assessment) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Supported
          </span>
        );
      case 'false':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            False
          </span>
        );
      case 'misleading':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5" />
            Misleading
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <FileQuestion className="w-3.5 h-3.5" />
            Unverified
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Verification History Archive
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Search, filter, and inspect verified news stories and social media posts.
          </p>
        </div>

        {verificationHistory.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by headline, topic, or source..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Assessment Filter */}
          <select
            value={assessmentFilter}
            onChange={(e) => setAssessmentFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Verdicts</option>
            <option value="supported">Supported</option>
            <option value="false">False</option>
            <option value="misleading">Misleading</option>
            <option value="unverified">Unverified</option>
          </select>

          {/* Content Type Filter */}
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer"
          >
            <option value="all">All Content Types</option>
            <option value="article">News Articles</option>
            <option value="social-post">Social Posts</option>
          </select>
        </div>
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredRecords.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No verifications found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No verification records match your active search or filters. Try adjusting your query or verify articles from the news portal.
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-5 shadow-sm transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  {getAssessmentBadge(record.overallAssessment)}
                  <span className="text-[11px] font-semibold text-slate-400">
                    {record.verifiedAt}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {record.platformName}
                  </span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                    {record.contentType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(record)}
                    className="px-2.5 py-1 text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Claims</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteHistoryRecord(record.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {record.headline}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {record.summary}
              </p>

              <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                <span>{record.claimsCount} claims evaluated and cross-referenced</span>
                <span className="font-mono text-[10px] text-slate-400">ID: {record.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Claims Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Verification Findings Detail
                </div>
                <h3 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {selectedRecord.headline}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Overall Rating:</span>
                {getAssessmentBadge(selectedRecord.overallAssessment)}
              </div>

              <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Assessment Summary</div>
                <p>{selectedRecord.result?.assessmentExplanation || selectedRecord.summary}</p>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Evaluated Claims ({selectedRecord.result?.claims?.length || 0})
                </div>

                {selectedRecord.result?.claims?.map((claim) => (
                  <div
                    key={claim.id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">
                        Claim #{claim.claimNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          claim.verdict === 'supported'
                            ? 'bg-emerald-100 text-emerald-800'
                            : claim.verdict === 'false'
                            ? 'bg-rose-100 text-rose-800'
                            : claim.verdict === 'misleading'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {claim.verdictLabel}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-slate-900">
                      "{claim.statement}"
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                      {claim.explanation}
                    </p>

                    <div className="text-[10px] text-teal-800 bg-teal-50/70 p-2 rounded border border-teal-100">
                      <strong>Sebenarnya.my Evidence:</strong> {claim.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#171B26] hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
