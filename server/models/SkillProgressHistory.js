import mongoose from 'mongoose';

const skillProgressHistorySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    skillId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    previousRating: {
      type: Number,
      min: 1,
      max: 5,
      default: 1,
    },
    newRating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    trainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    evaluatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const SkillProgressHistory = mongoose.model('SkillProgressHistory', skillProgressHistorySchema);
export default SkillProgressHistory;
