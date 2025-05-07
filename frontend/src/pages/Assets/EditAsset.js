import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditAsset.css';

const AssetsURL = "http://localhost:5001/Assets";

const EditAsset = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    AssetName: '',
    AssetType: '',
    Quantity: '',
    PurchaseDate: '',
    Condition: '',
    EstimatedValue: ''
  });

  useEffect(() => {
    // Fetch asset details when component mounts
    fetchAssetDetails();
  }, [id]);

  const fetchAssetDetails = async () => {
    try {
      const response = await axios.get(`${AssetsURL}/${id}`);
      const asset = response.data.asset;
      
      // Format date for input field (YYYY-MM-DD)
      const formattedDate = asset.PurchaseDate 
        ? new Date(asset.PurchaseDate).toISOString().split('T')[0]
        : '';
        
      setFormData({
        AssetName: asset.AssetName || '',
        AssetType: asset.AssetType || '',
        Quantity: asset.Quantity || '',
        PurchaseDate: formattedDate,
        Condition: asset.Condition || '',
        EstimatedValue: asset.EstimatedValue || ''
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching asset details:', error);
      setError('Failed to load asset details. Please try again.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.put(`${AssetsURL}/${id}`, formData);
      
      if (response.status === 200) {
        alert('Asset updated successfully!');
        navigate('/AssetList'); // Navigate back to asset list
      }
    } catch (error) {
      console.error('Error updating asset:', error);
      setError('Failed to update asset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/AssetList'); // Navigate back to asset list
  };

  if (loading) {
    return <div className="loading">Loading asset details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="edit-asset-container">
      <h2>Edit Asset</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asset Name</label>
          <input
            type="text"
            name="AssetName"
            value={formData.AssetName}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Asset Type</label>
          <select
            name="AssetType"
            value={formData.AssetType}
            onChange={handleChange}
            required
          >
            <option value="">Select Asset Type</option>
            <option value="Cardio Equipment">Cardio Equipment</option>
            <option value="Strength Machine">Strength Machine</option>
            <option value="Free Weight">Free Weight</option>
            <option value="Accessory">Accessory</option>
            <option value="Electronic">Electronic</option>
            <option value="Fitness Tracker">Fitness Tracker</option>
            <option value="Furniture">Furniture</option>
            <option value="Maintenance Equipment">Maintenance Equipment</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="text"
            name="Quantity"
            value={formData.Quantity}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Purchase Date</label>
          <input
            type="date"
            name="PurchaseDate"
            value={formData.PurchaseDate}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Condition</label>
          <select
            name="Condition"
            value={formData.Condition}
            onChange={handleChange}
            required
          >
            <option value="">Select Condition</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Used">Used</option>
            <option value="Needs Repair">Needs Repair</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Estimated Value</label>
          <input
            type="text"
            name="EstimatedValue"
            value={formData.EstimatedValue}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAsset;