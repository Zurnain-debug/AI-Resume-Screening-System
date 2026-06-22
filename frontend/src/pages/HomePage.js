import React from 'react';
import HeroSection from '../components/HeroSection';
import FeatureCards from '../components/FeatureCards';
import UploadSection from '../components/UploadSection';
import DashboardPreview from '../components/DashboardPreview';

const HomePage = () => {
  return (
    <main className="home-page">
      <HeroSection />
      <FeatureCards />
      <UploadSection />
      <DashboardPreview />
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <h3>AI Resume Analyzer</h3>
            <p>Automated candidate screening, ranking, and hiring intelligence in one elegant platform.</p>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#upload">Upload</a>
            <a href="#dashboard">Dashboard</a>
          </div>
        </div>
        <p className="footer-copy">© 2026 AI Resume Analyzer. All rights reserved.</p>
      </footer>
    </main>
  );
};

export default HomePage;
