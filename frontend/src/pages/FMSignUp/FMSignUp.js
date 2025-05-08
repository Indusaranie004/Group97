import React from "react";
import axios from "axios";
import "./FMSignUp.css";
import validateSignupForm from "./Validation";

const FMSignUp = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formErrors, setFormErrors] = React.useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Clear specific field error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Use the validation function
    const { isValid, errors } = validateSignupForm(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.post("http://localhost:5001/FinMngSignUp/Insert", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      
      // Redirect directly to login page without showing success message
      window.location.href = '/FMLogin';
      
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="signup-form-container" style={{background: 'rgba(255, 255, 255, 0.85)', border: 'none'}}>
      <h2>Create Your Account.</h2>
      <h4>Register as financial manager.</h4>

      <form onSubmit={handleSubmit} className="signup-form">
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
          />
          {formErrors.name && <div className="field-error">{formErrors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {formErrors.email && <div className="field-error">{formErrors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />
          {formErrors.password && <div className="field-error">{formErrors.password}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
          />
          {formErrors.confirmPassword && <div className="field-error">{formErrors.confirmPassword}</div>}
        </div>
        
        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        <p className="login-link">
          Already have an account? <a href="/FMLogin">Log in</a>
        </p>
      </form>
    </div>
  );
};

export default FMSignUp;