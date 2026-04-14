const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['PDF', 'DOCX', 'TXT'],
    required: true
  },
  extractedText: {
    type: String
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Uploaded', 'Processing', 'Processed', 'Failed'],
    default: 'Uploaded'
  }
});

module.exports = mongoose.model('Resume', ResumeSchema);
