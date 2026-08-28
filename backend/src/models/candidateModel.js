const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
    },
    experienceYears: {
      type: Number,
      required: [true, 'Experience years is required'],
      min: 0,
    },
    resumeUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['PENDING', 'REVIEWED', 'SHORTLISTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  {
    timestamps: true,
  }
);

// Optimized index for fast searching and filtering by skills or experience
candidateSchema.index({ skills: 1, experienceYears: 1 });



// candidateModel.js ke aakhir mein:
module.exports = mongoose.model('Candidate', candidateSchema);