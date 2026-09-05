import React from 'react';

const STATUS_COLOR_MAP = {
  Applied: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300',
  'Under Review': 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-500/40 text-sky-700 dark:text-sky-300',
  Shortlisted: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300',
  'Round 1': 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-300',
  'Round 2': 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-300',
  'Technical Round': 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-500/40 text-purple-700 dark:text-purple-300',
  'HR Round': 'bg-pink-50 dark:bg-pink-950/60 border-pink-200 dark:border-pink-500/40 text-pink-700 dark:text-pink-300',
  Selected: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  Passed: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
  Rejected: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300',
  Failed: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300',
  'On Hold': 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300',
  Scheduled: 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-500/40 text-cyan-700 dark:text-cyan-300',
  Completed: 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-500/40 text-blue-700 dark:text-blue-300',
};

export const StatusBadge = ({ status = 'Applied' }) => {
  const style = STATUS_COLOR_MAP[status] || 'bg-surface-sec border-sb-default text-sb-main';

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
