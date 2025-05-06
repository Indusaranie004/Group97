import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CoachSignUpForm.css';

const CoachSignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers and special characters in name field
    if (name === 'name' && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (fieldName, value) => {
    let errorMsg = '';

    if (fieldName === 'name') {
      errorMsg = value.length < 3 ? 'Name must be at least 3 letters' : '';
    } else if (fieldName === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      errorMsg = !emailPattern.test(value) ? 'Enter a valid email address' : '';
    } else if (fieldName === 'password') {
      errorMsg = value.length < 6 ? 'Password must be at least 6 characters' : '';
    }

    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: errorMsg }));
  };

  const isFormValid = () => {
    return (
      !errors.name &&
      !errors.email &&
      !errors.password &&
      formData.name &&
      formData.email &&
      formData.password
    );
  };

  const registerCoach = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!isFormValid()) {
      setApiError('Please fix validation errors before submitting');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/coach/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        localStorage.setItem('registeredEmail', formData.email);
        alert('Registration successful! Please sign in.');
        navigate('/coach/signin');
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-form-container">
      <div className="signup-form">
        <h2>Coach Sign Up</h2>
        {apiError && <div className="error-message">{apiError}</div>}
        
        <form onSubmit={registerCoach}>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
          >
            {isSubmitting ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <div className="login-link">
          Already have an account? <a href="/coach/signin">Sign in here</a>
        </div>
      </div>
    </div>
  );
};

export default CoachSignUpForm;