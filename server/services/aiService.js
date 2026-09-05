import { generateRecommendations } from './recommendationEngine.js';

// Canonical Skill Alias Map (Part 58 Requirement)
const SKILL_ALIASES = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  'java script': 'JavaScript',
  react: 'React',
  'react.js': 'React',
  reactjs: 'React',
  'react js': 'React',
  node: 'Node.js',
  nodejs: 'Node.js',
  'node.js': 'Node.js',
  express: 'Express.js',
  expressjs: 'Express.js',
  py: 'Python',
  python: 'Python',
  python3: 'Python',
  mongo: 'MongoDB',
  mongodb: 'MongoDB',
  postgres: 'PostgreSQL',
  postgresql: 'PostgreSQL',
  spring: 'Spring Boot',
  springboot: 'Spring Boot',
  'spring boot': 'Spring Boot',
  html: 'HTML',
  css: 'CSS',
  java: 'Java',
  django: 'Django',
  aws: 'AWS',
  docker: 'Docker',
  git: 'Git',
};

const PROFICIENCY_WORD_MAP = {
  beginner: 1,
  basic: 2,
  intermediate: 3,
  advanced: 4,
  expert: 5,
};

/**
 * Parses natural language skill queries into structured requirements.
 * Example: "Find students who know HTML at Advanced level, JavaScript at Intermediate level and React at Beginner level."
 */
export const parseNaturalLanguageSkillQuery = (queryText = '') => {
  const requirements = [];
  const text = queryText.toLowerCase();

  // Pattern match skills and levels
  Object.keys(SKILL_ALIASES).forEach((alias) => {
    if (text.includes(alias)) {
      const canonicalName = SKILL_ALIASES[alias];

      // Check if skill already parsed
      if (!requirements.some((r) => r.skillName === canonicalName)) {
        let level = 3; // Default intermediate

        // Search text segment following skill mention
        const idx = text.indexOf(alias);
        const segment = text.slice(idx, idx + 40);

        Object.keys(PROFICIENCY_WORD_MAP).forEach((word) => {
          if (segment.includes(word)) {
            level = PROFICIENCY_WORD_MAP[word];
          }
        });

        // Also check numerical levels (1-5)
        const numMatch = segment.match(/([1-5])\s*\/\s*5|level\s*([1-5])/);
        if (numMatch) {
          level = parseInt(numMatch[1] || numMatch[2]);
        }

        requirements.push({
          skillName: canonicalName,
          minLevel: level,
          mandatory: true,
        });
      }
    }
  });

  if (requirements.length === 0) {
    // Default fallback if query is empty or unrecognized
    requirements.push(
      { skillName: 'HTML', minLevel: 4, mandatory: true },
      { skillName: 'JavaScript', minLevel: 3, mandatory: true },
      { skillName: 'React', minLevel: 2, mandatory: true }
    );
  }

  return requirements;
};

/**
 * Generates an AI Student Improvement Learning Roadmap based strictly on verified MongoDB data.
 */
export const generateStudentAIRoadmap = async (context) => {
  const { student, evaluations, job, skillGap } = context;

  const studentName = student?.name || 'Student';
  const jobTitle = job?.title || 'Target Role';
  const matchPercent = skillGap?.overallMatchPercent || 0;

  const recommendations = generateRecommendations(
    skillGap?.skillBreakdown || [],
    jobTitle
  );

  const weeklyRoadmap = [];
  let weekCounter = 1;

  recommendations.slice(0, 4).forEach((rec) => {
    weeklyRoadmap.push({
      week: `Week ${weekCounter}`,
      topic: `${rec.skillName} Mastery & Application`,
      focus: `Elevate current level ${rec.currentLevel}/5 to target level ${rec.targetLevel}/5 (${rec.priority} Priority).`,
      actionableSteps: [
        `Complete foundational documentation and tutorials for ${rec.skillName}.`,
        `Work through hands-on coding exercises focusing on real-world practical patterns.`,
        `Build a mini-project module demonstrating proficiency in ${rec.skillName}.`,
        `Request evaluation re-assessment from assigned trainer.`,
      ],
    });
    weekCounter++;
  });

  if (weeklyRoadmap.length === 0) {
    weeklyRoadmap.push({
      week: 'Week 1',
      topic: 'Advanced Project Portfolio & Interview Readiness',
      focus: 'Maintain current top proficiency level and conduct mock technical interviews.',
      actionableSteps: [
        'Build a full-stack production architecture project.',
        'Practice algorithmic problem solving and system design questions.',
        'Review recent interview feedback with placement team.',
      ],
    });
  }

  const synthesis = {
    summary: `${studentName} currently achieves a ${matchPercent}% match score for ${jobTitle} (${skillGap?.readinessLabel || 'Evaluation pending'}).`,
    topStrengths: (skillGap?.matchedSkills || []).map(
      (s) => `${s.name} (Level ${s.currentLevel}/5)`
    ),
    criticalGaps: (skillGap?.mandatoryGaps || []).map(
      (s) => `${s.name} (Requires level ${s.requiredLevel}/5, current level is ${s.currentLevel}/5)`
    ),
    trainerNotesSummary: (evaluations || [])
      .map((ev) => `${ev.skillId?.name || 'Skill'}: "${ev.feedback || 'Good progress'}"`)
      .slice(0, 3),
    weeklyRoadmap,
    suggestedProjects: [
      `Build an enterprise ${jobTitle} portfolio project leveraging ${
        skillGap?.matchedSkills[0]?.name || 'Full-Stack'
      } and ${recommendations[0]?.skillName || 'Database'}`,
      `Implement automated testing and CI/CD pipelines for core project repositories`,
    ],
    isAiGenerated: true,
  };

  return synthesis;
};

/**
 * Generates AI candidate search analysis & ranking explanation for trainers.
 */
export const generateCandidateSearchAIExplanation = async (requirements, candidateMatches) => {
  const rankedCandidates = candidateMatches.map((item, index) => ({
    rank: index + 1,
    studentId: item.student._id,
    studentName: item.student.userId.name,
    overallMatchPercent: item.matchPercent,
    skillsOverview: item.skillMatchDetails,
    aiRecommendationReasoning: `${item.student.userId.name} possesses ${
      item.matchPercent
    }% alignment with the required skills. ${
      item.matchPercent >= 80
        ? 'Excellent candidate for immediate placement recommendation.'
        : item.matchPercent >= 60
        ? 'Strong core foundation, recommend brief targeted review on missing skills.'
        : 'Requires additional skill gap remediation before placement interview.'
    }`,
  }));

  return {
    requirements,
    candidateCount: rankedCandidates.length,
    candidates: rankedCandidates,
    isAiGenerated: true,
  };
};
