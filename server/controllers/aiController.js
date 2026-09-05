import Student from '../models/Student.js';
import StudentSkill from '../models/StudentSkill.js';
import Evaluation from '../models/Evaluation.js';
import Job from '../models/Job.js';
import Skill from '../models/Skill.js';
import { calculateSkillGap } from '../services/skillGapEngine.js';
import { generateStudentAIRoadmap, generateCandidateSearchAIExplanation } from '../services/aiService.js';

// @desc    Generate personalized AI Learning Roadmap for student
// @route   POST /api/ai/student-roadmap
// @access  Private
export const getStudentRoadmap = async (req, res, next) => {
  try {
    const { studentId, jobId } = req.body;

    const student = await Student.findById(studentId).populate('userId', 'name email');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const job = await Job.findById(jobId).populate('companyId').populate('requiredSkills.skillId');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const studentSkills = await StudentSkill.find({ studentId }).populate('skillId');
    const evaluations = await Evaluation.find({ studentId })
      .populate('skillId')
      .sort({ evaluatedAt: -1 });

    const skillGap = calculateSkillGap(studentSkills, job.requiredSkills);

    // Call grounded AI service (with automatic fallback if AI service key is omitted/fails)
    const roadmap = await generateStudentAIRoadmap({
      student: { name: student.userId.name, email: student.userId.email },
      evaluations,
      job: { title: job.title, company: job.companyId?.name },
      skillGap,
    });

    return res.status(200).json({
      success: true,
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    AI Candidate Matcher for Trainer / Placement Team
// @route   POST /api/ai/candidate-match
// @access  Private (Trainer, Placement, Admin)
export const searchCandidatesAI = async (req, res, next) => {
  try {
    // requirements e.g. [{ skillName: 'HTML', minLevel: 4 }, { skillName: 'JavaScript', minLevel: 3 }, { skillName: 'React', minLevel: 2 }]
    const { requirements = [], minMatchPercent = 0 } = req.body;

    if (!requirements || requirements.length === 0) {
      return res.status(400).json({ success: false, message: 'Skill requirements array is required.' });
    }

    // Convert requirements into simulated JobSkill specs
    const jobSkillsSpec = [];
    for (const reqSkill of requirements) {
      const skillDoc = await Skill.findOne({ name: { $regex: new RegExp(`^${reqSkill.skillName}$`, 'i') } });
      if (skillDoc) {
        jobSkillsSpec.push({
          skillId: skillDoc,
          requiredLevel: Number(reqSkill.minLevel) || 1,
          mandatory: reqSkill.mandatory !== undefined ? reqSkill.mandatory : true,
          weight: Number(reqSkill.weight) || 1,
        });
      }
    }

    // Fetch all students from MongoDB
    const students = await Student.find().populate('userId', 'name email phone');

    const candidateMatches = [];

    for (const student of students) {
      const studentSkills = await StudentSkill.find({ studentId: student._id }).populate('skillId');
      const analysis = calculateSkillGap(studentSkills, jobSkillsSpec);

      if (analysis.overallMatchPercent >= Number(minMatchPercent)) {
        candidateMatches.push({
          student,
          matchPercent: analysis.overallMatchPercent,
          readinessLabel: analysis.readinessLabel,
          skillMatchDetails: analysis.skillBreakdown,
        });
      }
    }

    // Sort candidates descending by match percentage
    candidateMatches.sort((a, b) => b.matchPercent - a.matchPercent);

    // Attach AI ranking and natural language explanation
    const aiExplanation = await generateCandidateSearchAIExplanation(requirements, candidateMatches);

    return res.status(200).json({
      success: true,
      count: candidateMatches.length,
      data: {
        matches: candidateMatches,
        aiExplanation,
      },
    });
  } catch (error) {
    next(error);
  }
};
