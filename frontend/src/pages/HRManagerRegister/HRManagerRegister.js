import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import './HRManagerRegister.css';

function HRManagerRegister() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    phone: '',
    confirmPassword: '',
    role: 'Staff',
    joinDate: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!user.fullname.trim()) {
      newErrors.fullname = "Full name is required";
    } else if (user.fullname.includes('@')) {
      newErrors.fullname = "Name cannot contain '@' symbol";
    }
    if (!user.email.trim()) newErrors.email = "Email is required";
    else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(user.email)) 
      newErrors.email = "Invalid email format";
    if (!user.username.trim()) newErrors.username = "Username is required";
    if (!user.password) newErrors.password = "Password is required";
    else if (user.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (user.password !== user.confirmPassword) 
      newErrors.confirmPassword = "Passwords do not match";
    if (!user.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(user.phone)) newErrors.phone = "Invalid phone number (10 digits required)";
    if (!user.role) newErrors.role = "Role is required";

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
      const response = await axios.post("http://localhost:5000/registers", {
        fullname: user.fullname,
        email: user.email,
        username: user.username,
        password: user.password,
        phone: user.phone,
        role: user.role,
        joinDate: user.joinDate
      });
      
      if (response.data.status === "ok") {
        alert("Registration successful!");
        navigate("/login");
      } else {
        alert(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.code === 11000) {
          const field = Object.keys(error.response.data.error.keyValue)[0];
          alert(`${field} already exists`);
        } else {
          alert(error.response.data.error);
        }
      } else {
        alert("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h1>HR Manager Registration</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input 
            type="text" 
            name="fullname"
            value={user.fullname} 
            onChange={handleInputChange}
            className={errors.fullname ? 'error-input' : ''}
            placeholder="Enter your full name"
          />
          {errors.fullname && <span className="error">{errors.fullname}</span>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            name="email"
            value={user.email} 
            onChange={handleInputChange}
            className={errors.email ? 'error-input' : ''}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Username</label>
          <input 
            type="text" 
            name="username"
            value={user.username} 
            onChange={handleInputChange}
            className={errors.username ? 'error-input' : ''}
            placeholder="Choose a username"
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
            placeholder="Create password (min 6 characters)"
          />
          {errors.password && <span className="error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={user.confirmPassword} 
            onChange={handleInputChange}
            className={errors.confirmPassword ? 'error-input' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input 
            type="tel" 
            name="phone"
            value={user.phone} 
            onChange={handleInputChange}
            className={errors.phone ? 'error-input' : ''}
            placeholder="Enter 10-digit phone number"
          />
          {errors.phone && <span className="error">{errors.phone}</span>}
        </div>

        <div className="form-group">
          <label>Role</label>
          <select 
            name="role"
            value={user.role} 
            onChange={handleInputChange}
            className={errors.role ? 'error-input' : ''}
          >
            <option value="">Select a role</option>
            <option value="HR Manager">HR Manager</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
          {errors.role && <span className="error">{errors.role}</span>}
        </div>

        <div className="form-group">
          <label>Join Date</label>
          <input 
            type="date" 
            name="joinDate"
            value={user.joinDate} 
            onChange={handleInputChange}
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="register-btn">
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>

        <div className="login-redirect">
          Already have an account? <Link to="/login" className="login-link">Login here</Link>
        </div>
      </form>
    </div>
  );
}

export default HRManagerRegister;