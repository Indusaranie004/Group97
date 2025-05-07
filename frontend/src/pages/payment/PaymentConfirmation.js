// PaymentConfirmation.js
import React from "react";
import { downloadReceipt } from "./ReceiptDownloader";
import "./Confirmation.css";

function PaymentConfirmation({ paymentData, transactionId }) {
  // Generate shorter reference ID (first 8 characters of transactionId)
  const referenceId = transactionId ? transactionId.substring(0, 8).toUpperCase() : 'N/A';

  const handleDownload = () => {
    downloadReceipt(paymentData, transactionId);
  };

  return (
    <div className="payment-confirmation">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">✓</div>
          <h3>Payment Successful!</h3>
        </div>
        
        <div className="confirmation-details">
          <div className="detail-row">
            <span className="detail-label">Amount:</span>
            <span className="detail-value">${paymentData.amount}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Reference ID:</span>
            <span className="detail-value">{referenceId}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">{new Date().toLocaleString()}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Payment Method:</span>
            <span className="detail-value">
              {paymentData.paymentMethod === 'credit' ? 'Credit Card' : 'Debit Card'} (**** {paymentData.lastFourDigits})
            </span>
          </div>
        </div>
        
        <div className="confirmation-message">
          <p>Thank you for your payment! A receipt has been sent to your email.</p>
        </div>
        
        <div className="confirmation-actions">
          <button 
            className="download-receipt-button" 
            onClick={handleDownload}
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentConfirmation;