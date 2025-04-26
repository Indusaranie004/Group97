import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleGenerateCashLog = () => {
    navigate("/FinancialLedger"); // Navigate to CashLog page
  };

  const handleGenerateAssetsLiabilities = () => {
    navigate("/AssetList"); // Navigate to Assets & Liabilities page
  };

  return (
    <div className="financial-dashboard">
      <h1>Financial Dashboard</h1>

      {/* Metabase Graph Section */}
      <div className="dashboard-graphs">
        <iframe
          width="100%"
          height="500px"
          frameBorder="0"
          allowFullScreen
          title="Financial Dashboard Graphs"
        ></iframe>
      </div>

      {/* Buttons for Reports */}
      <div className="report-buttons">
        <button onClick={handleGenerateCashLog}>Generate CashLog Report</button>
        <button onClick={handleGenerateAssetsLiabilities}>
          Generate Assets & Liabilities Report
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
