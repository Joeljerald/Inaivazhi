import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const AIRecommendationCard = ({ recommendation }) => {
  const { skillName, currentLevel, targetLevel, gap, mandatory, priority, reason, action } = recommendation;

  const isHigh = priority === 'HIGH';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      isHigh
        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-500/40'
        : 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-500/30'
    } shadow-sm`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isHigh ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-600 dark:text-rose-300' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-300'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-sb-main">{skillName}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border ${
                isHigh ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40' : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40'
              }`}>
                {priority} PRIORITY
              </span>
              {mandatory && <span className="text-xs text-rose-600 dark:text-rose-400 font-semibold">• Mandatory Requirement</span>}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-sb-sec">Target Upgrade</span>
          <div className="flex items-center gap-1 text-sm font-bold text-sb-main mt-0.5">
            <span>{currentLevel}/5</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-indigo-600 dark:text-indigo-400">{targetLevel}/5</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-surface-sec border border-sb-default text-xs text-sb-sec leading-relaxed">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-sb-main">Why prioritized: </strong>
            {reason}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-sb-sec flex items-start gap-2">
        <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <span><strong className="text-emerald-600 dark:text-emerald-400">Action Plan: </strong>{action}</span>
      </div>
    </div>
  );
};

export default AIRecommendationCard;
