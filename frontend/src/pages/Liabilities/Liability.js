import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Liability.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const URL = "http://localhost:5001/Liabilities/Fetch";

const Liabilities = () => {
  const navigate = useNavigate();
  const [liabilities, setLiabilities] = useState([]);
  const [filteredLiabilities, setFilteredLiabilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLiability, setSelectedLiability] = useState(null);
  const [notes, setNotes] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Fetch all liabilities - will run on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchLiabilities = async () => {
      try {
        setLoading(true);
        const response = await fetch(URL);
        const data = await response.json();
        
        console.log('API Response:', data);
        
        // Handle the response data
        const liabilityData = data.liabilities || [];
        setLiabilities(liabilityData);
        setFilteredLiabilities(liabilityData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching liabilities:', error);
        setError('Failed to fetch liabilities. Please try again later.');
        setLoading(false);
      }
    };

    fetchLiabilities();
  }, [refreshTrigger]);

  // Trigger a refresh when the component mounts to ensure data is fresh
  useEffect(() => {
    // This will refresh data each time the component is mounted
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // Filter liabilities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredLiabilities(liabilities);
    } else {
      const filtered = liabilities.filter(liability => 
        liability.employee.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLiabilities(filtered);
    }
  }, [searchTerm, liabilities]);

  // Manual refresh function
  const refreshData = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Handle liability payment
  const handlePayment = async (id, employee) => {
    if (window.confirm(`Are you sure you want to mark the payment for ${employee} as paid?`)) {
      try {
        const response = await fetch(`${URL}/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (response.ok) {
          // Update the local state to reflect the change
          const updatedLiabilities = liabilities.filter(liability => liability._id !== id);
          setLiabilities(updatedLiabilities);
          setFilteredLiabilities(updatedLiabilities);
          alert(`Payment for ${employee} has been marked as paid.`);
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || 'Failed to update payment status'}`);
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
        alert('An error occurred while updating the payment status.');
      }
    }
  };

  // Open notes modal
  const openNotesModal = (liability) => {
    setSelectedLiability(liability);
    setNotes(liability.notes || '');
  };

  // Close notes modal
  const closeNotesModal = () => {
    setSelectedLiability(null);
    setNotes('');
  };

  // Save notes
  const saveNotes = async () => {
    try {
      const response = await fetch(`${URL}/${selectedLiability._id}/notes`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes })
      });
      
      if (response.ok) {
        // Update the local state to reflect the change
        const updatedLiabilities = liabilities.map(liability => {
          if (liability._id === selectedLiability._id) {
            return { ...liability, notes };
          }
          return liability;
        });
        
        setLiabilities(updatedLiabilities);
        setFilteredLiabilities(updatedLiabilities);
        closeNotesModal();
        alert('Notes saved successfully.');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save notes'}`);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('An error occurred while saving the notes.');
    }
  };

  // Generate liabilities report as PDF
  const generateLiabilitiesReport = () => {
    try {
      const doc = new jsPDF();
      
      // Add header with FitnessPro branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.text("FitnessPro", 14, 20);
      
      doc.setLineWidth(0.5);
      doc.line(10, 25, 200, 25);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Liabilities Report", 14, 35);
      
      // Add date
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 20);
      
      // Calculate total liability amount
      let totalAmount = 0;
      filteredLiabilities.forEach(liability => {
        const amount = parseFloat(liability.salary.replace(/[^0-9.-]+/g, "") || 0) + 
                       parseFloat(liability.bonus.replace(/[^0-9.-]+/g, "") || 0);
        totalAmount += amount;
      });
      
      // Add summary
      doc.setFontSize(12);
      doc.text(`Total Overdue Payments: ${filteredLiabilities.length}`, 14, 45);
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, 55);
      
      // Add table
      autoTable(doc, {
        startY: 65,
        head: [['Employee', 'Salary', 'Bonus', 'Due Date', 'Total Amount']],
        body: filteredLiabilities.map(liability => {
          const salary = parseFloat(liability.salary.replace(/[^0-9.-]+/g, "") || 0);
          const bonus = parseFloat(liability.bonus.replace(/[^0-9.-]+/g, "") || 0);
          const total = salary + bonus;
          
          return [
            liability.employee,
            `$${salary.toFixed(2)}`,
            `$${bonus.toFixed(2)}`,
            liability.date,
            `$${total.toFixed(2)}`
          ];
        }),
      });
      
      // Save the document
      doc.save('liabilities_report.pdf');
    } catch (error) {
      console.error('Error generating liabilities report:', error);
      alert('Failed to generate liabilities report');
    }
  };

  if (loading) {
    return <div className="loading">Loading liabilities data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="liabilities-container">
      <header className="header">
        <h1>Financial Liabilities</h1>
        <p>Manage overdue payments and financial obligations</p>
      </header>

      <section className="search-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="action-buttons">
          <button 
            className="refresh-button"
            onClick={refreshData}
            title="Refresh data to see the latest changes"
          >
            Refresh Data
          </button>
          <button 
            className="report-button"
            onClick={generateLiabilitiesReport}
          >
            Generate Report
          </button>
        </div>
      </section>

      <section className="liabilities-summary">
        <div className="summary-card">
          <div className="summary-icon">
            <span className="summary-icon-text">OD</span>
          </div>
          <div className="summary-content">
            <h3>Total Overdue</h3>
            <p className="summary-value">{filteredLiabilities.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">
            <span className="summary-icon-text">$</span>
          </div>
          <div className="summary-content">
            <h3>Total Amount</h3>
            <p className="summary-value">
              ${filteredLiabilities.reduce((total, liability) => {
                const salary = parseFloat(liability.salary.replace(/[^0-9.-]+/g, "") || 0);
                const bonus = parseFloat(liability.bonus.replace(/[^0-9.-]+/g, "") || 0);
                return total + salary + bonus;
              }, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      <section className="liabilities-list">
        <h2>Overdue Payments</h2>
        
        {filteredLiabilities.length === 0 ? (
          <div className="no-liabilities">
            <p>No overdue payments found</p>
          </div>
        ) : (
          <table className="liabilities-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Salary</th>
                <th>Bonus</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLiabilities.map((liability, index) => (
                <tr key={index} className="liability-row">
                  <td>{liability.employee}</td>
                  <td>{liability.salary}</td>
                  <td>{liability.bonus}</td>
                  <td>{liability.date}</td>
                  <td>
                    <span className="status overdue">Overdue</span>
                  </td>
                  <td className="actions">
                    <button 
                      className="pay-button"
                      onClick={() => handlePayment(liability._id, liability.employee)}
                    >
                      Mark as Paid
                    </button>
                    <button 
                      className="notes-button"
                      onClick={() => openNotesModal(liability)}
                    >
                      Add Notes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Notes Modal */}
      {selectedLiability && (
        <div className="modal-overlay">
          <div className="notes-modal">
            <h3>Notes for {selectedLiability.employee}</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes about this overdue payment..."
              className="notes-textarea"
            ></textarea>
            <div className="modal-buttons">
              <button className="save-button" onClick={saveNotes}>Save Notes</button>
              <button className="cancel-button" onClick={closeNotesModal}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="navigation-buttons">
        <button 
          className="back-button"
          onClick={() => navigate('/payroll-dashboard')}
        >
          Back to Payroll
        </button>
        <button 
          className="home-button"
          onClick={() => navigate('/hr-profile')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Liabilities;