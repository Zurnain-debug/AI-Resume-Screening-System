const express = require('express');
const request = require('supertest');
const jobRoutes = require('../src/routes/jobRoutes');

jest.mock('../src/models/Job', () => ({
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

jest.mock('../src/middleware/authMiddleware', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: 'user123', role: 'HR' };
    next();
  },
  roleMiddleware: () => (req, res, next) => next()
}));

const Job = require('../src/models/Job');

const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes);

beforeEach(() => {
  jest.clearAllMocks();
  Job.find.mockResolvedValue([]);
  Job.create.mockResolvedValue(null);
  Job.findById.mockResolvedValue(null);
  Job.findByIdAndUpdate.mockResolvedValue(null);
  Job.findByIdAndDelete.mockResolvedValue(null);
});

describe('Job Controller', () => {
  describe('POST /api/jobs - createJob', () => {
    it('should create a new job successfully', async () => {
      const jobData = {
        title: 'Software Engineer',
        description: 'Develop web applications',
        requiredSkills: ['JavaScript', 'React', 'Node.js'],
        experienceLevel: 'Mid'
      };

      const mockCreatedJob = {
        _id: 'job123',
        ...jobData,
        status: 'Open',
        createdBy: 'user123'
      };
      Job.create.mockResolvedValue(mockCreatedJob);

      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer valid-token')
        .send(jobData)
        .expect(201);

      expect(Job.create).toHaveBeenCalledWith(expect.objectContaining({
        ...jobData,
        createdBy: 'user123'
      }));
      expect(response.body.message).toBe('Job created successfully');
      expect(response.body.job).toEqual(mockCreatedJob);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/jobs')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Software Engineer' })
        .expect(400);

      expect(response.body.error).toMatch(/Title and description are required/);
    });
  });

  describe('GET /api/jobs - getJobs', () => {
    it('should return all jobs', async () => {
      const jobs = [
        { _id: 'job1', title: 'Frontend Developer', requiredSkills: ['React', 'JavaScript'] },
        { _id: 'job2', title: 'Backend Developer', requiredSkills: ['Node.js', 'MongoDB'] }
      ];
      Job.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(jobs)
      });

      const response = await request(app)
        .get('/api/jobs')
        .expect(200);

      expect(Job.find).toHaveBeenCalledWith({});
      expect(response.body).toEqual(jobs);
    });
  });

  describe('PUT /api/jobs/:id - updateJob', () => {
    it('should update job successfully', async () => {
      const existingJob = { _id: 'job123', createdBy: 'user123', title: 'Original Job' };
      const updatedJob = { _id: 'job123', createdBy: 'user123', title: 'Updated Job Title' };
      Job.findById.mockResolvedValue(existingJob);
      Job.findByIdAndUpdate.mockResolvedValue(updatedJob);

      const response = await request(app)
        .put('/api/jobs/job123')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Updated Job Title' })
        .expect(200);

      expect(Job.findById).toHaveBeenCalledWith('job123');
      expect(Job.findByIdAndUpdate).toHaveBeenCalledWith('job123', { title: 'Updated Job Title' }, { new: true });
      expect(response.body.job).toEqual(updatedJob);
    });

    it('should return 404 for non-existent job', async () => {
      Job.findById.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/jobs/nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .send({ title: 'Updated Title' })
        .expect(404);

      expect(response.body.error).toMatch(/Job not found/);
    });
  });

  describe('DELETE /api/jobs/:id - deleteJob', () => {
    it('should delete job successfully', async () => {
      const existingJob = { _id: 'job123', createdBy: 'user123' };
      Job.findById.mockResolvedValue(existingJob);
      Job.findByIdAndDelete.mockResolvedValue(existingJob);

      const response = await request(app)
        .delete('/api/jobs/job123')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(Job.findById).toHaveBeenCalledWith('job123');
      expect(Job.findByIdAndDelete).toHaveBeenCalledWith('job123');
      expect(response.body.message).toBe('Job deleted successfully');
    });

    it('should return 404 for non-existent job', async () => {
      Job.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/jobs/nonexistent')
        .set('Authorization', 'Bearer valid-token')
        .expect(404);

      expect(response.body.error).toMatch(/Job not found/);
    });
  });
});