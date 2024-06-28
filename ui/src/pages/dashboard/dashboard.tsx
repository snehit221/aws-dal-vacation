
const Dashboard = () => {
  const lookerStudioUrl = "https://lookerstudio.google.com/embed/reporting/64390ee9-4cf1-47b9-bf48-018932695501/page/4Fk3D";

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        title="Looker Studio Report"
        src={lookerStudioUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default Dashboard;
