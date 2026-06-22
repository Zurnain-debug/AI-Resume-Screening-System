const Result = require('../models/Result');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

const getResults = async (req, res) => {
  try {
    const { jobId } = req.query;

    let results;
    if (jobId) {
      results = await Result.find({ jobId })
        .populate('resumeId', 'fileName')
        .populate('candidateId', 'name email')
        .populate('jobId', 'title')
        .sort({ percentageMatch: -1 });
    } else {
      results = await Result.find()
        .populate('resumeId', 'fileName')
        .populate('candidateId', 'name email')
        .populate('jobId', 'title')
        .sort({ percentageMatch: -1 });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRanking = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const results = await Result.find({ jobId })
      .populate('candidateId', 'name email')
      .populate('resumeId', 'fileName')
      .sort({ percentageMatch: -1 });

    // Add ranking
    const rankingData = results.map((result, index) => ({
      rank: index + 1,
      ...result.toObject()
    }));

    res.json({
      job: {
        id: job._id,
        title: job.title,
        description: job.description
      },
      ranking: rankingData,
      totalApplicants: rankingData.length,
      averageScore: rankingData.length > 0
        ? (rankingData.reduce((sum, r) => sum + r.percentageMatch, 0) / rankingData.length).toFixed(2)
        : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { jobId } = req.params;

    const results = await Result.find({ jobId });

    if (results.length === 0) {
      return res.json({
        totalApplicants: 0,
        averageScore: 0,
        highMatches: 0,
        mediumMatches: 0,
        lowMatches: 0,
        topMatches: []
      });
    }

    const highMatches = results.filter(r => r.percentageMatch >= 70).length;
    const mediumMatches = results.filter(r => r.percentageMatch >= 40 && r.percentageMatch < 70).length;
    const lowMatches = results.filter(r => r.percentageMatch < 40).length;

    const averageScore = (results.reduce((sum, r) => sum + r.percentageMatch, 0) / results.length).toFixed(2);

    const topMatches = results.slice(0, 5).map(r => ({
      candidateName: r.candidateId?.name || 'Unknown',
      score: r.percentageMatch,
      matchedSkills: r.matchedSkills
    }));

    res.json({
      totalApplicants: results.length,
      averageScore,
      highMatches,
      mediumMatches,
      lowMatches,
      topMatches,
      distributionChart: {
        labels: ['70-100%', '40-70%', '<40%'],
        data: [highMatches, mediumMatches, lowMatches]
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('resumeId', 'fileName extractedText')
      .populate('candidateId', 'name email phone')
      .populate('jobId', 'title description requiredSkills');

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id);

    if (!result) {
      return res.status(404).json({ error: 'Result not found' });
    }

    const allowedFields = ['adminNotes', 'adminRating', 'candidateStatus', 'feedback', 'recommendedAction'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        result[field] = req.body[field];
      }
    });

    result.updatedAt = Date.now();
    await result.save();

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getResults, getRanking, getAnalytics, getResultById, updateResult };
