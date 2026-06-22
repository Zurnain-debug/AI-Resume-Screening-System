const express = require('express');
const request = require('supertest');
const resultRoutes = require('../src/routes/resultRoutes');

jest.mock('../src/models/Result', () => ({
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  insertMany: jest.fn()
}));

jest.mock('../src/models/Job', () => ({
  findById: jest.fn()
}));

jest.mock('../src/middleware/authMiddleware', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: 'user123', role: 'HR' };
    next();
  },
  roleMiddleware: () => (req, res, next) => next()
}));

const Result = require('../src/models/Result');
const Job = require('../src/models/Job');

const app = express();
app.use(express.json());
app.use('/api/results', resultRoutes);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('Result Controller', () => {
  describe('GET /api/results/job/:jobId/ranking - getRanking', () => {
    it('should return ranking data for a job', async () => {
      const testJob = { _id: 'job123', title: 'Software Engineer', description: 'Develop web applications' };
      const results = [
        { percentageMatch: 85, candidateId: { name: 'John', email: 'john@example.com' }, resumeId: {}, toObject() { return this; } },
        { percentageMatch: 65, candidateId: { name: 'Jane', email: 'jane@example.com' }, resumeId: {}, toObject() { return this; } },
        { percentageMatch: 35, candidateId: { name: 'Bob', email: 'bob@example.com' }, resumeId: {}, toObject() { return this; } }
      ];

      Job.findById.mockResolvedValue(testJob);
      Result.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(results)
      });

      const response = await request(app)
        .get('/api/results/job/job123/ranking')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(Job.findById).toHaveBeenCalledWith('job123');
      expect(response.body.job.title).toBe('Software Engineer');
      expect(response.body.totalApplicants).toBe(3);
      expect(response.body.averageScore).toBe('61.67');
      expect(response.body.ranking[0].rank).toBe(1);
      expect(response.body.ranking[1].rank).toBe(2);
      expect(response.body.ranking[2].rank).toBe(3);
    });

    it('should return 404 for non-existent job', async () => {
      Job.findById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/results/job/nonexistent/ranking')
        .set('Authorization', 'Bearer valid-token')
        .expect(404);

      expect(response.body.error).toMatch(/Job not found/);
    });
  });

  describe('GET /api/results/job/:jobId/analytics - getAnalytics', () => {
    it('should return analytics data for a job', async () => {
      const results = [
        { percentageMatch: 85, candidateId: { name: 'John' }, matchedSkills: [{ skill: 'JavaScript' }] },
        { percentageMatch: 65, candidateId: { name: 'Jane' }, matchedSkills: [{ skill: 'Node.js' }] },
        { percentageMatch: 35, candidateId: { name: 'Bob' }, matchedSkills: [{ skill: 'Python' }] }
      ];

      Result.find.mockResolvedValue(results);

      const response = await request(app)
        .get('/api/results/job/job123/analytics')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.totalApplicants).toBe(3);
      expect(response.body.averageScore).toBe('61.67');
      expect(response.body.highMatches).toBe(1);
      expect(response.body.mediumMatches).toBe(1);
      expect(response.body.lowMatches).toBe(1);
      expect(response.body.topMatches).toHaveLength(3);
      expect(response.body.distributionChart.data).toEqual([1, 1, 1]);
    });

    it('should return empty analytics for job with no results', async () => {
      Result.find.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/results/job/job123/analytics')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.totalApplicants).toBe(0);
      expect(response.body.averageScore).toBe(0);
      expect(response.body.highMatches).toBe(0);
      expect(response.body.mediumMatches).toBe(0);
      expect(response.body.lowMatches).toBe(0);
      expect(response.body.topMatches).toEqual([]);
    });

    it('should return top 5 matches when more than 5 results exist', async () => {
      const results = [
        { percentageMatch: 95, candidateId: { name: 'A' }, matchedSkills: [{ skill: 'JavaScript' }] },
        { percentageMatch: 90, candidateId: { name: 'B' }, matchedSkills: [{ skill: 'React' }] },
        { percentageMatch: 85, candidateId: { name: 'C' }, matchedSkills: [{ skill: 'Node.js' }] },
        { percentageMatch: 80, candidateId: { name: 'D' }, matchedSkills: [{ skill: 'MongoDB' }] },
        { percentageMatch: 75, candidateId: { name: 'E' }, matchedSkills: [{ skill: 'Python' }] },
        { percentageMatch: 70, candidateId: { name: 'F' }, matchedSkills: [{ skill: 'Docker' }] }
      ];

      Result.find.mockResolvedValue(results);

      const response = await request(app)
        .get('/api/results/job/job123/analytics')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.totalApplicants).toBe(6);
      expect(response.body.topMatches).toHaveLength(5);
      expect(response.body.topMatches[0].score).toBe(95);
      expect(response.body.topMatches[4].score).toBe(75);
    });
  });

  describe('GET /api/results - getResults', () => {
    it('should return all results when no jobId specified', async () => {
      const results = [
        { percentageMatch: 85 },
        { percentageMatch: 65 },
        { percentageMatch: 35 }
      ];

      Result.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(results)
      });

      const response = await request(app)
        .get('/api/results')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual(results);
    });

    it('should return results filtered by jobId', async () => {
      const filteredResults = [
        { jobId: { _id: 'job123' }, percentageMatch: 85 }
      ];

      Result.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(filteredResults)
      });

      const response = await request(app)
        .get('/api/results?jobId=job123')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body).toEqual(filteredResults);
    });
  });
});