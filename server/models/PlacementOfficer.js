import mongoose from 'mongoose';

const placementOfficerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    department: {
      type: String,
      default: 'Training & Placement Cell',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const PlacementOfficer = mongoose.model('PlacementOfficer', placementOfficerSchema);
export default PlacementOfficer;
