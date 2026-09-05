import mongoose from 'mongoose';

const jobSkillSchema = new mongoose.Schema(
  {
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    requiredLevel: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    mandatory: {
      type: Boolean,
      default: false,
    },
    weight: {
      type: Number,
      min: 0.1,
      default: 1,
    },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Internship', 'Contract'],
      default: 'Full-time',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    salaryRange: {
      type: String,
      default: '7,00,000 - 12,00,000 INR per annum',
      trim: true,
    },
    requiredSkills: [jobSkillSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.model('Job', jobSchema);
export default Job;
