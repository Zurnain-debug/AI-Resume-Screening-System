import React from 'react';

const GlassCard = ({ title, description, icon, children }) => {
  return (
    <div className="glass-card">
      <div className="glass-card-header">
        <div className="glass-card-icon">{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children && <div className="glass-card-body">{children}</div>}
    </div>
  );
};

export default GlassCard;
