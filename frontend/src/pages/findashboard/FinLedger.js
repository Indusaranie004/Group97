import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';  // Ensure jsPDF is correctly imported
import 'jspdf-autotable';  // Ensure the jsPDF autotable plugin is imported

const CashURL = "http://localhost:5001/CashLog"; // Update the URL if needed

const FinLedger = () => {
  const [cashEntries, setCashEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch Cash Entries from the backend
    axios.get(CashURL)
      .then((response) => {
        console.log("Fetched Cash Entries:", response.data); // Log fetched data
        setCashEntries(response.data.CashEntries); // Set state with data
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Cash Ledger Report", 14, 16);

    let yOffset = 30;
    // Use autoTable correctly here
    doc.autoTable({
      head: [['Date', 'Amount', 'Transaction Type', 'Category', 'Description', 'Recorded By']],
      body: cashEntries.map(entry => [
        entry.date,
        entry.amount,
        entry.transactionType,
        entry.category,
        entry.description || 'N/A',
        entry.recordedBy
      ]),
      startY: yOffset,
    });

    doc.save('cash_ledger_report.pdf');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="finledger-container">
      <h2>Cash Ledger</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Transaction Type</th>
            <th>Category</th>
            <th>Description</th>
            <th>Recorded By</th>
          </tr>
        </thead>
        <tbody>
          {cashEntries && cashEntries.length > 0 ? (
            cashEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.date}</td>
                <td>{entry.amount}</td>
                <td>{entry.transactionType}</td>
                <td>{entry.category}</td>
                <td>{entry.description || 'N/A'}</td>
                <td>{entry.recordedBy}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No cash entries available.</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={downloadPDF} style={{ backgroundColor: '#ffd700', padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
        Download Report as PDF
      </button>
    </div>
  );
};

export default FinLedger;