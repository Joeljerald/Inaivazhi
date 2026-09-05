import React from 'react';

export const MatchScore = ({ score = 0, readinessLabel = 'Moderate Match', size = 'md' }) => {
  const roundedScore = Math.min(Math.max(Math.round(score), 0), 100);

  let colorClass = 'text-amber-500 stroke-amber-500';
  let bgGradient = 'from-amber-500/10 to-amber-500/5';
  let badgeStyle = 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40';

  if (roundedScore >= 90) {
    colorClass = 'text-emerald-500 stroke-emerald-500';
    bgGradient = 'from-emerald-500/15 to-emerald-500/5';
    badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40';
  } else if (roundedScore >= 75) {
    colorClass = 'text-indigo-600 stroke-indigo-600 dark:text-indigo-400 dark:stroke-indigo-400';
    bgGradient = 'from-indigo-500/15 to-indigo-500/5';
    badgeStyle = 'bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-500/40';
  } else if (roundedScore >= 60) {
    colorClass = 'text-sky-500 stroke-sky-500';
    bgGradient = 'from-sky-500/15 to-sky-500/5';
    badgeStyle = 'bg-sky-50 dark:bg-sky-950/70 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-500/40';
  } else if (roundedScore < 40) {
    colorClass = 'text-rose-500 stroke-rose-500';
    bgGradient = 'from-rose-500/15 to-rose-500/5';
    badgeStyle = 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40';
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-surface border border-sb-default relative overflow-hidden shadow-sm`}>
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-sb-divider"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={`transition-all duration-1000 ease-out ${colorClass}`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold tracking-tight text-sb-main">{roundedScore}%</span>
          <span className="text-[10px] uppercase tracking-wider text-sb-sec font-semibold">Match</span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${badgeStyle}`}>
        {readinessLabel}
      </div>
    </div>
  );
};

export default MatchScore;
