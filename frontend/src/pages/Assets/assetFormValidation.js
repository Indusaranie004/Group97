// assetFormValidation.js

/**
 * Validates the gym asset form data
 * @param {Object} formData - The form data to validate
 * @returns {Object} - Contains isValid boolean and errors object
 */
export const validateAssetForm = (formData) => {
    const errors = {};
    
    // Asset Name validation
    if (!formData.AssetName) {
      errors.AssetName = "Asset name is required";
    } else if (formData.AssetName.length < 2) {
      errors.AssetName = "Asset name must be at least 2 characters";
    } else if (formData.AssetName.length > 50) {
      errors.AssetName = "Asset name cannot exceed 50 characters";
    }
    
    // Asset Type validation
    if (!formData.AssetType) {
      errors.AssetType = "Please select an asset type";
    }
    
    // Quantity validation
    if (!formData.Quantity) {
      errors.Quantity = "Quantity is required";
    } else if (!/^\d+$/.test(formData.Quantity)) {
      errors.Quantity = "Quantity must be a positive number";
    } else if (parseInt(formData.Quantity) <= 0) {
      errors.Quantity = "Quantity must be greater than zero";
    }
    
    // Purchase Date validation
    if (!formData.PurchaseDate) {
      errors.PurchaseDate = "Purchase date is required";
    } else {
      const selectedDate = new Date(formData.PurchaseDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate > today) {
        errors.PurchaseDate = "Purchase date cannot be in the future";
      }
    }
    
    // Condition validation
    if (!formData.Condition) {
      errors.Condition = "Please select the asset condition";
    }
    
    // Estimated Value validation
    if (!formData.EstimatedValue) {
      errors.EstimatedValue = "Estimated value is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(formData.EstimatedValue)) {
      errors.EstimatedValue = "Please enter a valid currency amount";
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  /**
   * Helper function to display validation errors
   * @param {string} fieldName - The name of the field
   * @param {Object} errors - Object containing all validation errors
   * @returns {string|null} - The error message or null
   */
  export const getFieldError = (fieldName, errors) => {
    return errors && errors[fieldName] ? errors[fieldName] : null;
  };