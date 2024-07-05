import React from 'react';
import './dashboard.css';

const Dashboard: React.FC = () => {
  const lookerStudioUrl = "https://lookerstudio.google.com/embed/reporting/64390ee9-4cf1-47b9-bf48-018932695501/page/4Fk3D";
  return (
    <div style={{ height: '100%' }}>
      <iframe
        title="Looker Studio Report"
        src={lookerStudioUrl}
        className="looker-studio-iframe"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Dashboard;
