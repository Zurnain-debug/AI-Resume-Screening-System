import React from 'react';
import GlassCard from './GlassCard';

const features = [
  {
    title: 'AI Screening',
    description: 'Automated resume parsing and candidate scoring for fast hiring decisions.',
    icon: '🤖',
  },
  {
    title: 'Resume Ranking',
    description: 'Smart candidate ranking based on skills, experience, and fit.',
    icon: '📊',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Track hiring performance with real-time analytics and charts.',
    icon: '📈',
  },
  {
    title: 'Smart Hiring',
    description: 'Reduce bias and scale your recruiting with better candidate matches.',
    icon: '⚡',
  },
];

const FeatureCards = () => {
  return (
    <section className="section feature-section" id="features">
      <div className="section-heading">
        <span>Core Capabilities</span>
        <h2>Built for modern talent teams</h2>
        <p>Everything your hiring workflow needs: from application intake to intelligent candidate evaluation.</p>
      </div>
      <div className="feature-grid">
        {features.map((item) => (
          <GlassCard key={item.title} icon={item.icon} title={item.title} description={item.description} />
        ))}
      </div>
    </section>
  );
};

export default FeatureCards;
