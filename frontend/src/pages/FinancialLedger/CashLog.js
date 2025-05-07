import { useState } from "react";
import "./CashLog.css";
import { validateField, validateCashEntry } from "./CashLogValidation";

export default function CashEntryForm() {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    transactionType: "",
    category: "",
    description: "",
    recordedBy: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors({ ...errors, [name]: error });
    } else {
      // Remove error if field is now valid
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Validate all fields
    const validation = validateCashEntry(formData);
    
    if (!validation.isValid) {
      setErrors(validation.errors);
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("http://LocalHost:5001/CashLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("CashLog Updated Successfully.");
        // Reset form after successful submission
        setFormData({
          date: "",
          amount: "",
          transactionType: "",
          category: "",
          description: "",
          recordedBy: "",
        });
        setErrors({});
      } else {
        const errorData = await response.json().catch(() => null);
        alert(`Error Updating CashLog: ${errorData?.message || response.statusText || "Unknown error"}`);
      }
    } catch (error) {
      alert(`Network Error: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cash-page-container">
      <div className="cash-form-wrapper">
        <div className="form-title">
          <h1>Record Cash Transaction</h1>
          <h2>Track income and expenses</h2>
        </div>
        
        <div className="cash-form-container">
          <form onSubmit={handleSubmit} className="cash-form">
            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.date ? "error" : ""}
                placeholder="mm/dd/yyyy"
              />
              {errors.date && <span className="error-message">{errors.date}</span>}
            </div>

            <div className="input-group">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.amount ? "error" : ""}
                placeholder="Enter amount"
                step="0.01"
              />
              {errors.amount && <span className="error-message">{errors.amount}</span>}
            </div>

            <div className="input-group">
              <label>Transaction Type</label>
              <select
                name="transactionType"
                value={formData.transactionType}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.transactionType ? "error" : ""}
              >
                <option value="">Select Transaction Type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              {errors.transactionType && <span className="error-message">{errors.transactionType}</span>}
            </div>

            <div className="input-group">
              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.category ? "error" : ""}
                placeholder="Enter category"
              />
              {errors.category && <span className="error-message">{errors.category}</span>}
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.description ? "error" : ""}
                placeholder="Enter description"
              ></textarea>
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="input-group">
              <label>Recorded By</label>
              <input
                type="text"
                name="recordedBy"
                value={formData.recordedBy}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.recordedBy ? "error" : ""}
                placeholder="Enter your name"
              />
              {errors.recordedBy && <span className="error-message">{errors.recordedBy}</span>}
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? "Processing..." : "Record Transaction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}