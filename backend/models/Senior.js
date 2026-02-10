import mongoose from 'mongoose';

const seniorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['2nd Year', '3rd Year', '4th Year', 'Alumni'],
    required: true
  },
  company: String,
  linkedin: String,
  imageUrl: String,
  email: String
});

export const Senior = mongoose.model('Senior', seniorSchema);