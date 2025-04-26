import { useState } from "react";

const AddGymAsset = () => {
  const [formData, setFormData] = useState({
    AssetName: "",
    AssetType: "",
    Quantity: "",
    PurchaseDate: "",
    Condition: "",
    EstimatedValue: "", // Updated field name to match backend
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Asset Data Submitted:", formData);

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
    } else {
      alert(data.error || "Error adding asset");
    }
  };

  return (
    <div className="asset-form-container">

      <form onSubmit={handleSubmit}>
        <label>Asset Name:</label>
        <input type="text" name="AssetName" value={formData.AssetName} onChange={handleChange} required />

        <label>Asset Type:</label>
        <input type="text" name="AssetType" value={formData.AssetType} onChange={handleChange} required />

        <label>Quantity:</label>
        <input type="number" name="Quantity" value={formData.Quantity} onChange={handleChange} required />

        <label>Purchase Date:</label>
        <input type="date" name="PurchaseDate" value={formData.PurchaseDate} onChange={handleChange} required />

        <label>Condition:</label>
        <select name="Condition" value={formData.Condition} onChange={handleChange} required>
          <option value="">Select Condition</option>
          <option value="New">New</option>
          <option value="Good">Good</option>
          <option value="Needs Repair">Needs Repair</option>
        </select>

        <label>Estimated Value:</label>
        <input 
          type="text" 
          name="EstimatedValue" 
          value={formData.EstimatedValue} 
          onChange={handleChange} 
          required
        />

        <button type="submit">Add Asset</button>
      </form>
    </div>
  );
};

export default AddGymAsset;
