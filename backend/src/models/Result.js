const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  similarityScore: {
    type: Number,
    min: 0,
    max: 1,
    required: true
  },
  percentageMatch: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  matchedSkills: [{
    skill: String,
    confidence: Number
  }],
  missingSkills: [String],
  experienceYears: {
    type: Number,
    default: 0
  },
  ranking: {
    type: Number
  },
  feedback: {
    type: String
  },
  matchBreakdown: {
    content_similarity: Number,
    skill_match: Number,
    experience_match: Number
  },
  recommendedAction: String,
  adminNotes: String,
  adminRating: {
    type: Number,
    min: 1,
    max: 5
  },
  candidateStatus: {
    type: String,
    enum: ['new', 'reviewing', 'shortlisted', 'rejected', 'interview_scheduled', 'offered', 'hired'],
    default: 'new'
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', ResultSchema);

