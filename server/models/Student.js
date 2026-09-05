import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    course: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    education: {
      type: String,
      default: 'B.Tech Computer Science',
      trim: true,
    },
    batch: {
      type: String,
      default: '2022-2026',
      trim: true,
    },
    location: {
      type: String,
      default: 'Bangalore, India',
      trim: true,
    },
    bio: {
      type: String,
      default: 'Passionate software engineering candidate seeking placement opportunities.',
      trim: true,
    },
    targetRole: {
      type: String,
      default: 'Full Stack Software Engineer',
      trim: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    assignedTrainerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trainer',
      default: null,
    },
    projects: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        techStack: [{ type: String, trim: true }],
        githubUrl: { type: String, trim: true },
      },
    ],
    certifications: [
      {
        title: { type: String, trim: true },
        issuer: { type: String, trim: true },
        issueDate: { type: Date },
      },
    ],
    overallRating: {
      type: Number,
      default: 0,
    },
    readinessScore: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model('Student', studentSchema);
export default Student;
