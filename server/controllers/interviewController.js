import InterviewRound from '../models/InterviewRound.js';
import StatusHistory from '../models/StatusHistory.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';

// @desc    Schedule or create an interview round
// @route   POST /api/interviews
// @access  Private (Placement, Admin)
export const createInterviewRound = async (req, res, next) => {
  try {
    const { studentId, companyId, jobId, applicationId, roundName, roundNumber, scheduledDate, remarks } = req.body;

    if (!studentId || !companyId || !jobId || !roundName || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'Student ID, Company ID, Job ID, round name, and scheduled date are required.',
      });
    }

    const interview = await InterviewRound.create({
      studentId,
      companyId,
      jobId,
      applicationId: applicationId || null,
      roundName,
      roundNumber: parseInt(roundNumber) || 1,
      scheduledDate: new Date(scheduledDate),
      status: 'Scheduled',
      remarks: remarks || '',
    });

    await StatusHistory.create({
      entityType: 'InterviewRound',
      entityId: interview._id,
      previousStatus: '',
      newStatus: 'Scheduled',
      changedBy: req.user._id,
      remarks: `Interview round '${roundName}' scheduled`,
    });

    // Update parent Application status if present
    if (applicationId) {
      await Application.findByIdAndUpdate(applicationId, { status: roundName });
    }

    const populated = await InterviewRound.findById(interview._id)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .populate('companyId')
      .populate('jobId');

    return res.status(201).json({
      success: true,
      message: 'Interview round scheduled successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get interview rounds with filters
// @route   GET /api/interviews
// @access  Private
export const getInterviews = async (req, res, next) => {
  try {
    const { studentId, companyId, jobId, status } = req.query;

    let query = {};

    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user._id });
      query.studentId = student ? student._id : null;
    } else if (studentId) {
      query.studentId = studentId;
    }

    if (companyId) query.companyId = companyId;
    if (jobId) query.jobId = jobId;
    if (status) query.status = status;

    const interviews = await InterviewRound.find(query)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email phone' } })
      .populate('companyId')
      .populate('jobId')
      .sort({ scheduledDate: 1 });

    return res.status(200).json({
      success: true,
      data: interviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update interview round status
// @route   PUT /api/interviews/:id
// @access  Private (Placement, Admin)
export const updateInterviewStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const interviewId = req.params.id;

    const interview = await InterviewRound.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview round not found.' });
    }

    const previousStatus = interview.status;
    interview.status = status;
    if (remarks) interview.remarks = remarks;
    await interview.save();

    await StatusHistory.create({
      entityType: 'InterviewRound',
      entityId: interview._id,
      previousStatus,
      newStatus: status,
      changedBy: req.user._id,
      remarks: remarks || `Interview status updated to ${status}`,
    });

    // Automatically synchronize Application status if linked
    if (interview.applicationId) {
      let appStatus = status === 'Passed' ? 'Shortlisted' : status === 'Failed' ? 'Rejected' : status;
      await Application.findByIdAndUpdate(interview.applicationId, { status: appStatus });
    }

    const updated = await InterviewRound.findById(interviewId)
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .populate('companyId')
      .populate('jobId');

    return res.status(200).json({
      success: true,
      message: `Interview status updated to '${status}'.`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
