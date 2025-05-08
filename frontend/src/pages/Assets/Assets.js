import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { validateAssetForm } from "./assetFormValidation";
import "./Assets.css";

const AddGymAsset = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    AssetName: "",
    AssetType: "",
    Quantity: "",
    PurchaseDate: "",
    Condition: "",
    EstimatedValue: "",
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Clean up any existing body styles and set page-specific class
  useEffect(() => {
    // Add the class to the body element
    document.body.classList.add('assets-body');
    
    return () => {
      // Remove the class when component unmounts
      document.body.classList.remove('assets-body');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Asset Data Submitted:", formData);

    // Validate form before submission
    const validation = validateAssetForm(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    
    try {
      // Make API call to submit the data to backend
      const response = await fetch("http://localhost:5001/Assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Asset added successfully");
        // Redirect to Asset List page after successful submission
        navigate("/AssetList"); 
      } else {
        alert(data.error || "Error adding asset");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to connect to the server. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="asset-page-container">
      <div className="page-header">
        <div className="header-content">
          <h1>Add New Gym Asset</h1>
          <h2>Register equipment and track inventory</h2>
        </div>
      </div>
      
      <div className="asset-form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-column">
            <div className="form-group">
              <label>Asset Name:</label>
              <input 
                type="text" 
                name="AssetName" 
                value={formData.AssetName} 
                onChange={handleChange} 
                className={errors.AssetName ? "error" : ""}
                placeholder="Enter asset name"
                required 
              />
              {errors.AssetName && <div className="error-message">{errors.AssetName}</div>}
            </div>
            
            <div className="form-group">
              <label>Asset Type:</label>
              <select 
                name="AssetType" 
                value={formData.AssetType} 
                onChange={handleChange} 
                className={errors.AssetType ? "error" : ""}
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
              {errors.AssetType && <div className="error-message">{errors.AssetType}</div>}
            </div>

            <div className="form-group">
              <label>Quantity:</label>
              <input 
                type="text" 
                name="Quantity" 
                value={formData.Quantity} 
                onChange={handleChange} 
                className={errors.Quantity ? "error" : ""}
                placeholder="Enter quantity"
                required 
              />
              {errors.Quantity && <div className="error-message">{errors.Quantity}</div>}
            </div>
            
            <div className="form-group">
              <label>Purchase Date:</label>
              <input 
                type="date" 
                name="PurchaseDate" 
                value={formData.PurchaseDate} 
                onChange={handleChange} 
                className={errors.PurchaseDate ? "error" : ""}
                required 
              />
              {errors.PurchaseDate && <div className="error-message">{errors.PurchaseDate}</div>}
            </div>

            <div className="form-group">
              <label>Condition:</label>
              <select 
                name="Condition" 
                value={formData.Condition} 
                onChange={handleChange} 
                className={errors.Condition ? "error" : ""}
                required
              >
                <option value="">Select Condition</option>
                <option value="New">New</option>
                <option value="Good">Good</option>
                <option value="Needs Repair">Needs Repair</option>
              </select>
              {errors.Condition && <div className="error-message">{errors.Condition}</div>}
            </div>
            
            <div className="form-group">
              <label>Estimated Value:</label>
              <input 
                type="text" 
                name="EstimatedValue" 
                value={formData.EstimatedValue} 
                onChange={handleChange} 
                className={errors.EstimatedValue ? "error" : ""}
                placeholder="Enter value"
                required
              />
              {errors.EstimatedValue && <div className="error-message">{errors.EstimatedValue}</div>}
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Asset"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGymAsset;