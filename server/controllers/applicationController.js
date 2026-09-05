import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Job from '../models/Job.js';
import StudentSkill from '../models/StudentSkill.js';
import StatusHistory from '../models/StatusHistory.js';
import { calculateSkillGap } from '../services/skillGapEngine.js';

// @desc    Submit a job application
// @route   POST /api/applications
// @access  Private (Student or Admin)
export const applyForJob = async (req, res, next) => {
  try {
    const { studentId, jobId } = req.body;

    const targetStudentId = studentId || (req.user.role === 'STUDENT' ? (await Student.findOne({ userId: req.user._id }))._id : null);
    if (!targetStudentId || !jobId) {
      return res.status(400).json({ success: false, message: 'Student ID and Job ID are required.' });
    }

    const student = await Student.findById(targetStudentId);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student profile not found.' });
    }

    const job = await Job.findById(jobId).populate('requiredSkills.skillId');
    if (!job) {
      return res.status(404).json({ success: false, message: 'Target job posting not found.' });
    }

    // Check duplicate application
    const existing = await Application.findOne({ studentId: targetStudentId, jobId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Student has already submitted an application for this position.' });
    }

    // CRITICAL: Calculate exact backend match percentage from MongoDB student skills
    const studentSkills = await StudentSkill.find({ studentId: targetStudentId }).populate('skillId');
    const analysis = calculateSkillGap(studentSkills, job.requiredSkills);
    const backendMatchPercent = analysis.overallMatchPercent;

    const application = await Application.create({
      studentId: targetStudentId,
      jobId,
      companyId: job.companyId,
      matchPercent: backendMatchPercent,
      status: 'Applied',
      appliedAt: new Date(),
    });

    // Record status history
    await StatusHistory.create({
      entityType: 'Application',
      entityId: application._id,
      previousStatus: '',
      newStatus: 'Applied',
      changedBy: req.user._id,
      remarks: 'Application submitted',
    });

    const populated = await Application.findById(application._id)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .populate('companyId')
      .populate('jobId');

    return res.status(201).json({
      success: true,
      message: 'Job application submitted successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications list with filters
// @route   GET /api/applications
// @access  Private
export const getApplications = async (req, res, next) => {
  try {
    const { studentId, jobId, companyId, status } = req.query;

    let query = {};

    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student ? student._id : null;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (jobId) query.jobId = jobId;
    if (companyId) query.companyId = companyId;
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('companyId')
      .populate('jobId')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Placement Team / Admin)
// @route   PUT /api/applications/:id
// @access  Private (Placement, Admin)
export const updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application record not found.' });
    }

    const previousStatus = application.status;
    application.status = status;
    await application.save();

    await StatusHistory.create({
      entityType: 'Application',
      entityId: application._id,
      previousStatus,
      newStatus: status,
      changedBy: req.user._id,
      remarks: remarks || `Status updated to ${status}`,
    });

    const updated = await Application.findById(applicationId)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .populate('companyId')
      .populate('jobId');

    return res.status(200).json({
      success: true,
      message: `Application status updated to '${status}'.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
