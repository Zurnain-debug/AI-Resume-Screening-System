import React from 'react';

const HeroSection = () => {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="hero-section" id="home">
      <div className="hero-copy">
        <span className="eyebrow">AI Powered Recruitment</span>
        <h1>Smart AI Resume Screening System</h1>
        <p>Analyze, rank, and hire the best candidates with AI-driven insights, unmatched transparency, and effortless workflows.</p>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={scrollToUpload}>Upload Resume</button>
          <button className="btn btn-secondary">Post Job</button>
        </div>
      </div>
      <div className="hero-illustration">
        <div className="hero-card hero-card-1">
          <h4>Match Confidence</h4>
          <p>98% candidate compatibility through automatic screening.</p>
        </div>
        <div className="hero-card hero-card-2">
          <h4>Quick Insights</h4>
          <p>Visual candidate ranking and score breakdown in seconds.</p>
        </div>
        <div className="hero-hero-glow" />
      </div>
    </section>
  );
};

export default HeroSection;
