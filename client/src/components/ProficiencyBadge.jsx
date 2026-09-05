import React from 'react';
import { PROFICIENCY_LEVELS } from '../../../server/config/constants.js';

const BADGE_STYLES = {
  1: 'bg-rose-950/60 border-rose-600/40 text-rose-300',
  2: 'bg-amber-950/60 border-amber-600/40 text-amber-300',
  3: 'bg-sky-950/60 border-sky-600/40 text-sky-300',
  4: 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300',
  5: 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300',
};

export const ProficiencyBadge = ({ level = 1, showLabel = true }) => {
  const label = PROFICIENCY_LEVELS[level] || `Level ${level}`;
  const style = BADGE_STYLES[level] || BADGE_STYLES[1];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${style}`}>
      <span className="font-mono font-bold text-xs">{level}/5</span>
      {showLabel && <span>• {label}</span>}
    </span>
  );
};

export default ProficiencyBadge;
