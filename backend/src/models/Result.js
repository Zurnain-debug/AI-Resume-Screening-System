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
  ranking: {
    type: Number
  },
  feedback: {
    type: String
  },
  analyzedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Result', ResultSchema);
