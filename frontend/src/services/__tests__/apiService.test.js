import axios from 'axios';
import { jobService, resultService } from '../apiService';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('API Services', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'mock-token'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    });
  });

  describe('jobService', () => {
    describe('createJob', () => {
      it('should make POST request to create job with correct data and auth header', async () => {
        const jobData = {
          title: 'Software Engineer',
          description: 'Develop web apps',
          requiredSkills: ['JavaScript', 'React']
        };
        const mockResponse = { data: { _id: 'job123', ...jobData } };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await jobService.createJob(jobData);

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/jobs',
          jobData,
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('should handle API errors', async () => {
        const error = new Error('API Error');
        mockedAxios.post.mockRejectedValue(error);

        await expect(jobService.createJob({})).rejects.toThrow('API Error');
      });
    });

    describe('getJobs', () => {
      it('should make GET request to fetch all jobs', async () => {
        const mockResponse = {
          data: [
            { _id: 'job1', title: 'Job 1' },
            { _id: 'job2', title: 'Job 2' }
          ]
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await jobService.getJobs();

        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/jobs');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getJobById', () => {
      it('should make GET request to fetch job by ID', async () => {
        const mockResponse = { data: { _id: 'job123', title: 'Software Engineer' } };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await jobService.getJobById('job123');

        expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:5000/api/jobs/job123');
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateJob', () => {
      it('should make PUT request to update job with correct data and auth header', async () => {
        const jobData = { title: 'Updated Title' };
        const mockResponse = { data: { _id: 'job123', ...jobData } };

        mockedAxios.put.mockResolvedValue(mockResponse);

        const result = await jobService.updateJob('job123', jobData);

        expect(mockedAxios.put).toHaveBeenCalledWith(
          'http://localhost:5000/api/jobs/job123',
          jobData,
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('deleteJob', () => {
      it('should make DELETE request to delete job with auth header', async () => {
        const mockResponse = { data: { message: 'Job deleted' } };

        mockedAxios.delete.mockResolvedValue(mockResponse);

        const result = await jobService.deleteJob('job123');

        expect(mockedAxios.delete).toHaveBeenCalledWith(
          'http://localhost:5000/api/jobs/job123',
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('resultService', () => {
    describe('getResults', () => {
      it('should make GET request to fetch all results with auth header', async () => {
        const mockResponse = {
          data: [
            { _id: 'result1', percentageMatch: 85 },
            { _id: 'result2', percentageMatch: 75 }
          ]
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await resultService.getResults();

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/results',
          {
            params: {},
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });

      it('should include jobId in query params when provided', async () => {
        const mockResponse = { data: [] };

        mockedAxios.get.mockResolvedValue(mockResponse);

        await resultService.getResults('job123');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/results',
          {
            params: { jobId: 'job123' },
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
      });
    });

    describe('getRanking', () => {
      it('should make GET request to fetch ranking for specific job', async () => {
        const mockResponse = {
          data: {
            job: { title: 'Software Engineer' },
            ranking: [],
            totalApplicants: 0,
            averageScore: 0
          }
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await resultService.getRanking('job123');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/results/job/job123/ranking',
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getAnalytics', () => {
      it('should make GET request to fetch analytics for specific job', async () => {
        const mockResponse = {
          data: {
            totalApplicants: 10,
            averageScore: 75,
            highMatches: 5,
            mediumMatches: 3,
            lowMatches: 2
          }
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await resultService.getAnalytics('job123');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/results/job/job123/analytics',
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getResultById', () => {
      it('should make GET request to fetch specific result by ID', async () => {
        const mockResponse = {
          data: {
            _id: 'result123',
            percentageMatch: 85,
            jobId: { title: 'Software Engineer' }
          }
        };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await resultService.getResultById('result123');

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/results/result123',
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('authService', () => {
    describe('login', () => {
      it('should make POST request to login endpoint', async () => {
        const credentials = { email: 'test@example.com', password: 'password' };
        const mockResponse = { data: { token: 'jwt-token' } };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await require('../apiService').authService.login(credentials);

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/login',
          credentials
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('register', () => {
      it('should make POST request to register endpoint', async () => {
        const userData = { username: 'testuser', email: 'test@example.com', password: 'password' };
        const mockResponse = { data: { message: 'User registered' } };

        mockedAxios.post.mockResolvedValue(mockResponse);

        const result = await require('../apiService').authService.register(userData);

        expect(mockedAxios.post).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/register',
          userData
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe('getProfile', () => {
      it('should make GET request to profile endpoint with auth header', async () => {
        const mockResponse = { data: { username: 'testuser', email: 'test@example.com' } };

        mockedAxios.get.mockResolvedValue(mockResponse);

        const result = await require('../apiService').authService.getProfile();

        expect(mockedAxios.get).toHaveBeenCalledWith(
          'http://localhost:5000/api/auth/profile',
          {
            headers: { Authorization: 'Bearer mock-token' }
          }
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });
});