import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './HRManagerLogin.css';

function HRManagerLogin() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.username.trim()) newErrors.username = "Username is required";
    if (!user.password) newErrors.password = "Password is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axios.post("http://localhost:5000/login", {
        username: user.username,
        password: user.password
      });
      
      if (response.data.status === "ok") {
        alert("Login successful!");
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigate("/hr-profile");
      } else {
        alert(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h1>HR Manager Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            name="username"
            value={user.username} 
            onChange={handleInputChange}
            className={errors.username ? 'error-input' : ''}
          />
          {errors.username && <span className="error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            name="password"
            value={user.password} 
            onChange={handleInputChange}
            className={errors.password ? 'error-input' : ''}
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default HRManagerLogin;