const express = require('express');
const { getSampleResumes, downloadSampleResume } = require('../controllers/sampleResumeController');

const router = express.Router();

router.get('/', getSampleResumes);
router.get('/:type', downloadSampleResume);

module.exports = router;
