import Company from '../models/Company.js';
import Job from '../models/Job.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    
    const enriched = await Promise.all(
      companies.map(async (comp) => {
        const jobCount = await Job.countDocuments({ companyId: comp._id, isActive: true });
        return {
          ...comp.toObject(),
          activeJobsCount: jobCount,
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

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
export const getCompanyById = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    const jobs = await Job.find({ companyId: company._id }).populate('requiredSkills.skillId');

    return res.status(200).json({
      success: true,
      data: {
        ...company.toObject(),
        jobs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new company
// @route   POST /api/companies
// @access  Private (Placement, Admin)
export const createCompany = async (req, res, next) => {
  try {
    const { name, industry, location, website, contactPerson, contactEmail, contactPhone, logo } = req.body;

    const exists = await Company.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (exists) {
      return res.status(409).json({ success: false, message: 'A company with this name already exists.' });
    }

    const company = await Company.create({
      name,
      industry,
      location,
      website: website || '',
      contactPerson,
      contactEmail,
      contactPhone: contactPhone || '',
      logo: logo || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Company profile created successfully.',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company profile
// @route   PUT /api/companies/:id
// @access  Private (Placement, Admin)
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Company updated successfully.',
      data: company,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company
// @route   DELETE /api/companies/:id
// @access  Private (Admin)
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Company deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
