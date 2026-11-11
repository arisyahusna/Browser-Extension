import React, { useState } from 'react';
import {
  Sliders,
  CheckCircle,
  Clock,
  Mail,
  RotateCcw,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { useAifa } from '../../context/AifaContext';

export const DemoControlsBar: React.FC = () => {
  const {
    submittedRequests,
    advanceRequestStatus,
    openEmailPreview,
    resetAllDemoData,
  } = useAifa();

  const [selectedReqId, setSelectedReqId] = useState<string>(
    submittedRequests[0]?.id || ''
  );
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Sync selectedReqId if current one is removed or when submittedRequests changes
  React.useEffect(() => {
    if (!submittedRequests.some((r) => r.id === selectedReqId) && submittedRequests.length > 0) {
      setSelectedReqId(submittedRequests[0].id);
    }
  }, [submittedRequests, selectedReqId]);

  const selectedRequest = submittedRequests.find((r) => r.id === selectedReqId) || submittedRequests[0];

  const handleAdvance = (newStatus: 'Under Review' | 'Completed') => {
    if (!selectedRequest) return;
    advanceRequestStatus(selectedRequest.id, newStatus);
    setStatusMessage(`Request ${selectedRequest.referenceNumber} updated to "${newStatus}"`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleOpenEmail = () => {
    if (selectedRequest) {
      openEmailPreview(selectedRequest);
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2.5 shadow-md border-b border-indigo-800/40 select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Presenter label */}
        <div className="flex items-center gap-2">
          <span className="p-1 rounded bg-amber-400 text-slate-900 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
            <Sliders className="w-3 h-3" />
            Presenter Controls
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Simulate Sebenarnya.my Editorial Lifecycle:
          </span>
        </div>

        {/* Request selector & action buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {submittedRequests.length > 0 ? (
            <>
              {/* Target request selector */}
              <div className="relative">
                <select
                  value={selectedReqId}
                  onChange={(e) => setSelectedReqId(e.target.value)}
                  className="bg-indigo-900/60 border border-indigo-700/60 text-indigo-100 text-xs rounded-lg px-2.5 py-1 pr-7 focus:outline-none focus:ring-1 focus:ring-amber-400 appearance-none cursor-pointer"
                >
                  {submittedRequests.map((req) => (
                    <option key={req.id} value={req.id} className="bg-slate-900 text-white">
                      {req.referenceNumber} ({req.status})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-indigo-300 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Action: Under Review */}
              <button
                type="button"
                onClick={() => handleAdvance('Under Review')}
                disabled={!selectedRequest || selectedRequest.status === 'Under Review'}
                className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Simulate reviewer picking up the request"
              >
                <Clock className="w-3 h-3 text-amber-400" />
                <span>Set Under Review</span>
              </button>

              {/* Action: Completed */}
              <button
                type="button"
                onClick={() => handleAdvance('Completed')}
                disabled={!selectedRequest || selectedRequest.status === 'Completed'}
                className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Publish fact-check & trigger user notification toast"
              >
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                <span>Complete Fact-Check</span>
              </button>

              {/* Action: Preview Email */}
              <button
                type="button"
                onClick={handleOpenEmail}
                disabled={!selectedRequest}
                className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/40 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                title="Preview simulated email sent to user"
              >
                <Mail className="w-3 h-3 text-sky-400" />
                <span>Preview Email</span>
              </button>
            </>
          ) : (
            <span className="text-slate-400 text-xs">No active requests</span>
          )}

          {/* Reset Demo Data */}
          <button
            type="button"
            onClick={resetAllDemoData}
            className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors ml-1 cursor-pointer"
            title="Reset All Demo Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="max-w-7xl mx-auto mt-1 text-[11px] text-amber-300 flex items-center gap-1 font-mono">
          <Sparkles className="w-3 h-3" />
          <span>{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
