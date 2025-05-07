import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './PayrollDashboard.css';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const URL = "http://localhost:5000/payrolls";

const PayrollDashboard = () => {
  const navigate = useNavigate();
  const [payrolls, setPayrolls] = useState([]);
  const [filteredPayrolls, setFilteredPayrolls] = useState([]);
  const [newPayroll, setNewPayroll] = useState({
    employee: '',
    bonus: '',
    salary: '',
    date: '',
    paymentStatus: ''
  });
  const [editPayroll, setEditPayroll] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('transactions');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch all payrolls
  const fetchPayrolls = async () => {
    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      const data = await response.json();
      
      // Check the structure of the response
      console.log('API Response:', data);
      
      // Handle different response structures
      const payrollData = data.payrolls || data || [];
      setPayrolls(payrollData);
      setFilteredPayrolls(payrollData); // Initialize filtered payrolls
    } catch (error) {
      console.error('Error fetching payrolls:', error);
      alert(`Failed to fetch payrolls: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, []);

  // Memoized filter function
  const applyFilters = useCallback(() => {
    let result = [...payrolls];

    // Apply search
    if (searchTerm) {
      result = result.filter(payroll =>
        payroll.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payroll.paymentStatus.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply payment status filter
    if (statusFilter !== 'all') {
      result = result.filter(payroll => {
        // Make case-insensitive comparison to ensure filter works
        return payroll.paymentStatus && 
               payroll.paymentStatus.toLowerCase() === statusFilter.toLowerCase();
      });
    }

    setFilteredPayrolls(result);
  }, [payrolls, searchTerm, statusFilter]);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters, searchTerm, statusFilter, payrolls]);

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
  };

  // Handle input change for new payroll
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayroll({ ...newPayroll, [name]: value });
  };

  // Validate form data
  const validatePayrollForm = (payrollData) => {
    // Check if required fields are filled
    if (!payrollData.employee || !payrollData.salary || !payrollData.date || !payrollData.paymentStatus) {
      alert('Please fill all required fields');
      return false;
    }
    return true;
  };

  // Add new payroll
  const addPayroll = async () => {
    if (!validatePayrollForm(newPayroll)) return;
    
    try {
      setIsSubmitting(true);
      
      // Format data for better compatibility with backend
      const payrollData = {
        ...newPayroll,
        // Ensure numeric values are properly formatted if needed
        salary: newPayroll.salary.toString(),
        bonus: newPayroll.bonus ? newPayroll.bonus.toString() : ''
      };
      
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payrollData),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      await response.json();
      
      // Refresh payroll data after successful addition
      await fetchPayrolls();
      
      // Reset form
      setNewPayroll({
        employee: '',
        bonus: '',
        salary: '',
        date: '',
        paymentStatus: ''
      });
      
      alert('Payroll added successfully!');
      // Switch to transactions tab after adding
      setActiveTab('transactions');
    } catch (error) {
      console.error('Error adding payroll:', error);
      alert(`Failed to add payroll: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set payroll to edit
  const setPayrollToEdit = (payroll) => {
    setEditPayroll(payroll);
    setActiveTab('edit');
  };

  // Update payroll
  const updatePayroll = async () => {
    if (!validatePayrollForm(editPayroll)) return;
    
    try {
      setIsSubmitting(true);
      
      const payrollId = editPayroll._id || editPayroll.id;
      if (!payrollId) {
        throw new Error("Payroll ID is missing");
      }
      
      const response = await fetch(`${URL}/${payrollId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPayroll),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Refresh payroll data after successful update
      await fetchPayrolls();
      
      // Clear edit mode
      setEditPayroll(null);
      alert('Payroll updated successfully!');
      // Switch to transactions tab after updating
      setActiveTab('transactions');
    } catch (error) {
      console.error('Error updating payroll:', error);
      alert(`Failed to update payroll: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete payroll
  const deletePayroll = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll?')) return;
    
    try {
      const response = await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Refresh payroll data after successful deletion
      await fetchPayrolls();
      
      alert('Payroll deleted successfully!');
    } catch (error) {
      console.error('Error deleting payroll:', error);
      alert(`Failed to delete payroll: ${error.message}`);
    }
  };

  // Function to handle payment action - FIXED
  const handlePayment = async (id, employee) => {
    try {
      const payrollToUpdate = payrolls.find(p => p._id === id || p.id === id);
      
      if (!payrollToUpdate) {
        throw new Error("Payroll not found");
      }
      
      const payrollId = id;
      
      // Check if server expects PATCH or PUT for status updates
      // First try with PATCH
      let response = await fetch(`${URL}/${payrollId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentStatus: "Paid" }),
      });
      
      // If PATCH returns 404 or method not allowed, try with PUT
      if (response.status === 404 || response.status === 405) {
        // For PUT, we need to send the full object
        const updatedPayroll = {
          ...payrollToUpdate,
          paymentStatus: "Paid"
        };
        
        response = await fetch(`${URL}/${payrollId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedPayroll),
        });
      }
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Refresh payroll data after successful payment
      await fetchPayrolls();
      
      alert(`Payment processed for ${employee}`);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert(`Failed to process payment: ${error.message}`);
    }
  };

  // Calculate status counts - FIXED to ensure case-insensitive comparison
  const pendingCount = payrolls.filter(p => 
    p.paymentStatus && p.paymentStatus.toLowerCase() === "pending"
  ).length;
  
  const paidCount = payrolls.filter(p => 
    p.paymentStatus && p.paymentStatus.toLowerCase() === "paid"
  ).length;
  
  const overdueCount = payrolls.filter(p => 
    p.paymentStatus && p.paymentStatus.toLowerCase() === "overdue"
  ).length;

  // Function to generate PDF reports with proper headers
  const generatePdfReport = (title, columns, data) => {
    try {
      const doc = new jsPDF();
      const currentDate = new Date().toLocaleDateString();
      
      // Add header with company name and date
      doc.setFontSize(20);
      doc.text("FitnessPro", 14, 20);
      
      doc.setFontSize(10);
      doc.text(`Generated: ${currentDate}`, doc.internal.pageSize.width - 60, 20);
      
      doc.setFontSize(16);
      doc.text(title, 14, 30);
      
      // Add table with data
      autoTable(doc, {
        head: [columns],
        body: data,
        startY: 35,
      });
      
      doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error(`Error generating ${title} report:`, error);
      alert(`Failed to generate ${title} report`);
    }
  };

  // Function to generate and download Employee Salary Report (PDF)
  const generateEmployeeSalaryReport = () => {
    generatePdfReport(
      "Employee Salary Report",
      ["Employee Name", "Salary", "Bonus"],
      filteredPayrolls.map((t) => [t.employee, t.salary, t.bonus || "0"])
    );
  };

  // Function to generate and download Payment Status Report (PDF)
  const generatePaymentStatusReport = () => {
    generatePdfReport(
      "Payment Status Report",
      ["Employee Name", "Payment Status", "Date"],
      filteredPayrolls.map((t) => [t.employee, t.paymentStatus, t.date])
    );
  };

  // Function to generate and download Payroll Summary Report (PDF)
  const generatePayrollSummaryReport = () => {
    try {
      const totalSalaries = filteredPayrolls.reduce((sum, t) => {
        const salary = typeof t.salary === 'string' ? 
          parseFloat(t.salary.replace(/[^0-9.-]+/g, "") || 0) : 
          (parseFloat(t.salary) || 0);
        return sum + salary;
      }, 0);
      
      const totalBonuses = filteredPayrolls.reduce((sum, t) => {
        const bonus = !t.bonus ? 0 : 
          (typeof t.bonus === 'string' ? 
            parseFloat(t.bonus.replace(/[^0-9.-]+/g, "") || 0) : 
            (parseFloat(t.bonus) || 0));
        return sum + bonus;
      }, 0);

      generatePdfReport(
        "Payroll Summary Report",
        ["Metric", "Amount"],
        [
          ["Total Salaries", `$${totalSalaries.toFixed(2)}`],
          ["Total Bonuses", `$${totalBonuses.toFixed(2)}`],
          ["Total Payroll", `$${(totalSalaries + totalBonuses).toFixed(2)}`],
          ["Total Employees", `${filteredPayrolls.length}`],
          ["Paid Transactions", `${filteredPayrolls.filter(p => p.paymentStatus && p.paymentStatus.toLowerCase() === "paid").length}`],
          ["Pending Transactions", `${filteredPayrolls.filter(p => p.paymentStatus && p.paymentStatus.toLowerCase() === "pending").length}`],
          ["Overdue Transactions", `${filteredPayrolls.filter(p => p.paymentStatus && p.paymentStatus.toLowerCase() === "overdue").length}`]
        ]
      );
    } catch (error) {
      console.error('Error generating payroll summary report:', error);
      alert('Failed to generate payroll summary report');
    }
  };

  return (
    <div className={`dashboard-container ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar / Navigation */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>FitnessPro</h2>
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
        <nav>
          <ul>
            <li className={activeTab === 'transactions' ? 'active' : ''}>
              <button onClick={() => setActiveTab('transactions')}>
                📊 Payroll Transactions
              </button>
            </li>
            <li className={activeTab === 'add' ? 'active' : ''}>
              <button onClick={() => setActiveTab('add')}>
                ➕ Add New Payroll
              </button>
            </li>
            <li className={activeTab === 'reports' ? 'active' : ''}>
              <button onClick={() => setActiveTab('reports')}>
                📑 Generate Reports
              </button>
            </li>
            <li className={activeTab === 'search' ? 'active' : ''}>
              <button onClick={() => {
                setActiveTab('search');
                // Force immediate search when clicking on search tab
                applyFilters();
              }}>
                🔍 Search & Filter
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/hr-profile')}>
                ↩️ Back to HR Dashboard
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="content-header">
          <h1>Payroll Dashboard</h1>
        </header>

        {/* Status Cards */}
        <div className="status-cards">
          <div className="status-card pending-card">
            <div className="card-icon">🕒</div>
            <div className="card-content">
              <h3>Pending</h3>
              <p className="count">{pendingCount}</p>
            </div>
          </div>
          <div className="status-card paid-card">
            <div className="card-icon">✅</div>
            <div className="card-content">
              <h3>Paid</h3>
              <p className="count">{paidCount}</p>
            </div>
          </div>
          <div className="status-card overdue-card">
            <div className="card-icon">⚠️</div>
            <div className="card-content">
              <h3>Overdue</h3>
              <p className="count">{overdueCount}</p>
            </div>
          </div>
        </div>

        {/* Search and Filter Section - Show when activeTab is 'search' or 'transactions' */}
        {(activeTab === 'search' || activeTab === 'transactions') && (
          <section className="search-filter-section">
            <h2>Search & Filter</h2>
            
            <div className="search-filter-row">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search by employee name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="status-filter">
                <label htmlFor="statusFilter">Payment Status:</label>
                <select
                  id="statusFilter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-select"
                >
                  <option value="all">All Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>

              <button className="reset-button" onClick={resetFilters}>
                Reset
              </button>
            </div>
          </section>
        )}

        {/* Results Count */}
        {(activeTab === 'search' || activeTab === 'transactions') && (
          <div className="results-count">
            Showing {filteredPayrolls.length} of {payrolls.length} records
          </div>
        )}

        {/* Report Buttons Section - Show when activeTab is 'reports' */}
        {activeTab === 'reports' && (
          <section className="report-section">
            <h2>Generate Reports</h2>
            <div className="report-cards">
              <div className="report-card" onClick={generateEmployeeSalaryReport}>
                <div className="report-icon">💰</div>
                <div className="report-content">
                  <h3>Employee Salary Report</h3>
                  <p>Generate a detailed breakdown of employee salaries and bonuses</p>
                </div>
              </div>
              
              <div className="report-card" onClick={generatePaymentStatusReport}>
                <div className="report-icon">📊</div>
                <div className="report-content">
                  <h3>Payment Status Report</h3>
                  <p>View payment status for all employees</p>
                </div>
              </div>
              
              <div className="report-card" onClick={generatePayrollSummaryReport}>
                <div className="report-icon">📑</div>
                <div className="report-content">
                  <h3>Payroll Summary Report</h3>
                  <p>Get an overview of total payroll expenses</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Add Payroll Form - Show when activeTab is 'add' */}
        {activeTab === 'add' && (
          <section className="add-payroll">
            <h2>Add New Payroll</h2>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="employee">Employee Name *</label>
                <input
                  type="text"
                  id="employee"
                  name="employee"
                  value={newPayroll.employee}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="salary">Salary *</label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={newPayroll.salary}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bonus">Bonus</label>
                <input
                  type="text"
                  id="bonus"
                  name="bonus"
                  value={newPayroll.bonus}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newPayroll.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="paymentStatus">Payment Status *</label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={newPayroll.paymentStatus}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button className="submit-button" onClick={addPayroll} disabled={isSubmitting}>
                  {isSubmitting ? 'Adding...' : 'Add Payroll'}
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Edit Payroll Form - Show when activeTab is 'edit' */}
        {activeTab === 'edit' && editPayroll && (
          <section className="edit-payroll">
            <h2>Edit Payroll</h2>
            <div className="form-container">
              <div className="form-group">
                <label htmlFor="edit-employee">Employee Name *</label>
                <input
                  type="text"
                  id="edit-employee"
                  name="employee"
                  value={editPayroll.employee}
                  onChange={(e) => setEditPayroll({ ...editPayroll, employee: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-salary">Salary *</label>
                <input
                  type="text"
                  id="edit-salary"
                  name="salary"
                  value={editPayroll.salary}
                  onChange={(e) => setEditPayroll({ ...editPayroll, salary: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-bonus">Bonus</label>
                <input
                  type="text"
                  id="edit-bonus"
                  name="bonus"
                  value={editPayroll.bonus || ''}
                  onChange={(e) => setEditPayroll({ ...editPayroll, bonus: e.target.value })}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-date">Date *</label>
                <input
                  type="date"
                  id="edit-date"
                  name="date"
                  value={editPayroll.date}
                  onChange={(e) => setEditPayroll({ ...editPayroll, date: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="edit-paymentStatus">Payment Status *</label>
                <select
                  id="edit-paymentStatus"
                  name="paymentStatus"
                  value={editPayroll.paymentStatus}
                  onChange={(e) => setEditPayroll({ ...editPayroll, paymentStatus: e.target.value })}
                  required
                >
                  <option value="">-- Select Status --</option>
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
              
              <div className="form-actions">
                <button className="submit-button" onClick={updatePayroll} disabled={isSubmitting}>
                  {isSubmitting ? 'Updating...' : 'Update Payroll'}
                </button>
                <button className="cancel-button" onClick={() => {
                  setEditPayroll(null);
                  setActiveTab('transactions');
                }}>
                  Cancel
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Recent Salary Transactions Table - Always show in transactions tab */}
        {activeTab === 'transactions' && (
          <section className="recent-transactions">
            <h2>Recent Salary Transactions</h2>
            <table>
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Bonus</th>
                  <th>Salary</th>
                  <th>Date</th>
                  <th>Payment Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrolls.length > 0 ? (
                  filteredPayrolls.map((payroll, index) => (
                    <tr key={payroll._id || payroll.id || index}>
                      <td>{payroll.employee}</td>
                      <td>{payroll.bonus || '-'}</td>
                      <td>{payroll.salary}</td>
                      <td>{payroll.date}</td>
                      <td>
                        <span className={`status-badge ${payroll.paymentStatus?.toLowerCase()}`}>
                          {payroll.paymentStatus}
                        </span>
                      </td>
                      <td className="action-buttons">
                        <button
                          className={`payment-button ${payroll.paymentStatus === "Paid" ? "disabled" : ""}`}
                          onClick={() => handlePayment(payroll._id || payroll.id, payroll.employee)}
                          disabled={payroll.paymentStatus === "Paid"}
                        >
                          {payroll.paymentStatus === "Paid" ? "Paid" : "Pay Now"}
                        </button>
                        <button className="edit-button" onClick={() => setPayrollToEdit(payroll)}>
                          Edit
                        </button>
                        <button className="delete-button" onClick={() => deletePayroll(payroll._id || payroll.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No payroll records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
};

export default PayrollDashboard;