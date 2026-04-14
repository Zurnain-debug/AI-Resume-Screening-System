const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Result = require('../models/Result');
const { extractText } = require('../middleware/textExtractor');
const axios = require('axios');
const path = require('path');

const uploadResume = async (req, res) => {
  try {
    const { jobId } = req.body;

    if (!jobId) {
      return res.status(400).json({ error: 'Job ID is required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const fileType = path.extname(req.file.originalname).substring(1).toUpperCase();

    const resume = await Resume.create({
      candidateId: req.user.id,
      jobId,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: fileType,
      status: 'Uploaded'
    });

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const processResume = async (req, res) => {
  try {
    const { resumeId } = req.body;

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    // Update status to processing
    resume.status = 'Processing';
    await resume.save();

    // Extract text from resume
    const extractedText = await extractText(resume.filePath, resume.fileType);
    resume.extractedText = extractedText;

    // Get job description
    const job = await Job.findById(resume.jobId);

    // Send to Python AI module for analysis
    try {
      const response = await axios.post(process.env.PYTHON_API_URL + '/analyze', {
        resumeText: extractedText,
        jobDescription: job.description,
        requiredSkills: job.requiredSkills
      });

      const { similarityScore, matchedSkills, missingSkills, percentageMatch } = response.data;

      // Create result
      const result = await Result.create({
        resumeId,
        jobId: resume.jobId,
        candidateId: resume.candidateId,
        similarityScore,
        percentageMatch,
        matchedSkills,
        missingSkills,
        feedback: `Match Score: ${percentageMatch}%. Key skills matched: ${matchedSkills.map(s => s.skill).join(', ')}`
      });

      resume.status = 'Processed';
      resume.processedAt = new Date();
      await resume.save();

      res.json({
        message: 'Resume processed successfully',
        result
      });
    } catch (error) {
      resume.status = 'Failed';
      await resume.save();
      throw new Error('AI analysis failed: ' + error.message);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResumes = async (req, res) => {
  try {
    const { jobId } = req.query;
    const filter = jobId ? { jobId } : { candidateId: req.user.id };

    const resumes = await Resume.find(filter)
      .populate('candidateId', 'name email')
      .populate('jobId', 'title');

    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id)
      .populate('candidateId', 'name email')
      .populate('jobId', 'title description');

    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }

    res.json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { uploadResume, processResume, getResumes, getResumeById };
