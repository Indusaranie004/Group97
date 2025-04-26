import { useState } from "react";
import "./CashLog.css";

export default function CashEntryForm() {

  const [formData, setFormData] = useState({

    date: "",
    amount: "",
    transactionType: "",
    category: "",
    description: "",
    recordedBy: "",

  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://LocalHost:5001/CashLog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert("CashLog Updated.");
    } else {
      alert("Error Updating CashLog.");
    }
  };

  return (
    <div className="form-container">
      <h2>Petty Cash Form</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="input-field" placeholder="Date" />
        <input type="number" name="amount" value={formData.amount} onChange={handleChange} className="input-field" placeholder="Amount" />

        <select name="transactionType" value={formData.transactionType} onChange={handleChange} className="input-field">
          <option value="">Select Transaction Type</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input type="text" name="category" value={formData.category} onChange={handleChange} className="input-field" placeholder="Category" />
        <textarea name="description" value={formData.description} onChange={handleChange} className="input-field" placeholder="Description"></textarea>
        <input type="text" name="recordedBy" value={formData.recordedBy} onChange={handleChange} className="input-field" placeholder="Recorded By" />

        <button type="submit" className="add-button">Add</button>
      </form>
    </div>
  );
}