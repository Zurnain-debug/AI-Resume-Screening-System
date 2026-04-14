import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const authService = {
  register: (userData) => axios.post(`${API_URL}/auth/register`, userData),
  login: (credentials) => axios.post(`${API_URL}/auth/login`, credentials),
  logout: () => localStorage.removeItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  getToken: () => localStorage.getItem('token'),
  getProfile: () => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const jobService = {
  createJob: (jobData) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/jobs`, jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getJobs: () => axios.get(`${API_URL}/jobs`),
  getJobById: (id) => axios.get(`${API_URL}/jobs/${id}`),
  updateJob: (id, jobData) => {
    const token = localStorage.getItem('token');
    return axios.put(`${API_URL}/jobs/${id}`, jobData, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  deleteJob: (id) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/jobs/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const resumeService = {
  uploadResume: (resumeFile, jobId) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobId', jobId);
    
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/resumes/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });
  },
  processResume: (resumeId) => {
    const token = localStorage.getItem('token');
    return axios.post(`${API_URL}/resumes/process`, { resumeId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getResumes: (jobId = null) => {
    const token = localStorage.getItem('token');
    const params = jobId ? { jobId } : {};
    return axios.get(`${API_URL}/resumes`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getResumeById: (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/resumes/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

const resultService = {
  getResults: (jobId = null) => {
    const token = localStorage.getItem('token');
    const params = jobId ? { jobId } : {};
    return axios.get(`${API_URL}/results`, {
      params,
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getRanking: (jobId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/results/job/${jobId}/ranking`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getAnalytics: (jobId) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/results/job/${jobId}/analytics`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
  getResultById: (id) => {
    const token = localStorage.getItem('token');
    return axios.get(`${API_URL}/results/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};

export { authService, jobService, resumeService, resultService };
