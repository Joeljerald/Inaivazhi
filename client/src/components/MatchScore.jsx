import React from 'react';

export const MatchScore = ({ score = 0, readinessLabel = 'Moderate Match', size = 'md' }) => {
  const roundedScore = Math.min(Math.max(Math.round(score), 0), 100);

  let colorClass = 'text-amber-400 stroke-amber-400';
  let bgGradient = 'from-amber-500/10 to-amber-500/5';
  let badgeStyle = 'bg-amber-950/70 text-amber-300 border-amber-500/40';

  if (roundedScore >= 90) {
    colorClass = 'text-emerald-400 stroke-emerald-400';
    bgGradient = 'from-emerald-500/15 to-emerald-500/5';
    badgeStyle = 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40';
  } else if (roundedScore >= 75) {
    colorClass = 'text-indigo-400 stroke-indigo-400';
    bgGradient = 'from-indigo-500/15 to-indigo-500/5';
    badgeStyle = 'bg-indigo-950/70 text-indigo-300 border-indigo-500/40';
  } else if (roundedScore >= 60) {
    colorClass = 'text-sky-400 stroke-sky-400';
    bgGradient = 'from-sky-500/15 to-sky-500/5';
    badgeStyle = 'bg-sky-950/70 text-sky-300 border-sky-500/40';
  } else if (roundedScore < 40) {
    colorClass = 'text-rose-400 stroke-rose-400';
    bgGradient = 'from-rose-500/15 to-rose-500/5';
    badgeStyle = 'bg-rose-950/70 text-rose-300 border-rose-500/40';
  }

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (roundedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${bgGradient} border border-slate-800 backdrop-blur-sm relative overflow-hidden shadow-lg`}>
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-slate-800"
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
          <span className="text-3xl font-extrabold tracking-tight text-white">{roundedScore}%</span>
          <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Match</span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full border text-xs font-bold tracking-wide uppercase ${badgeStyle}`}>
        {readinessLabel}
      </div>
    </div>
  );
};

export default MatchScore;
