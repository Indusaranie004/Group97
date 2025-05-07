// ReceiptDownloader.js
import jsPDF from 'jspdf';

export const generateReceiptPDF = (paymentData, transactionId) => {
  // Create a new jsPDF instance
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Get current date formatted nicely
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Add title
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
  
  // Add reference number prominently
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Reference Number: ${transactionId || 'N/A'}`, 105, 30, { align: 'center' });
  
  // Add a line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);
  
  // Add receipt details as a single block
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  let yPosition = 45;
  const lineHeight = 8;
  
  // All details in a single block
  doc.text(`Date: ${currentDate}`, 20, yPosition); yPosition += lineHeight;
  doc.text(`Time: ${currentTime}`, 20, yPosition); yPosition += lineHeight;
  doc.text(`Amount: $${paymentData.amount}`, 20, yPosition); yPosition += lineHeight;
  doc.text(`Payment Method: ${paymentData.paymentMethod === 'credit' ? 'Credit Card' : 'Debit Card'}`, 20, yPosition); yPosition += lineHeight;
  doc.text(`Card Number: **** **** **** ${paymentData.lastFourDigits || '****'}`, 20, yPosition); yPosition += lineHeight;
  doc.text(`Name on Card: ${paymentData.cardName}`, 20, yPosition); yPosition += lineHeight * 1.5;
  
  if (paymentData.billingAddress) {
    doc.text(`Billing Address: ${paymentData.billingAddress}`, 20, yPosition);
    // Adjust based on text height
    const addressLines = doc.splitTextToSize(`Billing Address: ${paymentData.billingAddress}`, 150);
    yPosition += addressLines.length * 6;
  }
  
  // Add footer
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.text('Thank you for your payment!', 105, 220, { align: 'center' });
  doc.text('This is an electronically generated receipt.', 105, 226, { align: 'center' });
  
  // Generate a filename with reference ID and date
  const dateStamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let filename = `Receipt_${dateStamp}`;
  
  // Add reference ID to filename if available
  if (transactionId) {
    filename += `_REF${transactionId}`;
  }
  filename += '.pdf';
  
  return {
    pdf: doc,
    filename: filename
  };
};

export const downloadReceipt = (paymentData, transactionId) => {
  const { pdf, filename } = generateReceiptPDF(paymentData, transactionId);
  
  // Save the PDF
  pdf.save(filename);
};