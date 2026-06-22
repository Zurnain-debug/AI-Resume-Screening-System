const { SAMPLE_RESUMES } = require('../data/sampleResumes');

const getSampleResumes = async (req, res) => {
  try {
    const sampleList = Object.keys(SAMPLE_RESUMES).map(key => ({
      id: key,
      name: SAMPLE_RESUMES[key].name,
      role: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: SAMPLE_RESUMES[key].email
    }));

    res.json({
      message: 'Sample resumes available for testing and reference',
      samples: sampleList
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const downloadSampleResume = async (req, res) => {
  try {
    const { type } = req.params;
    const resume = SAMPLE_RESUMES[type];

    if (!resume) {
      return res.status(404).json({
        error: 'Sample resume not found',
        available: Object.keys(SAMPLE_RESUMES)
      });
    }

    res.json({
      success: true,
      resume: {
        name: resume.name,
        email: resume.email,
        phone: resume.phone,
        content: resume.content,
        type: type
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getSampleResumes, downloadSampleResume };
