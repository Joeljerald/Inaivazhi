import mongoose from 'mongoose';

const companyStudentAssociationSchema = new mongoose.Schema(
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
    matchPercent: {
      type: Number,
      required: true,
    },
    associatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

companyStudentAssociationSchema.index({ studentId: 1, jobId: 1 }, { unique: true });

const CompanyStudentAssociation = mongoose.model(
  'CompanyStudentAssociation',
  companyStudentAssociationSchema
);
export default CompanyStudentAssociation;
