const Resume = require('../models/Resume');
const Job = require('../models/Job');
const Result = require('../models/Result');
const { extractText } = require('../middleware/textExtractor');
const axios = require('axios');
const path = require('path');

const mapExperienceLevelToYears = (experienceLevel) => {
  if (!experienceLevel) return 0;
  const value = String(experienceLevel).toLowerCase();
  switch (value) {
    case 'entry':
      return 1;
    case 'mid':
      return 3;
    case 'senior':
      return 5;
    default:
      const numeric = Number(experienceLevel);
      return Number.isFinite(numeric) ? numeric : 0;
  }
};

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

    // Extract text immediately
    const extractedText = await extractText(req.file.path, fileType);

    const resume = await Resume.create({
      candidateId: req.user.id,
      jobId,
      filePath: req.file.path,
      fileName: req.file.originalname,
      fileType: fileType,
      extractedText: extractedText,
      status: 'Processing'
    });

    // Send to AI module for analysis asynchronously
    processResumeAsync(resume._id, extractedText, job).catch(err => {
      console.error('Background processing error:', err.message);
    });

    res.status(201).json({
      message: 'Resume uploaded and processing initiated',
      resume: {
        _id: resume._id,
        fileName: resume.fileName,
        status: resume.status
      }
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

    if (resume.status === 'Processed') {
      // Already processed, return existing result
      const result = await Result.findOne({ resumeId });
      return res.json({
        message: 'Resume already processed',
        result
      });
    }

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
        requiredSkills: job.requiredSkills,
        requiredExperience: mapExperienceLevelToYears(job.experienceLevel)
      });

      const {
        similarityScore, matchedSkills, missingSkills, percentageMatch,
        experienceYears, recommendedAction, matchBreakdown
      } = response.data;

      // Create result with enhanced data
      const result = await Result.create({
        resumeId,
        jobId: resume.jobId,
        candidateId: resume.candidateId,
        similarityScore,
        percentageMatch,
        matchedSkills,
        missingSkills,
        experienceYears,
        feedback: `Match Score: ${percentageMatch}%. ${recommendedAction}. Skills: ${matchedSkills.map(s => s.skill).join(', ')}`,
        matchBreakdown
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

// Helper function to process resume in background
const processResumeAsync = async (resumeId, extractedText, job) => {
  try {
    const resume = await Resume.findById(resumeId);
    if (!resume) return;

    const response = await axios.post(process.env.PYTHON_API_URL + '/analyze', {
      resumeText: extractedText,
      jobDescription: job.description,
      requiredSkills: job.requiredSkills,
      requiredExperience: mapExperienceLevelToYears(job.experienceLevel)
    });

    const {
      similarityScore, matchedSkills, missingSkills, percentageMatch,
      experienceYears, recommendedAction, matchBreakdown
    } = response.data;

    // Create result
    await Result.create({
      resumeId,
      jobId: job._id,
      candidateId: resume.candidateId,
      similarityScore,
      percentageMatch,
      matchedSkills,
      missingSkills,
      experienceYears,
      feedback: `Match Score: ${percentageMatch}%. ${recommendedAction}. Skills: ${matchedSkills.map(s => s.skill).join(', ')}`,
      matchBreakdown
    });

    // Update resume status
    resume.status = 'Processed';
    resume.processedAt = new Date();
    await resume.save();

    console.log(`Resume ${resumeId} processed successfully`);
  } catch (error) {
    console.error(`Error processing resume ${resumeId}:`, error.message);
    const resume = await Resume.findById(resumeId);
    if (resume) {
      resume.status = 'Failed';
      await resume.save();
    }
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
