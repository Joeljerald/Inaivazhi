import { READINESS_LEVELS } from '../config/constants.js';

/**
 * Calculates skill gap analysis between a student's current skills and job requirements.
 *
 * @param {Array} studentSkills - Array of { skillId, name, category, proficiencyLevel }
 * @param {Array} jobSkills - Array of { skillId, requiredLevel, mandatory, weight, name, category }
 * @returns {Object} Analytical summary containing matchPercent, readinessLabel, matchedSkills, gaps, missingSkills, mandatoryGaps, skillBreakdown
 */
export const calculateSkillGap = (studentSkills = [], jobSkills = []) => {
  if (!jobSkills || jobSkills.length === 0) {
    return {
      overallMatchPercent: 0,
      readinessLabel: READINESS_LEVELS.LOW.label,
      matchedSkills: [],
      gaps: [],
      missingSkills: [],
      mandatoryGaps: [],
      skillBreakdown: [],
    };
  }

  // Create quick lookup map for student's current skills
  const studentSkillMap = new Map();
  studentSkills.forEach((item) => {
    const sId = item.skillId._id ? item.skillId._id.toString() : item.skillId.toString();
    studentSkillMap.set(sId, {
      currentLevel: item.proficiencyLevel || 0,
      skillName: item.skillId.name || item.name || 'Skill',
      category: item.skillId.category || item.category || 'Other',
    });
  });

  let totalWeightedScore = 0;
  let totalEffectiveWeight = 0;

  const matchedSkills = [];
  const gaps = [];
  const missingSkills = [];
  const mandatoryGaps = [];
  const skillBreakdown = [];

  jobSkills.forEach((jobSkill) => {
    const sId = jobSkill.skillId._id ? jobSkill.skillId._id.toString() : jobSkill.skillId.toString();
    const skillInfo = studentSkillMap.get(sId);
    const currentLevel = skillInfo ? skillInfo.currentLevel : 0;
    const skillName = jobSkill.skillId.name || jobSkill.name || (skillInfo ? skillInfo.skillName : 'Skill');
    const category = jobSkill.skillId.category || jobSkill.category || (skillInfo ? skillInfo.category : 'Other');
    const requiredLevel = jobSkill.requiredLevel || 1;
    const mandatory = Boolean(jobSkill.mandatory);

    // Core formula: gap = Math.max(requiredLevel - currentLevel, 0)
    const gap = Math.max(requiredLevel - currentLevel, 0);

    // Score = Math.min(currentLevel / requiredLevel, 1)
    const score = Math.min(currentLevel / requiredLevel, 1);

    // Weight = jobSkill.weight OR (jobSkill.mandatory ? 2 : 1)
    const effectiveWeight = Number(jobSkill.weight) || (mandatory ? 2 : 1);

    totalWeightedScore += score * effectiveWeight;
    totalEffectiveWeight += effectiveWeight;

    let status = 'MATCHED';
    if (currentLevel >= requiredLevel) {
      status = 'MATCHED';
    } else if (currentLevel === 0) {
      status = 'MISSING';
    } else {
      status = 'GAP';
    }

    const detail = {
      skillId: sId,
      name: skillName,
      category,
      currentLevel,
      requiredLevel,
      gap,
      mandatory,
      effectiveWeight,
      status,
    };

    skillBreakdown.push(detail);

    if (status === 'MATCHED') {
      matchedSkills.push(detail);
    } else if (status === 'MISSING') {
      missingSkills.push(detail);
      gaps.push(detail);
      if (mandatory) mandatoryGaps.push(detail);
    } else {
      gaps.push(detail);
      if (mandatory) mandatoryGaps.push(detail);
    }
  });

  // Calculate overall match percentage: weightedScore = sum(score * weight) / sum(weight)
  const weightedScore = totalEffectiveWeight > 0 ? totalWeightedScore / totalEffectiveWeight : 0;
  const overallMatchPercent = Math.round(weightedScore * 100);

  // Map to Job Readiness
  let readinessLabel = READINESS_LEVELS.LOW.label;
  if (overallMatchPercent >= 90) readinessLabel = READINESS_LEVELS.EXCELLENT.label;
  else if (overallMatchPercent >= 75) readinessLabel = READINESS_LEVELS.STRONG.label;
  else if (overallMatchPercent >= 60) readinessLabel = READINESS_LEVELS.MODERATE.label;
  else if (overallMatchPercent >= 40) readinessLabel = READINESS_LEVELS.NEEDS_IMPROVEMENT.label;
  else readinessLabel = READINESS_LEVELS.LOW.label;

  return {
    overallMatchPercent,
    readinessLabel,
    matchedSkills,
    gaps,
    missingSkills,
    mandatoryGaps,
    skillBreakdown,
  };
};
