import React, { useState } from 'react';
import './SignUpForm.css'; // Import the CSS file

const SignUp = () => {
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

  const { name, email, password } = formData;

  // Handles input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent numbers and special characters in the name field
    if (name === 'name' && !/^[A-Za-z\s]*$/.test(value)) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  // Validate input fields
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

  // Function to check if the form is valid
  const isFormValid = () => {
    return !errors.name && !errors.email && !errors.password && name && email && password;
  };

  // Function to register coach
  const registerCoach = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!isFormValid()) {
      alert('Please fix validation errors before submitting');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.token) {
        // Show success pop-up alert
        window.alert('Sign Up Successful! Welcome to the Fitness Platform.');
        
        // Optionally, reset the form fields after successful registration
        setFormData({ name: '', email: '', password: '' });
        window.location.href = '/signin';

      } else {
        alert(data.msg || 'Registration failed');
      }
    } catch (error) {
      alert('Email address already exists.');
    }
  };

  return (
    <div className="signup-form">
      <h2>Coach Sign-Up</h2>
      <form onSubmit={registerCoach}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={name}
          onChange={handleChange}
          required
        />
        {errors.name && <span className="error">{errors.name}</span>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className="error">{errors.email}</span>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />
        {errors.password && <span className="error">{errors.password}</span>}

        <button type="submit" disabled={!isFormValid()}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
