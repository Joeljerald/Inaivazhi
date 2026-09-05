import Evaluation from '../models/Evaluation.js';
import Feedback from '../models/Feedback.js';
import Student from '../models/Student.js';
import StudentSkill from '../models/StudentSkill.js';
import Trainer from '../models/Trainer.js';
import { calculateOverallRating } from '../services/ratingEngine.js';

// @desc    Submit a skill evaluation for a student
// @route   POST /api/evaluations
// @access  Private (Trainer, Admin)
export const createEvaluation = async (req, res, next) => {
  try {
    const { studentId, skillId, rating, feedback, strength, improvementArea } = req.body;

    if (!studentId || !skillId || !rating) {
      return res.status(400).json({ success: false, message: 'Student ID, Skill ID, and rating (1-5) are required.' });
    }

    const ratingNum = parseInt(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be an integer between 1 and 5.' });
    }

    // Determine trainer profile
    let trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer && req.user.role === 'SUPER_ADMIN') {
      trainer = await Trainer.findOne();
    }
    if (!trainer) {
      return res.status(403).json({ success: false, message: 'Only authorized trainers can perform evaluations.' });
    }

    // Create Evaluation record
    const evaluation = await Evaluation.create({
      studentId,
      trainerId: trainer._id,
      skillId,
      rating: ratingNum,
      feedback: feedback || '',
      strength: strength || '',
      improvementArea: improvementArea || '',
      evaluatedAt: new Date(),
    });

    // Automatically synchronize student's skill proficiency level in StudentSkill
    let studentSkill = await StudentSkill.findOne({ studentId, skillId });
    if (studentSkill) {
      studentSkill.proficiencyLevel = ratingNum;
      studentSkill.lastEvaluatedDate = new Date();
      await studentSkill.save();
    } else {
      await StudentSkill.create({
        studentId,
        skillId,
        proficiencyLevel: ratingNum,
        lastEvaluatedDate: new Date(),
      });
    }

    // Recalculate student's overall rating dynamically from all stored evaluations
    const allStudentEvaluations = await Evaluation.find({ studentId });
    const newOverallRating = calculateOverallRating(allStudentEvaluations);
    await Student.findByIdAndUpdate(studentId, { overallRating: newOverallRating });

    const populatedEvaluation = await Evaluation.findById(evaluation._id)
      .populate('skillId')
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name' } });

    return res.status(201).json({
      success: true,
      message: 'Evaluation successfully recorded and student rating updated.',
      data: populatedEvaluation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all evaluations for a specific student
// @route   GET /api/evaluations/student/:studentId
// @access  Private
export const getStudentEvaluations = async (req, res, next) => {
  try {
    const evaluations = await Evaluation.find({ studentId: req.params.studentId })
      .populate('skillId')
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name' } })
      .sort({ evaluatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: evaluations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit general qualitative feedback for a student
// @route   POST /api/feedback
// @access  Private (Trainer, Admin)
export const createFeedback = async (req, res, next) => {
  try {
    const { studentId, generalFeedback, strengths = [], weaknesses = [], improvementSuggestions = [] } = req.body;

    let trainer = await Trainer.findOne({ userId: req.user._id });
    if (!trainer && req.user.role === 'SUPER_ADMIN') {
      trainer = await Trainer.findOne();
    }

    const feedbackDoc = await Feedback.create({
      studentId,
      trainerId: trainer._id,
      generalFeedback,
      strengths,
      weaknesses,
      improvementSuggestions,
    });

    return res.status(201).json({
      success: true,
      message: 'Trainer feedback submitted successfully.',
      data: feedbackDoc,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback for a specific student
// @route   GET /api/feedback/student/:studentId
// @access  Private
export const getStudentFeedback = async (req, res, next) => {
  try {
    const feedbackList = await Feedback.find({ studentId: req.params.studentId })
      .populate({ path: 'trainerId', populate: { path: 'userId', select: 'name' } })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: feedbackList,
    });
  } catch (error) {
    next(error);
  }
};
