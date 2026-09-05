/**
 * Calculates dynamic overall rating from a collection of evaluations.
 *
 * @param {Array} evaluations - Array of evaluation records containing rating field
 * @returns {Number} Rounded overall average rating (e.g. 4.2)
 */
export const calculateOverallRating = (evaluations = []) => {
  if (!evaluations || evaluations.length === 0) return 0;
  const sum = evaluations.reduce((acc, curr) => acc + (Number(curr.rating) || 0), 0);
  const avg = sum / evaluations.length;
  return Math.round(avg * 10) / 10;
};
