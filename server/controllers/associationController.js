import CompanyStudentAssociation from '../models/CompanyStudentAssociation.js';
import Student from '../models/Student.js';
import Job from '../models/Job.js';
import StudentSkill from '../models/StudentSkill.js';
import Application from '../models/Application.js';
import { calculateSkillGap } from '../services/skillGapEngine.js';

// @desc    Associate candidate student with company & job
// @route   POST /api/associations
// @access  Private (Placement, Admin)
export const createAssociation = async (req, res, next) => {
  try {
    const { studentId, jobId } = req.body;

    if (!studentId || !jobId) {
      return res.status(400).json({ success: false, message: 'Student ID and Job ID are required.' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const job = await Job.findById(jobId).populate('requiredSkills.skillId');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    // Calculate actual backend match percentage
    const studentSkills = await StudentSkill.find({ studentId }).populate('skillId');
    const analysis = calculateSkillGap(studentSkills, job.requiredSkills);

    let association = await CompanyStudentAssociation.findOne({ studentId, jobId });
    if (association) {
      association.matchPercent = analysis.overallMatchPercent;
      association.associatedAt = new Date();
      await association.save();
    } else {
      association = await CompanyStudentAssociation.create({
        studentId,
        companyId: job.companyId,
        jobId,
        matchPercent: analysis.overallMatchPercent,
        associatedAt: new Date(),
      });
    }

    // Also auto-create or update Application if not already existing
    let app = await Application.findOne({ studentId, jobId });
    if (!app) {
      await Application.create({
        studentId,
        companyId: job.companyId,
        jobId,
        matchPercent: analysis.overallMatchPercent,
        status: 'Shortlisted',
      });
    }

    const populated = await CompanyStudentAssociation.findById(association._id)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('companyId')
      .populate('jobId');

    return res.status(201).json({
      success: true,
      message: 'Student candidate successfully associated with company.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get candidate associations
// @route   GET /api/associations
// @access  Private
export const getAssociations = async (req, res, next) => {
  try {
    const { studentId, companyId, jobId } = req.query;

    let query = {};
    if (studentId) query.studentId = studentId;
    if (companyId) query.companyId = companyId;
    if (jobId) query.jobId = jobId;

    const list = await CompanyStudentAssociation.find(query)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('companyId')
      .populate('jobId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: list,
    });
  } catch (error) {
    next(error);
  }
};
