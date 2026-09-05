import mongoose from 'mongoose';
import { APPLICATION_STATUSES } from '../config/constants.js';

const applicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    matchPercent: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'Applied',
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Unique index preventing duplicate applications for same student and job
applicationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.model('Application', applicationSchema);
export default Application;
