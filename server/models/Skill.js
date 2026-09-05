import mongoose from 'mongoose';
import { SKILL_CATEGORIES } from '../config/constants.js';

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Skill name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: SKILL_CATEGORIES,
      required: [true, 'Skill category is required'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Skill = mongoose.model('Skill', skillSchema);
export default Skill;
