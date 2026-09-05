import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      enum: ['Application', 'InterviewRound'],
      required: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    previousStatus: {
      type: String,
      default: '',
    },
    newStatus: {
      type: String,
      required: true,
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const StatusHistory = mongoose.model('StatusHistory', statusHistorySchema);
export default StatusHistory;
