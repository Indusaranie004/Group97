// utils/paymentValidation.js

export const validatePaymentForm = (paymentData) => {
    const errors = {};
    
    // Amount validation
    if (!paymentData.amount || isNaN(paymentData.amount) || Number(paymentData.amount) <= 0) {
      errors.amount = "Please enter a valid amount";
    }
    
    // Card name validation
    if (!paymentData.cardName.trim()) {
      errors.cardName = "Name on card is required";
    }
    
    // Card number validation
    if (!paymentData.cardNumber.trim() || !/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = "Enter a valid 16-digit card number";
    }
    
    // Expiry date validation
    if (!paymentData.expiryDate.trim() || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
      errors.expiryDate = "Enter a valid expiry date (MM/YY)";
    } else {
      const [month, year] = paymentData.expiryDate.split('/');
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        errors.expiryDate = "Card has expired";
      }
    }
    
    // CVV validation
    if (!paymentData.cvv.trim() || !/^\d{3,4}$/.test(paymentData.cvv)) {
      errors.cvv = "Enter a valid CVV";
    }
    
    // Billing address validation
    if (!paymentData.billingAddress.trim()) {
      errors.billingAddress = "Billing address is required";
    }
    
    return {
      errors,
      isValid: Object.keys(errors).length === 0
    };
  };