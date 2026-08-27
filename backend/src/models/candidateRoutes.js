// backend/src/models/candidateModel.js
const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  degree: {
    type: String,
    required: true,
    trim: true,
  },
  institution: {
    type: String,
    required: true,
    trim: true,
  },
  year: {
    type: Number,
    required: true,
  },
});

const candidateSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, 
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      lowercase: true, 
      index: true,     
    },
    experience: {
      type: Number, 
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
      index: true,  
    },
    skills: {
      type: [String],
      required: [true, 'At least one skill is required'],
      validate: [
        (val) => val.length > 0,
        'Skills array must contain at least one skill',
      ],
      index: true, 
    },
    education: [educationSchema],
    status: {
      type: String,
      enum: ['APPLIED', 'IN_REVIEW', 'SHORTLISTED', 'REJECTED', 'HIRED'],
      default: 'APPLIED',
      index: true, 
    },
    resumeUrl: {
      type: String,
      required: [true, 'Resume URL is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);


candidateSchema.index({ status: 1, location: 1, experience: -1 });


candidateSchema.index(
  {
    skills: 'text',
    location: 'text',
    'education.institution': 'text',
    'education.degree': 'text',
  },
  {
    weights: {
      skills: 10,
      location: 5,
      'education.degree': 3,
      'education.institution': 1,
    },
    name: 'CandidateTextIndex',
  }
);

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;