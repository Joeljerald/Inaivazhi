import Trainer from '../models/Trainer.js';
import Student from '../models/Student.js';
import StudentSkill from '../models/StudentSkill.js';
import Skill from '../models/Skill.js';
import Evaluation from '../models/Evaluation.js';
import Feedback from '../models/Feedback.js';
import CompanyStudentAssociation from '../models/CompanyStudentAssociation.js';
import InterviewRound from '../models/InterviewRound.js';
import Job from '../models/Job.js';
import { calculateSkillGap } from '../services/skillGapEngine.js';
import { calculateOverallRating } from '../services/ratingEngine.js';
import { parseNaturalLanguageSkillQuery } from '../services/aiService.js';

// @desc    Get trainer profile and list of trainers
// @route   GET /api/trainers
// @access  Private
export const getTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find()
      .populate('userId', 'name email phone isActive')
      .populate({
        path: 'assignedStudents',
        populate: { path: 'userId', select: 'name email' },
      });

    return res.status(200).json({
      success: true,
      data: trainers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get students assigned to a specific trainer
// @route   GET /api/trainers/:id/students
// @access  Private (Trainer, Admin)
export const getAssignedStudents = async (req, res, next) => {
  try {
    const trainerId = req.params.id;
    const trainer = await Trainer.findById(trainerId);

    if (!trainer) {
      return res.status(404).json({ success: false, message: 'Trainer profile not found.' });
    }

    const students = await Student.find({ assignedTrainerId: trainerId })
      .populate('userId', 'name email phone isActive')
      .sort({ createdAt: -1 });

    const enrichedStudents = await Promise.all(
      students.map(async (st) => {
        const skills = await StudentSkill.find({ studentId: st._id }).populate('skillId');
        const evaluations = await Evaluation.find({ studentId: st._id });
        const overallRating = calculateOverallRating(evaluations);
        const associations = await CompanyStudentAssociation.find({ studentId: st._id })
          .populate('companyId jobId')
          .sort({ createdAt: -1 });
        const latestInterview = await InterviewRound.findOne({ studentId: st._id })
          .populate('companyId jobId')
          .sort({ scheduledDate: -1 });

        return {
          ...st.toObject(),
          skillCount: skills.length,
          skills,
          evaluationsCount: evaluations.length,
          overallRating,
          associatedCompany: associations.length > 0 ? associations[0].companyId?.name : 'Not Associated',
          associatedJob: associations.length > 0 ? associations[0].jobId?.title : 'N/A',
          matchPercent: associations.length > 0 ? associations[0].matchPercent : 0,
          interviewStatus: latestInterview ? `${latestInterview.roundName} (${latestInterview.status})` : 'None',
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedStudents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Filter students by multi-skill proficiency levels or natural language prompt
// @route   POST /api/trainers/filter-students
// @access  Private (Trainer, Placement, Admin)
export const filterStudentsBySkills = async (req, res, next) => {
  try {
    const { skillsFilter = [], naturalQuery = '' } = req.body;

    let parsedFilter = skillsFilter;
    if (naturalQuery) {
      parsedFilter = parseNaturalLanguageSkillQuery(naturalQuery);
    }

    let candidateStudentIds = null;

    for (const reqSkill of parsedFilter) {
      if (!reqSkill.skillName || !reqSkill.minLevel) continue;

      const skillDoc = await Skill.findOne({ name: { $regex: new RegExp(`^${reqSkill.skillName}$`, 'i') } });
      if (!skillDoc) {
        candidateStudentIds = [];
        break;
      }

      const matchingSkills = await StudentSkill.find({
        skillId: skillDoc._id,
        proficiencyLevel: { $gte: Number(reqSkill.minLevel) },
      }).select('studentId');

      const ids = matchingSkills.map((ms) => ms.studentId.toString());

      if (candidateStudentIds === null) {
        candidateStudentIds = ids;
      } else {
        candidateStudentIds = candidateStudentIds.filter((id) => ids.includes(id));
      }
    }

    let query = {};
    if (candidateStudentIds !== null) {
      query._id = { $in: candidateStudentIds };
    }

    const students = await Student.find(query)
      .populate('userId', 'name email phone')
      .populate('assignedTrainerId');

    const results = await Promise.all(
      students.map(async (st) => {
        const skills = await StudentSkill.find({ studentId: st._id }).populate('skillId');
        const evaluations = await Evaluation.find({ studentId: st._id });
        const overallRating = calculateOverallRating(evaluations);

        return {
          ...st.toObject(),
          skills,
          overallRating,
        };
      })
    );

    return res.status(200).json({
      success: true,
      count: results.length,
      parsedFilter,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Trainer - Most Suitable Students for a Job (Part 25)
// @route   GET /api/trainers/most-suitable/:jobId
// @access  Private (Trainer, Admin)
export const getMostSuitableStudents = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId).populate('companyId').populate('requiredSkills.skillId');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    let trainer = await Trainer.findOne({ userId: req.user._id });
    let query = {};
    if (trainer) {
      query.assignedTrainerId = trainer._id;
    }

    const students = await Student.find(query).populate('userId', 'name email phone');

    const ranked = await Promise.all(
      students.map(async (st) => {
        const skills = await StudentSkill.find({ studentId: st._id }).populate('skillId');
        const evaluations = await Evaluation.find({ studentId: st._id });
        const overallRating = calculateOverallRating(evaluations);
        const analysis = calculateSkillGap(skills, job.requiredSkills);

        return {
          student: st,
          overallRating,
          matchPercent: analysis.overallMatchPercent,
          readinessLabel: analysis.readinessLabel,
          matchedSkills: analysis.matchedSkills,
          gaps: analysis.gaps,
          mandatoryGaps: analysis.mandatoryGaps,
        };
      })
    );

    ranked.sort((a, b) => b.matchPercent - a.matchPercent);

    return res.status(200).json({
      success: true,
      job: {
        _id: job._id,
        title: job.title,
        companyName: job.companyId?.name,
      },
      data: ranked,
    });
  } catch (error) {
    next(error);
  }
};
