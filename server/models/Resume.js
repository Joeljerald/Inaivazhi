import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    targetJobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      default: null,
    },
    title: {
      type: String,
      required: true,
      default: 'ATS Professional Resume',
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        name: { type: String, required: true },
        category: { type: String, default: 'Technical' },
        proficiencyLevel: { type: Number, default: 3 },
        isVerified: { type: Boolean, default: false },
      },
    ],
    projects: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        techStack: [{ type: String }],
        bullets: [{ type: String }],
        githubUrl: { type: String, default: '' },
      },
    ],
    education: [
      {
        degree: { type: String, required: true },
        institution: { type: String, default: 'SkillBridge University' },
        batch: { type: String, default: '2022-2026' },
      },
    ],
    experience: [
      {
        role: { type: String },
        company: { type: String },
        duration: { type: String },
        description: { type: String },
      },
    ],
    certifications: [
      {
        title: { type: String },
        issuer: { type: String },
        issueDate: { type: Date },
      },
    ],
    achievements: [
      {
        title: { type: String },
        description: { type: String },
      },
    ],
    atsScore: {
      type: Number,
      default: 0,
    },
    atsKeywords: {
      matched: [{ type: String }],
      missing: [{ type: String }],
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
