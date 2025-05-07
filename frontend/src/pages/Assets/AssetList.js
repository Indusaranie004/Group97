import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AssetList.css';
import SearchBar from './SearchBar'; // Adjust the path as needed
import PDFGenerator from './PDFGenerator'; // Import PDF generator utility

const AssetsURL = "http://localhost:5001/Assets";  // Update the URL if needed

const AssetList = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssets();
  }, []);

  // Debug useEffect to examine asset structure
  useEffect(() => {
    if (assets.length > 0) console.log("First asset:", JSON.stringify(assets[0]));
  }, [assets]);

  const fetchAssets = () => {
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
  };

  const handleEdit = (assetId) => {
    // Navigate to edit page
    navigate(`/edit-asset/${assetId}`);
  };

  const handleDelete = (assetId) => {
    if (window.confirm("Are you sure you want to delete this asset?")) {
      console.log("Deleting asset with ID:", assetId);
      
      axios.delete(`${AssetsURL}/${assetId}`)
        .then(response => {
          console.log("Delete response:", response);
          alert("Asset deleted successfully");
          // Refresh the asset list after deletion
          fetchAssets();
        })
        .catch(error => {
          console.error("Error deleting asset:", error);
          alert(`Failed to delete asset. Error: ${error.message}`);
        });
    }
  };

  const downloadPDF = () => {
    const success = PDFGenerator.generateAssetsPDF(filteredAssets);
    if (!success) {
      alert("Failed to generate PDF. Please check console for details.");
    }
  };

  // Filter assets based on search term
  const filteredAssets = assets.filter(asset => 
    asset.AssetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.AssetType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.Condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="loading">Loading assets...</div>;

  return (
    <div className="assets-container">
      <h2>Available Gym Assets</h2>
      
      <div className="search-section">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={setSearchTerm} 
          placeholder="Search by name, type or condition..."
        />
      </div>

      {filteredAssets.length > 0 ? (
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <tr key={index}>
                  <td>{asset.AssetName}</td>
                  <td>{asset.AssetType}</td>
                  <td>{asset.Quantity}</td>
                  <td>{new Date(asset.PurchaseDate).toLocaleDateString()}</td>
                  <td>{asset.Condition}</td>
                  <td>${asset.EstimatedValue}</td>
                  <td className="action-buttons">
                    <button 
                      className="edit-button" 
                      onClick={() => handleEdit(asset._id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button" 
                      onClick={() => handleDelete(asset._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pdf-button-container">
            <button onClick={downloadPDF} className="download-pdf-button">Download Report as PDF</button>
          </div>
        </>
      ) : (
        <p>{searchTerm ? "No matching assets found" : "No assets available"}</p>
      )}
    </div>
  );
};

export default AssetList;