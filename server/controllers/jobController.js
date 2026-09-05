import Job from '../models/Job.js';
import Skill from '../models/Skill.js';
import Application from '../models/Application.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Private
export const getJobs = async (req, res, next) => {
  try {
    const { search, companyId, activeOnly } = req.query;

    let query = {};
    if (activeOnly !== 'false') {
      query.isActive = true;
    }
    if (companyId) {
      query.companyId = companyId;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const jobs = await Job.find(query)
      .populate('companyId')
      .populate('requiredSkills.skillId')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      jobs.map(async (j) => {
        const appCount = await Application.countDocuments({ jobId: j._id });
        return {
          ...j.toObject(),
          applicationsCount: appCount,
        };
      })
    );

    return res.status(200).json({
      success: true,
      data: enriched,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job opening details
// @route   GET /api/jobs/:id
// @access  Private
export const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('companyId')
      .populate('requiredSkills.skillId');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job posting not found.' });
    }

    const applications = await Application.find({ jobId: job._id })
      .populate({ path: 'studentId', populate: { path: 'userId', select: 'name email' } })
      .sort({ matchPercent: -1 });

    return res.status(200).json({
      success: true,
      data: {
        ...job.toObject(),
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create job opening with required skill specifications
// @route   POST /api/jobs
// @access  Private (Placement, Admin)
export const createJob = async (req, res, next) => {
  try {
    const { companyId, title, location, employmentType, description, salaryRange, requiredSkills } = req.body;

    if (!companyId || !title || !description) {
      return res.status(400).json({ success: false, message: 'Company ID, job title, and description are required.' });
    }

    const job = await Job.create({
      companyId,
      title,
      location: location || 'Bangalore, India',
      employmentType: employmentType || 'Full-time',
      description,
      salaryRange: salaryRange || '7,00,000 - 12,00,000 INR per annum',
      requiredSkills: requiredSkills || [],
    });

    const populated = await Job.findById(job._id)
      .populate('companyId')
      .populate('requiredSkills.skillId');

    return res.status(201).json({
      success: true,
      message: 'Job opening published successfully.',
      data: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job opening details
// @route   PUT /api/jobs/:id
// @access  Private (Placement, Admin)
export const updateJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('companyId')
      .populate('requiredSkills.skillId');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job details updated successfully.',
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job opening
// @route   DELETE /api/jobs/:id
// @access  Private (Placement, Admin)
export const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Job posting deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update required skill on a job opening
// @route   POST /api/jobs/:id/skills
// @access  Private (Placement, Admin)
export const addOrUpdateJobSkill = async (req, res, next) => {
  try {
    const { skillId, requiredLevel, mandatory, weight } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    const existingIndex = job.requiredSkills.findIndex(
      (s) => s.skillId.toString() === skillId.toString()
    );

    const skillRequirement = {
      skillId,
      requiredLevel: parseInt(requiredLevel) || 1,
      mandatory: Boolean(mandatory),
      weight: parseFloat(weight) || 1,
    };

    if (existingIndex >= 0) {
      job.requiredSkills[existingIndex] = skillRequirement;
    } else {
      job.requiredSkills.push(skillRequirement);
    }

    await job.save();

    const updatedJob = await Job.findById(jobId).populate('requiredSkills.skillId');

    return res.status(200).json({
      success: true,
      message: 'Job skill requirement updated.',
      data: updatedJob.requiredSkills,
    });
  } catch (error) {
    next(error);
  }
};
