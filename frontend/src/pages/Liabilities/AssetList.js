import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './Liabilities.css';

const AssetsURL = "http://localhost:5001/Assets";  // Update the URL if needed

const Liabilities = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Assets from the backend
    axios.get(AssetsURL)
      .then((response) => {
        console.log("Fetched Assets:", response.data);
        setAssets(response.data.AssetEntries); // Set assets data in state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching assets:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Gym Assets Report", 14, 16);

    doc.autoTable({
      head: [['Asset Name', 'Asset Type', 'Quantity', 'Purchase Date', 'Condition', 'Estimated Value']],
      body: assets.map(asset => [
        asset.AssetName,
        asset.AssetType,
        asset.Quantity,
        new Date(asset.PurchaseDate).toLocaleDateString(),
        asset.Condition,
        `$${asset.EstimatedValue}`
      ]),
      startY: 30,
    });

    doc.save('gym_assets_report.pdf');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="assets-container">
      <h2>Available Gym Assets</h2>

      {assets.length > 0 ? (
        <>
          <table className="assets-table">
            <thead>
              <tr>
                <th>Asset Name</th>
                <th>Asset Type</th>
                <th>Quantity</th>
                <th>Purchase Date</th>
                <th>Condition</th>
                <th>Estimated Value</th>
              </tr>
            </thead>
            <tbody>
              {assets.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.AssetName}</td>
                  <td>{asset.AssetType}</td>
                  <td>{asset.Quantity}</td>
                  <td>{new Date(asset.PurchaseDate).toLocaleDateString()}</td>
                  <td>{asset.Condition}</td>
                  <td>${asset.EstimatedValue}</td>
                </tr>
              ))}
            </tbody>
          </table><br></br>
          <button onClick={downloadPDF} className="download-pdf-button">Download Report as PDF</button>
        </>
      ) : (
        <p>No assets available</p>
      )}
    </div>
  );
};

export default Liabilities;