import Resume from '../models/Resume.js';
import Student from '../models/Student.js';
import StudentSkill from '../models/StudentSkill.js';
import Evaluation from '../models/Evaluation.js';
import Job from '../models/Job.js';

// @desc    Get student resumes
// @route   GET /api/resumes
// @access  Private (Student, Admin)
export const getStudentResumes = async (req, res, next) => {
  try {
    let studentId = req.query.studentId;
    if (req.user.role === 'STUDENT') {
      const student = await Student.findOne({ userId: req.user._id });
      if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });
      studentId = student._id;
    }

    const resumes = await Resume.find({ studentId }).populate('targetJobId').sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      data: resumes,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
// @access  Private
export const getResumeById = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id).populate('targetJobId');
    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    return res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create or initialize new resume version
// @route   POST /api/resumes
// @access  Private (Student, Admin)
export const createResume = async (req, res, next) => {
  try {
    const { targetJobId, title } = req.body;

    const student = await Student.findOne({ userId: req.user._id });
    if (!student) return res.status(404).json({ success: false, message: 'Student profile not found' });

    // Fetch real student skills and evaluations from MongoDB
    const studentSkills = await StudentSkill.find({ studentId: student._id }).populate('skillId');
    const evaluations = await Evaluation.find({ studentId: student._id });

    const evalMap = new Set(evaluations.map((ev) => ev.skillId.toString()));

    const skillsData = studentSkills.map((sk) => ({
      name: sk.skillId.name,
      category: sk.skillId.category,
      proficiencyLevel: sk.proficiencyLevel,
      isVerified: evalMap.has(sk.skillId._id.toString()),
    }));

    // Perform target job ATS keyword match analysis if targetJobId is provided
    let atsKeywords = { matched: [], missing: [] };
    let atsScore = 100;

    if (targetJobId) {
      const job = await Job.findById(targetJobId).populate('requiredSkills.skillId');
      if (job) {
        const studentSkillNames = new Set(skillsData.map((s) => s.name.toLowerCase()));
        const reqSkillNames = job.requiredSkills.map((rs) => rs.skillId?.name).filter(Boolean);

        reqSkillNames.forEach((reqName) => {
          if (studentSkillNames.has(reqName.toLowerCase())) {
            atsKeywords.matched.push(reqName);
          } else {
            atsKeywords.missing.push(reqName);
          }
        });

        const totalReq = reqSkillNames.length;
        atsScore = totalReq > 0 ? Math.round((atsKeywords.matched.length / totalReq) * 100) : 100;
      }
    }

    const summaryText = `Dedicated ${student.targetRole || 'Software Engineer'} student with verified proficiency in ${skillsData
      .slice(0, 4)
      .map((s) => s.name)
      .join(', ')}. Passionate about building robust software systems and advancing industry standards.`;

    const resume = await Resume.create({
      studentId: student._id,
      targetJobId: targetJobId || null,
      title: title || `Resume — ${student.targetRole || 'Target Role'}`,
      summary: summaryText,
      skills: skillsData,
      projects: student.projects || [],
      education: [
        {
          degree: student.education || 'B.Tech Computer Science',
          institution: 'SkillBridge Technical Institute',
          batch: student.batch || '2022-2026',
        },
      ],
      certifications: student.certifications || [],
      atsKeywords,
      atsScore,
    });

    return res.status(201).json({
      success: true,
      message: 'ATS Resume version created successfully.',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resume content
// @route   PUT /api/resumes/:id
// @access  Private (Student, Admin)
export const updateResume = async (req, res, next) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    Object.assign(resume, req.body);

    // Recalculate ATS score if target job updated
    if (resume.targetJobId) {
      const job = await Job.findById(resume.targetJobId).populate('requiredSkills.skillId');
      if (job) {
        const studentSkillNames = new Set((resume.skills || []).map((s) => s.name.toLowerCase()));
        const reqSkillNames = job.requiredSkills.map((rs) => rs.skillId?.name).filter(Boolean);

        const matched = [];
        const missing = [];

        reqSkillNames.forEach((reqName) => {
          if (studentSkillNames.has(reqName.toLowerCase())) {
            matched.push(reqName);
          } else {
            missing.push(reqName);
          }
        });

        resume.atsKeywords = { matched, missing };
        resume.atsScore = reqSkillNames.length > 0 ? Math.round((matched.length / reqSkillNames.length) * 100) : 100;
      }
    }

    await resume.save();

    return res.status(200).json({
      success: true,
      message: 'Resume updated.',
      data: resume,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resume version
// @route   DELETE /api/resumes/:id
// @access  Private
export const deleteResume = async (req, res, next) => {
  try {
    await Resume.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Resume deleted.' });
  } catch (error) {
    next(error);
  }
};
