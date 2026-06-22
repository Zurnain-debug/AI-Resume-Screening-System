const express = require('express');
const { getResults, getRanking, getAnalytics, getResultById, updateResult } = require('../controllers/resultController');
const { authMiddleware, roleMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['HR']), getResults);
router.get('/job/:jobId/ranking', authMiddleware, roleMiddleware(['HR']), getRanking);
router.get('/job/:jobId/analytics', authMiddleware, roleMiddleware(['HR']), getAnalytics);
router.get('/:id', authMiddleware, getResultById);
router.put('/:id', authMiddleware, roleMiddleware(['HR']), updateResult);

module.exports = router;
