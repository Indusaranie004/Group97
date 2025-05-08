import React, { useState } from "react";
import axios from "axios";
import "./FMLogIn.css";
import validateLoginForm from "./Validation";
import validateForgotPasswordForm from "./ForgotPasswordValidation";

const FMLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleForgotEmailChange = (e) => {
    setForgotEmail(e.target.value);
    setForgotPasswordError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const { isValid, errors } = validateLoginForm(formData);
    
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await axios.post("http://localhost:5001/FinMngSignIn/login", {
        email: formData.email,
        password: formData.password
      });
      
      // Store user information in session or local storage
      sessionStorage.setItem('user', JSON.stringify(response.data.data.user));
      
      // Redirect to dashboard immediately without showing success message
      window.location.href = '/FinancialDashboard';
      
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    
    const { isValid, error } = validateForgotPasswordForm(forgotEmail);
    
    if (!isValid) {
      setForgotPasswordError(error);
      return;
    }
    
    try {
      setLoading(true);
      
      await axios.post("http://localhost:5001/FinMngSignIn/forgot-password", {
        email: forgotEmail
      });
      
      setForgotPasswordSuccess(true);
      
    } catch (err) {
      setForgotPasswordError(err.response?.data?.message || 'Error processing request. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-form-container">
      {!showForgotPassword ? (
        <>
          <h2>Sign in to Your Account.</h2>
          <h4>Sign in as financial manager.</h4>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
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
                placeholder="Enter your password"
              />
              {formErrors.password && <div className="field-error">{formErrors.password}</div>}
            </div>
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </button>
            
            <div className="form-links">
              <p className="forgot-link" onClick={() => setShowForgotPassword(true)}>
                Forgot your password?
              </p>
              <p className="signup-link">
                Don't have an account? <a href="/FMSignUp">Sign up</a>
              </p>
            </div>
          </form>
        </>
      ) : (
        <>
          <h2>Reset Your Password</h2>
          {forgotPasswordSuccess ? (
            <div className="success-message">
              <p>If an account with that email exists, we've sent password reset instructions.</p>
              <button 
                className="back-to-login" 
                onClick={() => setShowForgotPassword(false)}
              >
                Back to login
              </button>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="forgot-form">
              {forgotPasswordError && <div className="error-message">{forgotPasswordError}</div>}
              
              <div className="form-group">
                <label htmlFor="forgotEmail">Email Address</label>
                <input
                  type="email"
                  id="forgotEmail"
                  value={forgotEmail}
                  onChange={handleForgotEmailChange}
                  placeholder="Enter your email"
                />
              </div>
              
              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Processing...' : 'Reset Password'}
              </button>
              
              <p className="back-link" onClick={() => setShowForgotPassword(false)}>
                Back to login
              </p>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default FMLogin;