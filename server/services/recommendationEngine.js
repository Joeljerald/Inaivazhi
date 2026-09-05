/**
 * Generates prioritized learning recommendations from skill gap breakdown.
 *
 * Priority sorting rules:
 * 1. Mandatory skills first (HIGH priority)
 * 2. Largest gap size
 * 3. Highest required level
 */
export const generateRecommendations = (skillBreakdown = [], jobTitle = 'Target Job') => {
  const gapItems = skillBreakdown.filter((item) => item.gap > 0);

  const prioritized = gapItems.map((item) => {
    const isHigh = item.mandatory;
    const priority = isHigh ? 'HIGH' : 'MEDIUM';
    const reason = isHigh
      ? `Mandatory requirement for ${jobTitle}. Current level is ${item.currentLevel}/5, target level is ${item.requiredLevel}/5.`
      : `Optional capability that elevates competitiveness for ${jobTitle}. Current level is ${item.currentLevel}/5, target level is ${item.requiredLevel}/5.`;

    return {
      skillId: item.skillId,
      skillName: item.name,
      category: item.category,
      currentLevel: item.currentLevel,
      targetLevel: item.requiredLevel,
      gap: item.gap,
      mandatory: item.mandatory,
      priority,
      reason,
      action: `Spend 1-2 weeks focusing on ${item.name} practical exercises and projects to raise proficiency from level ${item.currentLevel} to ${item.requiredLevel}.`,
    };
  });

  // Custom sort: mandatory first (1 before 0), then gap descending, then target level descending
  prioritized.sort((a, b) => {
    if (a.mandatory !== b.mandatory) return a.mandatory ? -1 : 1;
    if (b.gap !== a.gap) return b.gap - a.gap;
    return b.targetLevel - a.targetLevel;
  });

  return prioritized;
};
