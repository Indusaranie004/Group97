import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Validation from "./Validation";

const FMLogIn = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    UserName: "",
    Password: ""
  });

  const [errors, setError] = useState({})

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    const validationErrors = Validation(formData);
    setError(validationErrors);
    
    // Only submit if there are no validation errors
    if (Object.keys(validationErrors).length === 0) {
      const response = await fetch("http://localhost:5001/FinMngSignIn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Set error messages specific to the field
        if (data.error.includes("UserName")) {
          setError({ UserName: data.error });
        } else if (data.error.includes("Password")) {
          setError({ Password: data.error });
        } else {
          setError({ UserName: data.error, Password: data.error });
        }
        alert(data.error || "Error");
      } else {
        alert(data.message || "Login successful.");
        navigate(`/FMProfile/${data.user._id}`); // Redirect to the profile page
      }
    }
  };

  return (
    <div className="fm-login">
      <h2>Financial Manager Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="username">User Name:</label>
          <input type="email" id="username" name="UserName" value={formData.UserName} onChange={handleChange} required />
          {errors.UserName && <p style={{ color: "red", fontSize: "12px" }}>{errors.UserName}</p>}
        </div>
        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="Password" value={formData.Password} onChange={handleChange} required />
          {errors.Password && <p style={{ color: "red", fontSize: "12px" }}>{errors.Password}</p>}
        </div>
        <button id="loginButton" type="submit">Login</button>
      </form>
    </div>
  );
};

export default FMLogIn;
