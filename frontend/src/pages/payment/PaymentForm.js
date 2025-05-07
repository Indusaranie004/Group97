import { useState } from "react";
import { validatePaymentForm } from "./paymentValidation";
import PaymentConfirmation from "./PaymentConfirmation";

export default function PaymentForm() {
  const [paymentData, setPaymentData] = useState({
    amount: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingAddress: "",
    paymentMethod: "credit",
    type: "expense" // default to expense
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);

  const validateForm = () => {
    const { errors, isValid } = validatePaymentForm(paymentData);
    setErrors(errors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim();
      setPaymentData({ ...paymentData, [name]: formattedValue });
    }
    // Format expiry date
    else if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2');
      setPaymentData({ ...paymentData, [name]: formattedValue });
    } 
    else {
      setPaymentData({ ...paymentData, [name]: value });
    }
    
    // Clear the error for this field if it exists
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setPaymentStatus("processing");
    
    try {
      // Prepare data for payment API with type included
      const paymentRequest = {
        amount: Number(paymentData.amount),
        paymentMethod: paymentData.paymentMethod,
        cardName: paymentData.cardName,
        lastFourDigits: paymentData.cardNumber.slice(-4).replace(/\s/g, ''),
        billingAddress: paymentData.billingAddress,
        type: paymentData.type // Include transaction type directly in payment request
      };
      
      console.log("Sending payment request:", paymentRequest);
      
      // Process the payment - single API call approach using the updated backend
      const paymentResponse = await fetch("http://localhost:5001/Payment/Insert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentRequest)
      });
      
      console.log("Payment response status:", paymentResponse.status);
      
      if (paymentResponse.ok) {
        const paymentResult = await paymentResponse.json();
        setTransactionId(paymentResult.transactionId);
        setPaymentStatus("success");
      } else {
        const errorText = await paymentResponse.text();
        console.error("Payment failed response:", errorText);
        try {
          const error = JSON.parse(errorText);
          console.error("Payment failed with error:", error);
        } catch (parseError) {
          console.error("Could not parse error response as JSON");
        }
        setPaymentStatus("failed");
      }
    } catch (error) {
      console.error("Payment process error:", error.toString());
      setPaymentStatus("failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="page-heading">Payment Gateway</h1>
      <h2>Payment Portal</h2>
      
      {paymentStatus === "success" ? (
        <PaymentConfirmation 
          paymentData={{
            amount: paymentData.amount,
            cardName: paymentData.cardName,
            lastFourDigits: paymentData.cardNumber.slice(-4).replace(/\s/g, ''),
            paymentMethod: paymentData.paymentMethod,
            billingAddress: paymentData.billingAddress,
            type: paymentData.type
          }} 
          transactionId={transactionId}
        />
      ) : (
        <form onSubmit={handleSubmit} className="payment-form">
          
          {/* Transaction Type Field */}
          <div className="form-group">
            <label>Transaction Type</label>
            <select
              name="type"
              value={paymentData.type}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="expense">Employee Salary</option>
              <option value="income">Subscription Fee</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Amount</label>
            <input
              type="text"
              name="amount"
              placeholder="Enter amount"
              value={paymentData.amount}
              onChange={handleChange}
              className={errors.amount ? "error" : ""}
              disabled={isSubmitting}
            />
            {errors.amount && <span className="error-message">{errors.amount}</span>}
          </div>
          
          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="credit">Credit Card</option>
              <option value="debit">Debit Card</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Name on Card</label>
            <input
              type="text"
              name="cardName"
              placeholder="Enter name as shown on card"
              value={paymentData.cardName}
              onChange={handleChange}
              className={errors.cardName ? "error" : ""}
              disabled={isSubmitting}
            />
            {errors.cardName && <span className="error-message">{errors.cardName}</span>}
          </div>
          
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="1234 5678 9012 3456"
              value={paymentData.cardNumber}
              onChange={handleChange}
              maxLength="19"
              className={errors.cardNumber ? "error" : ""}
              disabled={isSubmitting}
            />
            {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group half">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentData.expiryDate}
                onChange={handleChange}
                maxLength="5"
                className={errors.expiryDate ? "error" : ""}
                disabled={isSubmitting}
              />
              {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
            </div>
            
            <div className="form-group half">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={paymentData.cvv}
                onChange={handleChange}
                maxLength="4"
                className={errors.cvv ? "error" : ""}
                disabled={isSubmitting}
              />
              {errors.cvv && <span className="error-message">{errors.cvv}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Billing Address</label>
            <textarea
              name="billingAddress"
              placeholder="Enter your billing address"
              value={paymentData.billingAddress}
              onChange={handleChange}
              className={errors.billingAddress ? "error" : ""}
              disabled={isSubmitting}
            ></textarea>
            {errors.billingAddress && <span className="error-message">{errors.billingAddress}</span>}
          </div>
          
          <button 
            type="submit" 
            className="payment-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 
              "Processing Payment..." : 
              paymentData.type === "income" ? "Add Income" : "Process Payment"
            }
          </button>
          
          {paymentStatus === "failed" && (
            <div className="payment-error">
              Payment failed. Please try again later.
            </div>
          )}
        </form>
      )}
    </>
  );
}