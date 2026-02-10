import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  branch: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  subjectName: {
    type: String,
    required: true
  },
  subjectCode: String,
  resources: [{
    title: String,
    type: {
      type: String,
      enum: ['lecture', 'pdf', 'pyq', 'notes']
    },
    link: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient searching
resourceSchema.index({ branch: 1, semester: 1 });

export const Resource = mongoose.model('Resource', resourceSchema);