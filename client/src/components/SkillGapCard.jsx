import React from 'react';
import ProficiencyBadge from './ProficiencyBadge';
import { AlertCircle, CheckCircle, HelpCircle } from 'lucide-react';

export const SkillGapCard = ({ skill }) => {
  const { name, category, currentLevel, requiredLevel, gap, mandatory, status } = skill;

  let cardBorder = 'border-sb-default bg-surface';
  let icon = <CheckCircle className="w-5 h-5 text-emerald-500" />;
  let badgeColor = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/40';

  if (status === 'MISSING') {
    cardBorder = 'border-rose-300 dark:border-rose-500/40 bg-rose-50/50 dark:bg-rose-950/20';
    icon = <AlertCircle className="w-5 h-5 text-rose-500" />;
    badgeColor = 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-500/40';
  } else if (status === 'GAP') {
    cardBorder = 'border-amber-300 dark:border-amber-500/40 bg-amber-50/50 dark:bg-amber-950/20';
    icon = <HelpCircle className="w-5 h-5 text-amber-500" />;
    badgeColor = 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/40';
  }

  return (
    <div className={`p-4 rounded-xl border ${cardBorder} transition-all hover:border-indigo-400 shadow-sm`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h4 className="text-sm font-bold text-sb-main flex items-center gap-2">
              {name}
              {mandatory && (
                <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                  Mandatory
                </span>
              )}
            </h4>
            <span className="text-xs text-sb-sec">{category}</span>
          </div>
        </div>

        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
          {status}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center bg-surface-sec p-2.5 rounded-lg border border-sb-default text-xs">
        <div>
          <span className="block text-sb-sec text-[10px] uppercase font-medium">Current</span>
          <span className="font-bold text-sb-main mt-0.5 flex items-center justify-center gap-1">
            <span className="text-amber-400">★</span> {currentLevel}/5
          </span>
        </div>
        <div>
          <span className="block text-sb-sec text-[10px] uppercase font-medium">Required</span>
          <span className="font-bold text-sb-main mt-0.5 flex items-center justify-center gap-1">
            <span className="text-amber-400">★</span> {requiredLevel}/5
          </span>
        </div>
        <div>
          <span className="block text-sb-sec text-[10px] uppercase font-medium">Gap Size</span>
          <span className={`font-bold mt-0.5 block ${gap > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
            {gap}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SkillGapCard;
