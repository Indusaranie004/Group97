import React from "react";
import { jsPDF } from "jspdf";
import "./Confir.css";

const PaymentConfirmation = ({ paymentDetails }) => {
  // Sample payment details if no props are provided
  const details = paymentDetails || {
    transactionId: "123456789",
    amount: "$50.00",
    date: new Date().toLocaleDateString(),
    method: "Credit Card",
    status: "Successful",
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text("Payment Confirmation", 20, 20);
    doc.text(`Transaction ID: ${details.transactionId}`, 20, 40);
    doc.text(`Amount: ${details.amount}`, 20, 50);
    doc.text(`Date: ${details.date}`, 20, 60);
    doc.text(`Method: ${details.method}`, 20, 70);
    doc.text(`Status: ${details.status}`, 20, 80);
    doc.save("Payment_Confirmation.pdf");
  };

  return (
    <div className="container"><br></br>
      <div className="header">
        <h2>Payment Confirmation</h2>
      </div>
      <hr></hr>
      <div className="details">
        <p><strong>Transaction ID:</strong> {details.transactionId}</p>
        <p><strong>Amount:</strong> {details.amount}</p>
        <p><strong>Date:</strong> {details.date}</p>
        <p><strong>Method:</strong> {details.method}</p>
        <p><strong>Status:</strong> {details.status}</p>
      </div>
      <button className="button" onClick={handleDownload}>Download Receipt</button>
    </div>
  );
};

export default PaymentConfirmation;
