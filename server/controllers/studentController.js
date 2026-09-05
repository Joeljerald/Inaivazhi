import Student from '../models/Student.js';
import User from '../models/User.js';
import StudentSkill from '../models/StudentSkill.js';
import Skill from '../models/Skill.js';
import Job from '../models/Job.js';
import Evaluation from '../models/Evaluation.js';
import Application from '../models/Application.js';
import CompanyStudentAssociation from '../models/CompanyStudentAssociation.js';
import InterviewRound from '../models/InterviewRound.js';
import { calculateSkillGap } from '../services/skillGapEngine.js';
import { generateRecommendations } from '../services/recommendationEngine.js';
import { calculateOverallRating } from '../services/ratingEngine.js';
import { ROLES } from '../config/constants.js';

// @desc    Get all students with pagination & filters
// @route   GET /api/students
// @access  Private (Trainer, Placement, Super Admin)
export const getStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, skill, minProficiency, readiness, assignedTrainerId } = req.query;

    let query = {};

    if (assignedTrainerId) {
      query.assignedTrainerId = assignedTrainerId;
    }

    let userIds = null;
    if (search) {
      const matchingUsers = await User.find({
        role: ROLES.STUDENT,
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ],
      }).select('_id');
      userIds = matchingUsers.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    // Filter by student skill level
    if (skill && minProficiency) {
      const targetSkill = await Skill.findOne({ name: { $regex: skill, $options: 'i' } });
      if (targetSkill) {
        const studentSkills = await StudentSkill.find({
          skillId: targetSkill._id,
          proficiencyLevel: { $gte: parseInt(minProficiency) },
        }).select('studentId');
        const matchedStudentIds = studentSkills.map((ss) => ss.studentId);
        query._id = { $in: matchedStudentIds };
      }
    }

    const total = await Student.countDocuments(query);
    const students = await Student.find(query)
      .populate('userId', 'name email phone isActive')
      .populate({
        path: 'assignedTrainerId',
        populate: { path: 'userId', select: 'name email' },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    // Attach student skill metrics
    const populatedStudents = await Promise.all(
      students.map(async (student) => {
        const skills = await StudentSkill.find({ studentId: student._id }).populate('skillId');
        const evaluations = await Evaluation.find({ studentId: student._id });
        const overallRating = calculateOverallRating(evaluations);
        const associations = await CompanyStudentAssociation.find({ studentId: student._id }).populate('companyId jobId');
        const interviews = await InterviewRound.find({ studentId: student._id }).populate('companyId jobId');

        return {
          ...student.toObject(),
          skillCount: skills.length,
          skills,
          overallRating,
          associations,
          interviews,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: populatedStudents,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student profile details
// @route   GET /api/students/:id
// @access  Private
export const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('userId', 'name email phone isActive createdAt')
      .populate({
        path: 'assignedTrainerId',
        populate: { path: 'userId', select: 'name email phone' },
      });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const skills = await StudentSkill.find({ studentId: student._id }).populate('skillId');
    const evaluations = await Evaluation.find({ studentId: student._id })
      .populate('skillId')
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name' } })
      .sort({ evaluatedAt: -1 });

    const overallRating = calculateOverallRating(evaluations);
    const applications = await Application.find({ studentId: student._id }).populate('companyId jobId').sort({ createdAt: -1 });
    const associations = await CompanyStudentAssociation.find({ studentId: student._id }).populate('companyId jobId');
    const interviews = await InterviewRound.find({ studentId: student._id }).populate('companyId jobId').sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      data: {
        ...student.toObject(),
        overallRating,
        skills,
        evaluations,
        applications,
        associations,
        interviews,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get skills for a specific student
// @route   GET /api/students/:id/skills
// @access  Private
export const getStudentSkills = async (req, res, next) => {
  try {
    const skills = await StudentSkill.find({ studentId: req.params.id })
      .populate('skillId')
      .sort({ proficiencyLevel: -1 });

    // Attach latest trainer evaluation for each skill if available
    const enrichedSkills = await Promise.all(
      skills.map(async (sk) => {
        const latestEvaluation = await Evaluation.findOne({
          studentId: req.params.id,
          skillId: sk.skillId._id,
        })
          .sort({ evaluatedAt: -1 })
          .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name' } });

        return {
          _id: sk._id,
          skillId: sk.skillId._id,
          name: sk.skillId.name,
          category: sk.skillId.category,
          proficiencyLevel: sk.proficiencyLevel,
          lastEvaluatedDate: sk.lastEvaluatedDate,
          trainerRating: latestEvaluation ? latestEvaluation.rating : null,
          trainerFeedback: latestEvaluation ? latestEvaluation.feedback : 'No evaluation provided yet.',
          evaluationDate: latestEvaluation ? latestEvaluation.evaluatedAt : null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enrichedSkills,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update a skill for a student
// @route   POST /api/students/:id/skills
// @access  Private (Student self or Admin/Trainer)
export const addOrUpdateStudentSkill = async (req, res, next) => {
  try {
    const { skillId, proficiencyLevel } = req.body;
    const studentId = req.params.id;

    if (!skillId || !proficiencyLevel) {
      return res.status(400).json({ success: false, message: 'Skill ID and proficiency level (1-5) are required.' });
    }

    const levelNum = parseInt(proficiencyLevel);
    if (isNaN(levelNum) || levelNum < 1 || levelNum > 5) {
      return res.status(400).json({ success: false, message: 'Proficiency level must be an integer between 1 and 5.' });
    }

    let studentSkill = await StudentSkill.findOne({ studentId, skillId });
    if (studentSkill) {
      studentSkill.proficiencyLevel = levelNum;
      studentSkill.lastEvaluatedDate = new Date();
      await studentSkill.save();
    } else {
      studentSkill = await StudentSkill.create({
        studentId,
        skillId,
        proficiencyLevel: levelNum,
        lastEvaluatedDate: new Date(),
      });
    }

    const populated = await StudentSkill.findById(studentSkill._id).populate('skillId');

    return res.status(200).json({
      success: true,
      message: 'Student skill updated successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill from student profile
// @route   DELETE /api/students/:id/skills/:skillId
// @access  Private
export const deleteStudentSkill = async (req, res, next) => {
  try {
    await StudentSkill.findOneAndDelete({
      studentId: req.params.id,
      skillId: req.params.skillId,
    });

    return res.status(200).json({
      success: true,
      message: 'Skill removed from student profile.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Perform deterministic Skill Gap Analysis for a student and target job
// @route   GET /api/students/:studentId/jobs/:jobId/skill-gap
// @access  Private
export const getStudentSkillGap = async (req, res, next) => {
  try {
    const { studentId, jobId } = req.params;

    const student = await Student.findById(studentId).populate('userId', 'name email');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found.' });
    }

    const job = await Job.findById(jobId).populate('companyId').populate('requiredSkills.skillId');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Target job opportunity not found.' });
    }

    const studentSkills = await StudentSkill.find({ studentId }).populate('skillId');

    // Run deterministic Skill Gap Engine
    const analysis = calculateSkillGap(studentSkills, job.requiredSkills);

    // Update readiness score on student profile
    student.readinessScore = analysis.overallMatchPercent;
    await student.save();

    return res.status(200).json({
      success: true,
      data: {
        student: {
          _id: student._id,
          name: student.userId.name,
          email: student.userId.email,
        },
        job: {
          _id: job._id,
          title: job.title,
          companyName: job.companyId.name,
          location: job.location,
        },
        analysis,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get prioritized learning recommendations for a student and target job
// @route   GET /api/students/:studentId/jobs/:jobId/recommendations
// @access  Private
export const getStudentRecommendations = async (req, res, next) => {
  try {
    const { studentId, jobId } = req.params;

    const job = await Job.findById(jobId).populate('requiredSkills.skillId');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const studentSkills = await StudentSkill.find({ studentId }).populate('skillId');
    const analysis = calculateSkillGap(studentSkills, job.requiredSkills);

    const recommendations = generateRecommendations(analysis.skillBreakdown, job.title);

    return res.status(200).json({
      success: true,
      data: {
        jobTitle: job.title,
        overallMatchPercent: analysis.overallMatchPercent,
        readinessLabel: analysis.readinessLabel,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};
