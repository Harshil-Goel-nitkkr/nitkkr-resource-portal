import mongoose from 'mongoose';

const contributionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['bug', 'resource'],
    required: true
  },
  description: String,
  details: {
    branch: String,
    semester: Number,
    subjectName: String,
    link: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  submittedBy: {
    type: String // User email or ID
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Contribution = mongoose.model('Contribution', contributionSchema);