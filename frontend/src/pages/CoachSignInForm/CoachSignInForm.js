import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CoachSignInForm.css';

const CoachSignInForm = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: localStorage.getItem('registeredEmail') || '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Clear stored email after component mounts
  useEffect(() => {
    return () => {
      localStorage.removeItem('registeredEmail');
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/coach/signin', {
        email: formData.email,
        password: formData.password
      });

      const { token, coach } = response.data;

      if (!token || !coach) {
        throw new Error('Invalid response from server');
      }

      // Store authentication data
      localStorage.setItem('coachToken', token);
      localStorage.setItem('coachName', coach.name);
      localStorage.setItem('coachEmail', coach.email);
      
      // Execute login callback if provided
      if (onLogin) onLogin();
      
      // Show success message and redirect
      alert('Sign-in successful! Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                         err.message || 
                         'Failed to sign in. Please try again.';
      setError(errorMessage);
      console.error('SignIn error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-form-container">
      <div className="signin-form">
        <h2>Coach Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="coach-email">Email:</label>
            <input
              id="coach-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="coach-password">Password:</label>
            <input
              id="coach-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="signup-link">
          Don't have an account? <a href="/coach/signup">Sign up here</a>
        </div>
      </div>
    </div>
  );
};

export default CoachSignInForm;