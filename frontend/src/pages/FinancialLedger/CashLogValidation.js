/**
 * CashLogValidation.js
 * Handles validation for the CashEntryForm component
 */

/**
 * Validates the entire form data object
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Object containing validation result and error messages
 */
export const validateCashEntry = (formData) => {
    // Initialize error object
    const errors = {};
    let isValid = true;
  
    // Date validation
    if (!formData.date) {
      errors.date = "Date is required";
      isValid = false;
    } else {
      const dateObj = new Date(formData.date);
      const today = new Date();
      
      if (isNaN(dateObj.getTime())) {
        errors.date = "Invalid date format";
        isValid = false;
      } else if (dateObj > today) {
        errors.date = "Date cannot be in the future";
        isValid = false;
      }
    }
  
    // Amount validation
    if (!formData.amount) {
      errors.amount = "Amount is required";
      isValid = false;
    } else if (isNaN(Number(formData.amount))) {
      errors.amount = "Amount must be a number";
      isValid = false;
    } else if (Number(formData.amount) <= 0) {
      errors.amount = "Amount must be greater than zero";
      isValid = false;
    } else if (Number(formData.amount) > 10000) {
      errors.amount = "Amount exceeds maximum limit (10,000)";
      isValid = false;
    }
  
    // Transaction Type validation
    if (!formData.transactionType) {
      errors.transactionType = "Transaction type is required";
      isValid = false;
    } else if (!["income", "expense"].includes(formData.transactionType)) {
      errors.transactionType = "Invalid transaction type";
      isValid = false;
    }
  
    // Category validation
    if (!formData.category) {
      errors.category = "Category is required";
      isValid = false;
    } else if (formData.category.length < 2) {
      errors.category = "Category must be at least 2 characters long";
      isValid = false;
    } else if (formData.category.length > 50) {
      errors.category = "Category cannot exceed 50 characters";
      isValid = false;
    }
  
    // Description validation
    if (!formData.description) {
      errors.description = "Description is required";
      isValid = false;
    } else if (formData.description.length < 5) {
      errors.description = "Description must be at least 5 characters long";
      isValid = false;
    } else if (formData.description.length > 500) {
      errors.description = "Description cannot exceed 500 characters";
      isValid = false;
    }
  
    // Recorded By validation
    if (!formData.recordedBy) {
      errors.recordedBy = "Recorded By is required";
      isValid = false;
    } else if (formData.recordedBy.length < 2) {
      errors.recordedBy = "Name must be at least 2 characters long";
      isValid = false;
    } else if (formData.recordedBy.length > 100) {
      errors.recordedBy = "Name cannot exceed 100 characters";
      isValid = false;
    } else if (!/^[a-zA-Z\s.-]+$/.test(formData.recordedBy)) {
      errors.recordedBy = "Name can only contain letters, spaces, dots, and hyphens";
      isValid = false;
    }
  
    return {
      isValid,
      errors
    };
  };
  
  /**
   * Validates a single field
   * @param {string} fieldName - The name of the field to validate
   * @param {any} value - The value of the field
   * @returns {string|null} - Error message or null if valid
   */
  export const validateField = (fieldName, value) => {
    switch (fieldName) {
      case "date":
        if (!value) return "Date is required";
        const dateObj = new Date(value);
        const today = new Date();
        
        if (isNaN(dateObj.getTime())) return "Invalid date format";
        if (dateObj > today) return "Date cannot be in the future";
        return null;
  
      case "amount":
        if (!value) return "Amount is required";
        if (isNaN(Number(value))) return "Amount must be a number";
        if (Number(value) <= 0) return "Amount must be greater than zero";
        if (Number(value) > 10000) return "Amount exceeds maximum limit (10,000)";
        return null;
  
      case "transactionType":
        if (!value) return "Transaction type is required";
        if (!["income", "expense"].includes(value)) return "Invalid transaction type";
        return null;
  
      case "category":
        if (!value) return "Category is required";
        if (value.length < 2) return "Category must be at least 2 characters long";
        if (value.length > 50) return "Category cannot exceed 50 characters";
        return null;
  
      case "description":
        if (!value) return "Description is required";
        if (value.length < 5) return "Description must be at least 5 characters long";
        if (value.length > 500) return "Description cannot exceed 500 characters";
        return null;
  
      case "recordedBy":
        if (!value) return "Recorded By is required";
        if (value.length < 2) return "Name must be at least 2 characters long";
        if (value.length > 100) return "Name cannot exceed 100 characters";
        if (!/^[a-zA-Z\s.-]+$/.test(value)) {
          return "Name can only contain letters, spaces, dots, and hyphens";
        }
        return null;
  
      default:
        return null;
    }
  };
  
  /**
   * Helper function to check if an object is empty
   * @param {Object} obj - The object to check
   * @returns {boolean} - True if empty, false otherwise
   */
  export const isEmptyObject = (obj) => {
    return Object.keys(obj).length === 0;
  };
  
  /**
   * Format currency amount for display
   * @param {number} amount - The amount to format
   * @returns {string} - Formatted amount
   */
  export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };