export const ROLES = {
  STUDENT: 'STUDENT',
  TRAINER: 'TRAINER',
  PLACEMENT: 'PLACEMENT',
  SUPER_ADMIN: 'SUPER_ADMIN',
};

export const SKILL_CATEGORIES = [
  'Frontend',
  'Backend',
  'Database',
  'Cloud',
  'DevOps',
  'Programming',
  'Testing',
  'Tools',
  'Other',
];

export const APPLICATION_STATUSES = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Interview',
  'Round 1',
  'Round 2',
  'Technical Round',
  'HR Round',
  'Selected',
  'Rejected',
  'On Hold',
  'Withdrawn',
];

export const INTERVIEW_STATUSES = [
  'Scheduled',
  'Completed',
  'Passed',
  'Failed',
  'On Hold',
];

export const PROFICIENCY_LEVELS = {
  1: 'Beginner',
  2: 'Basic',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

export const READINESS_LEVELS = {
  EXCELLENT: { min: 90, max: 100, label: 'Excellent Match' },
  STRONG: { min: 75, max: 89, label: 'Strong Match' },
  MODERATE: { min: 60, max: 74, label: 'Moderate Match' },
  NEEDS_IMPROVEMENT: { min: 40, max: 59, label: 'Needs Improvement' },
  LOW: { min: 0, max: 39, label: 'Low Match' },
};
