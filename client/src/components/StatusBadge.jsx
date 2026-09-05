import React from 'react';

const STATUS_COLOR_MAP = {
  Applied: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
  'Under Review': 'bg-sky-950/60 border-sky-500/40 text-sky-300',
  Shortlisted: 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300',
  'Round 1': 'bg-purple-950/60 border-purple-500/40 text-purple-300',
  'Round 2': 'bg-purple-950/60 border-purple-500/40 text-purple-300',
  'Technical Round': 'bg-purple-950/60 border-purple-500/40 text-purple-300',
  'HR Round': 'bg-pink-950/60 border-pink-500/40 text-pink-300',
  Selected: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
  Passed: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
  Rejected: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
  Failed: 'bg-rose-950/60 border-rose-500/40 text-rose-300',
  'On Hold': 'bg-amber-950/60 border-amber-500/40 text-amber-300',
  Scheduled: 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300',
  Completed: 'bg-blue-950/60 border-blue-500/40 text-blue-300',
};

export const StatusBadge = ({ status = 'Applied' }) => {
  const style = STATUS_COLOR_MAP[status] || 'bg-slate-800 border-slate-700 text-slate-300';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
