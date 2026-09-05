import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

export const AIRecommendationCard = ({ recommendation }) => {
  const { skillName, currentLevel, targetLevel, gap, mandatory, priority, reason, action } = recommendation;

  const isHigh = priority === 'HIGH';

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 ${
      isHigh
        ? 'bg-gradient-to-br from-rose-950/40 via-slate-900/90 to-slate-900/90 border-rose-500/40 shadow-rose-950/20'
        : 'bg-gradient-to-br from-amber-950/30 via-slate-900/90 to-slate-900/90 border-amber-500/30 shadow-amber-950/20'
    } shadow-xl`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-xl ${isHigh ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'}`}>
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-white">{skillName}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded border ${
                isHigh ? 'bg-rose-950 text-rose-300 border-rose-500/40' : 'bg-amber-950 text-amber-300 border-amber-500/40'
              }`}>
                {priority} PRIORITY
              </span>
              {mandatory && <span className="text-xs text-rose-400 font-semibold">• Mandatory Requirement</span>}
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400">Target Upgrade</span>
          <div className="flex items-center gap-1 text-sm font-bold text-white mt-0.5">
            <span>{currentLevel}/5</span>
            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-indigo-400">{targetLevel}/5</span>
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
        <div className="flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-200">Why prioritized: </strong>
            {reason}
          </div>
        </div>
      </div>

      <div className="mt-3 text-xs text-slate-400 flex items-start gap-2">
        <Layers className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span><strong className="text-emerald-400">Action Plan: </strong>{action}</span>
      </div>
    </div>
  );
};

export default AIRecommendationCard;
