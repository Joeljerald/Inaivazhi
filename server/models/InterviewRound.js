import mongoose from 'mongoose';
import { INTERVIEW_STATUSES } from '../config/constants.js';

const interviewRoundSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      default: null,
    },
    roundName: {
      type: String,
      required: true,
      trim: true,
    },
    roundNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: INTERVIEW_STATUSES,
      default: 'Scheduled',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const InterviewRound = mongoose.model('InterviewRound', interviewRoundSchema);
export default InterviewRound;
