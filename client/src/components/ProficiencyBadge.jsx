import React from 'react';
import { Star } from 'lucide-react';

const PROFICIENCY_NAMES = {
  1: 'Beginner',
  2: 'Basic',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

const BADGE_STYLES = {
  1: 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-500/40 text-rose-700 dark:text-rose-300',
  2: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-500/40 text-amber-700 dark:text-amber-300',
  3: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-500/40 text-sky-700 dark:text-sky-300',
  4: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-500/40 text-indigo-700 dark:text-indigo-300',
  5: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300',
};

export const ProficiencyBadge = ({ level = 1, showLabel = true, showStars = true }) => {
  const numLevel = Math.min(Math.max(Number(level) || 1, 1), 5);
  const label = PROFICIENCY_NAMES[numLevel] || `Level ${numLevel}`;
  const style = BADGE_STYLES[numLevel] || BADGE_STYLES[1];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${style} shadow-xs`}>
      {showStars && (
        <span className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-3 h-3 ${
                star <= numLevel
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-gray-300 dark:text-slate-700 fill-none'
              }`}
            />
          ))}
        </span>
      )}
      <span className="font-mono">{numLevel}/5</span>
      {showLabel && <span>• {label}</span>}
    </span>
  );
};

export default ProficiencyBadge;
