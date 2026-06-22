import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin, message } from 'antd';
import { authService } from './services/apiService';
import NavigationBar from './components/NavigationBar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HRDashboard from './pages/HRDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import JobManagementPage from './pages/JobManagementPage';
import CandidateRankingPage from './pages/CandidateRankingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SampleResumePage from './pages/SampleResumePage';
import './App.css';

const { Content } = Layout;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = authService.getToken();
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      authService.logout();
      message.error('Session expired');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    fetchUserProfile();
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return <Spin className="app-loader" />;
  }

  return (
    <Router>
      <Layout className="app-shell">
        <NavigationBar user={user} onLogout={handleLogout} />
        <Content className="app-content">
          <Routes>
            <Route path="/login" element={<LoginPage onSuccess={handleLogin} />} />
            <Route path="/register" element={<RegisterPage onSuccess={handleLogin} />} />
            <Route
              path="/hr-dashboard"
              element={isAuthenticated && user?.role === 'HR' ? <HRDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/candidate-dashboard"
              element={isAuthenticated && user?.role === 'Candidate' ? <CandidateDashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/job-management"
              element={isAuthenticated && user?.role === 'HR' ? <JobManagementPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/candidate-ranking"
              element={isAuthenticated && user?.role === 'HR' ? <CandidateRankingPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/analytics"
              element={isAuthenticated && user?.role === 'HR' ? <AnalyticsPage /> : <Navigate to="/login" />}
            />
            <Route
              path="/sample-resumes"
              element={<SampleResumePage />}
            />
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  user?.role === 'HR' ? <Navigate to="/hr-dashboard" /> : <Navigate to="/candidate-dashboard" />
                ) : (
                  <HomePage />
                )
              }
            />
          </Routes>
        </Content>
      </Layout>
    </Router>
  );
}

export default App;
