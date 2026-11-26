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

interface DashboardHistoryProps {
  /** Verdict filter to start with (set when arriving from an Overview card). */
  initialAssessmentFilter?: string;
}

export const DashboardHistory: React.FC<DashboardHistoryProps> = ({
  initialAssessmentFilter = 'all',
}) => {
  const { verificationHistory, deleteHistoryRecord, clearHistory } = useAifa();

  const [searchQuery, setSearchQuery] = useState('');
  const [assessmentFilter, setAssessmentFilter] = useState<string>(initialAssessmentFilter);
  const [contentTypeFilter, setContentTypeFilter] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<VerificationHistoryRecord | null>(null);

  // Filtered records
  const filteredRecords = verificationHistory.filter((record) => {
    const matchesSearch =
      record.headline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.platformName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAssessment =
      assessmentFilter === 'all' ||
      (assessmentFilter === 'false-or-misleading'
        ? record.overallAssessment === 'false' || record.overallAssessment === 'misleading'
        : record.overallAssessment === assessmentFilter);

    const matchesContentType =
      contentTypeFilter === 'all' || record.contentType === contentTypeFilter;

    return matchesSearch && matchesAssessment && matchesContentType;
  });

  const getAssessmentBadge = (assessment: OverallAssessment) => {
    switch (assessment) {
      case 'supported':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#DFE6F5] text-[#3F5C9E]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Supported
          </span>
        );
      case 'false':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F7DEDB] text-[#9B3D36]">
            <AlertTriangle className="w-3.5 h-3.5" />
            False
          </span>
        );
      case 'misleading':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F4EBCB] text-[#715C1C]">
            <AlertTriangle className="w-3.5 h-3.5" />
            Misleading
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-[#E2E4EA] text-[#5C5A56]">
            <FileQuestion className="w-3.5 h-3.5" />
            Unverified
          </span>
        );
    }
  };

  const fieldClass =
    'h-11 bg-[#F4F3F1] border-0 rounded-full text-xs text-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#5774BC]/30';

  return (
    <div className="space-y-5">
      {/* Title & Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 pt-2">
        <div>
          <h2 className="text-[28px] leading-tight font-bold text-[#2A2A2A] tracking-tight">
            Verification History Archive
          </h2>
          <p className="text-sm text-[#6F6D69] mt-1">
            Search, filter, and inspect verified news stories and social media posts.
          </p>
        </div>

        {verificationHistory.length > 0 && (
          <button
            type="button"
            onClick={clearHistory}
            className="h-10 px-4 rounded-full bg-white border border-[#E0DED9] hover:bg-[#F7DEDB] hover:text-[#9B3D36] hover:border-transparent text-[#2A2A2A] text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-2 rounded-[28px] md:rounded-full border border-[#E0DED9] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-[#6F6D69] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by headline, topic, or source..."
            className={`${fieldClass} w-full pl-11 pr-4 placeholder-[#6F6D69]`}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {/* Assessment Filter */}
          <select
            value={assessmentFilter}
            onChange={(e) => setAssessmentFilter(e.target.value)}
            className={`${fieldClass} px-4 font-medium cursor-pointer`}
          >
            <option value="all">All Verdicts</option>
            <option value="supported">Supported</option>
            <option value="false">False</option>
            <option value="misleading">Misleading</option>
            <option value="false-or-misleading">False or Misleading</option>
            <option value="unverified">Unverified</option>
          </select>

          {/* Content Type Filter */}
          <select
            value={contentTypeFilter}
            onChange={(e) => setContentTypeFilter(e.target.value)}
            className={`${fieldClass} px-4 font-medium cursor-pointer`}
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
          <div className="bg-white rounded-[28px] border border-[#E0DED9] p-12 text-center space-y-2">
            <FileQuestion className="w-8 h-8 text-[#6F6D69]/50 mx-auto" />
            <h4 className="text-sm font-semibold text-[#2A2A2A]">No verifications found</h4>
            <p className="text-xs text-[#6F6D69] max-w-sm mx-auto">
              No verification records match your active search or filters. Try adjusting your query or verify articles from the news portal.
            </p>
          </div>
        ) : (
          filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-[28px] border border-[#E0DED9] hover:border-[#2A2A2A]/15 p-5 sm:p-6 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {getAssessmentBadge(record.overallAssessment)}
                  <span className="text-[11px] font-medium text-[#6F6D69]">
                    {record.verifiedAt}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F4F3F1] text-[#5C5A56]">
                    {record.platformName}
                  </span>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#F4F3F1] text-[#5C5A56] uppercase">
                    {record.contentType}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedRecord(record)}
                    className="h-9 px-3.5 text-xs font-semibold text-white bg-[#2A2A2A] hover:bg-black rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Claims</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteHistoryRecord(record.id)}
                    className="w-9 h-9 flex items-center justify-center text-[#6F6D69] border border-[#E0DED9] hover:text-[#9B3D36] hover:bg-[#F7DEDB] hover:border-transparent rounded-full transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <h3 className="text-[15px] font-semibold text-[#2A2A2A] leading-snug">
                {record.headline}
              </h3>

              <p className="text-xs text-[#5C5A56] leading-relaxed bg-[#F4F3F1] p-4 rounded-[18px]">
                {record.summary}
              </p>

              <div className="text-[11px] text-[#6F6D69] flex items-center justify-between pt-1">
                <span>{record.claimsCount} claims evaluated and cross-referenced</span>
                <span className="font-mono text-[10px] text-[#6F6D69]">ID: {record.id}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Record Claims Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2A2A2A]/50 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-['Montserrat',sans-serif]">
          <div className="w-full max-w-2xl bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(42,42,42,0.4)] border border-[#E0DED9] overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-7 pt-6 pb-4 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-[#6F6D69]">
                  Verification Findings Detail
                </div>
                <h3 className="text-lg font-bold text-[#2A2A2A] tracking-tight line-clamp-1">
                  {selectedRecord.headline}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full border-[1.5px] border-[#2A2A2A] text-[#2A2A2A] hover:bg-[#E2E4EA] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="px-7 pb-6 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#6F6D69]">Overall Rating:</span>
                {getAssessmentBadge(selectedRecord.overallAssessment)}
              </div>

              <div className="text-xs text-[#5C5A56] bg-[#F4F3F1] p-4 rounded-[20px] leading-relaxed">
                <div className="text-sm font-semibold text-[#2A2A2A] mb-1">Assessment Summary</div>
                <p>{selectedRecord.result?.assessmentExplanation || selectedRecord.summary}</p>
              </div>

              <div className="space-y-3">
                <div className="text-[15px] font-semibold text-[#2A2A2A]">
                  Evaluated Claims ({selectedRecord.result?.claims?.length || 0})
                </div>

                {selectedRecord.result?.claims?.map((claim) => (
                  <div key={claim.id} className="p-4 rounded-[22px] bg-[#F4F3F1] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#2A2A2A]">
                        Claim #{claim.claimNumber}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                          claim.verdict === 'supported'
                            ? 'bg-[#DFE6F5] text-[#3F5C9E]'
                            : claim.verdict === 'false'
                            ? 'bg-[#F7DEDB] text-[#9B3D36]'
                            : claim.verdict === 'misleading'
                            ? 'bg-[#F4EBCB] text-[#715C1C]'
                            : 'bg-[#E2E4EA] text-[#5C5A56]'
                        }`}
                      >
                        {claim.verdictLabel}
                      </span>
                    </div>

                    <div className="text-sm font-medium text-[#2A2A2A]">
                      "{claim.statement}"
                    </div>

                    <p className="text-[11px] text-[#5C5A56] leading-relaxed bg-white p-3 rounded-2xl">
                      {claim.explanation}
                    </p>

                    <div className="text-[11px] text-[#3F5C9E] bg-[#DFE6F5] p-3 rounded-2xl leading-relaxed">
                      <strong>Sebenarnya.my Evidence:</strong> {claim.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-7 py-4 border-t border-[#E0DED9] flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="h-10 px-6 text-xs font-semibold text-white bg-[#2A2A2A] hover:bg-black rounded-full transition-colors cursor-pointer"
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
