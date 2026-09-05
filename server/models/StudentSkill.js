import mongoose from 'mongoose';

const studentSkillSchema = new mongoose.Schema(
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
    proficiencyLevel: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
      default: 1,
    },
    selfProficiencyLevel: {
      type: Number,
      min: 1,
      max: 5,
      default: 3,
    },
    lastEvaluatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

studentSkillSchema.index({ studentId: 1, skillId: 1 }, { unique: true });

const StudentSkill = mongoose.model('StudentSkill', studentSkillSchema);
export default StudentSkill;
