// ForgotPasswordValidation.js
const validateForgotPasswordForm = (email) => {
    let error = '';
    
    if (!email) {
      error = 'Email is required';
    } else {
      // Email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        error = 'Please enter a valid email address';
      }
    }
    
    return {
      isValid: error === '',
      error
    };
  };
  
  export default validateForgotPasswordForm;