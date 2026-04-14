const express = require('express');
const { uploadResume, processResume, getResumes, getResumeById } = require('../controllers/resumeController');
const { authMiddleware } = require('../middleware/authMiddleware');
const uploadResume_middleware = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/upload', authMiddleware, uploadResume_middleware.single('resume'), uploadResume);
router.post('/process', authMiddleware, processResume);
router.get('/', authMiddleware, getResumes);
router.get('/:id', authMiddleware, getResumeById);

module.exports = router;
