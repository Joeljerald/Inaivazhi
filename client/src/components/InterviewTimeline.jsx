import React from 'react';
import { Calendar, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const InterviewTimeline = ({ interviews = [] }) => {
  if (!interviews || interviews.length === 0) {
    return (
      <div className="p-8 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400">
        <Calendar className="w-8 h-8 text-slate-500 mx-auto mb-2 opacity-50" />
        <p className="text-sm">No interview rounds scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
      {interviews.map((item, idx) => {
        let statusIcon = <Clock className="w-4 h-4 text-cyan-400" />;
        let dotBg = 'bg-cyan-500/20 border-cyan-500';

        if (item.status === 'Passed' || item.status === 'Completed') {
          statusIcon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
          dotBg = 'bg-emerald-500/20 border-emerald-500';
        } else if (item.status === 'Failed') {
          statusIcon = <XCircle className="w-4 h-4 text-rose-400" />;
          dotBg = 'bg-rose-500/20 border-rose-500';
        } else if (item.status === 'On Hold') {
          statusIcon = <AlertCircle className="w-4 h-4 text-amber-400" />;
          dotBg = 'bg-amber-500/20 border-amber-500';
        }

        return (
          <div key={item._id || idx} className="relative group">
            {/* Timeline Dot */}
            <div className={`absolute -left-[30px] top-1.5 w-6 h-6 rounded-full border-2 ${dotBg} flex items-center justify-center bg-slate-950 shadow-md`}>
              {statusIcon}
            </div>

            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all shadow-md">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    {item.roundName}
                    <span className="text-xs text-slate-400 font-normal">
                      ({item.companyId?.name || 'Company'} — {item.jobId?.title || 'Job Opening'})
                    </span>
                  </h4>
                  <span className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(item.scheduledDate).toLocaleDateString(undefined, {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <StatusBadge status={item.status} />
              </div>

              {item.remarks && (
                <p className="mt-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 italic">
                  "{item.remarks}"
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default InterviewTimeline;
