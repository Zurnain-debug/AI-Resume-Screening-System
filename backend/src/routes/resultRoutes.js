const express = require('express');
const { getResults, getRanking, getAnalytics, getResultById } = require('../controllers/resultController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['HR']), getResults);
router.get('/job/:jobId/ranking', authMiddleware, roleMiddleware(['HR']), getRanking);
router.get('/job/:jobId/analytics', authMiddleware, roleMiddleware(['HR']), getAnalytics);
router.get('/:id', authMiddleware, getResultById);

module.exports = router;
