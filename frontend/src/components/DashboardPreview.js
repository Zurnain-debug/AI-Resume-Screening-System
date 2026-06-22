import React from 'react';
import GlassCard from './GlassCard';

const candidateList = [
  { name: 'Alexa Richards', score: 95, role: 'Product Manager' },
  { name: 'Jordan Lee', score: 88, role: 'Data Scientist' },
  { name: 'Mia Patel', score: 82, role: 'Software Engineer' },
];

const dashboardMetrics = [
  { label: 'Match Rate', value: 92 },
  { label: 'Screened Resumes', value: 420 },
  { label: 'Top Candidates', value: 28 },
];

const DashboardPreview = () => {
  return (
    <section className="section dashboard-preview" id="dashboard">
      <div className="section-heading">
        <span>Live insights</span>
        <h2>Premium candidate analytics at a glance</h2>
        <p>Evaluate candidate funnels, hiring velocity, and match quality with a polished dashboard experience.</p>
      </div>

      <div className="dashboard-grid">
        {dashboardMetrics.map((metric) => (
          <div key={metric.label} className="metric-card glass-card">
            <span>{metric.label}</span>
            <h3>{metric.value}%</h3>
          </div>
        ))}
      </div>

      <div className="candidate-grid">
        {candidateList.map((candidate) => (
          <GlassCard
            key={candidate.name}
            title={candidate.name}
            description={candidate.role}
            icon="⭐"
          >
            <div className="progress-row">
              <span>Match Score</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${candidate.score}%` }} />
              </div>
              <strong>{candidate.score}%</strong>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
};

export default DashboardPreview;
