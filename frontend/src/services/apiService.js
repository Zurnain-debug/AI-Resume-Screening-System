import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json'
  }
});

const getToken = () => localStorage.getItem('token');

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  return config;
});

const getApiErrorMessage = (error, fallback = 'Request failed') => {
  if (error?.response) {
    const status = error.response.status;
    const dataMessage = error.response.data?.error || error.response.data?.message || JSON.stringify(error.response.data);
    return `${fallback} (${status}): ${dataMessage}`;
  }

  if (error?.request) {
    return `${fallback}: no response received from server`;
  }

  return `${fallback}: ${error?.message || 'Unknown error'}`;
};

const authService = {
  register: (userData) => axiosInstance.post('/auth/register', userData),
  login: (credentials) => axiosInstance.post('/auth/login', credentials),
  logout: () => localStorage.removeItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  getToken,
  getProfile: () => axiosInstance.get('/auth/profile')
};

const jobService = {
  createJob: (jobData) => axiosInstance.post('/jobs', jobData),
  getJobs: () => axiosInstance.get('/jobs'),
  getJobById: (id) => axiosInstance.get(`/jobs/${id}`),
  updateJob: (id, jobData) => axiosInstance.put(`/jobs/${id}`, jobData),
  deleteJob: (id) => axiosInstance.delete(`/jobs/${id}`)
};

const resumeService = {
  uploadResume: (resumeFile, jobId) => {
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobId', jobId);
    return axiosInstance.post('/resumes/upload', formData);
  },
  processResume: (resumeId) => axiosInstance.post('/resumes/process', { resumeId }),
  getResumes: (jobId = null) => axiosInstance.get('/resumes', { params: jobId ? { jobId } : {} }),
  getResumeById: (id) => axiosInstance.get(`/resumes/${id}`)
};

const resultService = {
  getResults: (jobId = null) => axiosInstance.get('/results', { params: jobId ? { jobId } : {} }),
  getRanking: (jobId) => axiosInstance.get(`/results/job/${jobId}/ranking`),
  getAnalytics: (jobId) => axiosInstance.get(`/results/job/${jobId}/analytics`),
  getResultById: (id) => axiosInstance.get(`/results/${id}`),
  updateResult: (id, resultData) => axiosInstance.put(`/results/${id}`, resultData)
};

const sampleResumeService = {
  listSamples: () => axiosInstance.get('/samples'),
  getSample: (type) => axiosInstance.get(`/samples/${type}`)
};

export { authService, jobService, resumeService, resultService, sampleResumeService, getApiErrorMessage };
