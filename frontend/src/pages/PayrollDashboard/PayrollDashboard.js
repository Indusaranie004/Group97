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
  const [filters, setFilters] = useState({
    paymentStatus: 'all',
    minSalary: '',
    maxSalary: '',
    dateFrom: '',
    dateTo: ''
  });

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
    if (filters.paymentStatus !== 'all') {
      result = result.filter(payroll =>
        payroll.paymentStatus === filters.paymentStatus
      );
    }

    // Apply salary range filter
    if (filters.minSalary) {
      result = result.filter(payroll => {
        const salary = parseFloat(payroll.salary.replace(/[^0-9.-]+/g, ""));
        return salary >= parseFloat(filters.minSalary);
      });
    }

    if (filters.maxSalary) {
      result = result.filter(payroll => {
        const salary = parseFloat(payroll.salary.replace(/[^0-9.-]+/g, ""));
        return salary <= parseFloat(filters.maxSalary);
      });
    }

    // Apply date range filter
    if (filters.dateFrom) {
      result = result.filter(payroll =>
        new Date(payroll.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      result = result.filter(payroll =>
        new Date(payroll.date) <= new Date(filters.dateTo)
      );
    }

    setFilteredPayrolls(result);
  }, [payrolls, searchTerm, filters]);

  // Fetch all payrolls
  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setPayrolls(data.payrolls);
      } catch (error) {
        console.error('Error fetching payrolls:', error);
      }
    };

    fetchPayrolls();
  }, []);

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      paymentStatus: 'all',
      minSalary: '',
      maxSalary: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Handle input change for new payroll
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayroll({ ...newPayroll, [name]: value });
  };

  // Add new payroll
  const addPayroll = async () => {
    try {
      const response = await fetch(URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPayroll),
      });
      const data = await response.json();
      setPayrolls([...payrolls, data.payrolls]);
      setNewPayroll({
        employee: '',
        bonus: '',
        salary: '',
        date: '',
        paymentStatus: ''
      });
    } catch (error) {
      console.error('Error adding payroll:', error);
    }
  };

  // Set payroll to edit
  const setPayrollToEdit = (payroll) => {
    setEditPayroll(payroll);
  };

  // Update payroll
  const updatePayroll = async () => {
    try {
      const response = await fetch(`${URL}/${editPayroll._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editPayroll),
      });
      const data = await response.json();
      setPayrolls(payrolls.map(p => (p._id === editPayroll._id ? data.payrolls : p)));
      setEditPayroll(null);
    } catch (error) {
      console.error('Error updating payroll:', error);
    }
  };

  // Delete payroll
  const deletePayroll = async (id) => {
    try {
      await fetch(`${URL}/${id}`, {
        method: 'DELETE',
      });
      setPayrolls(payrolls.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting payroll:', error);
    }
  };

  // Function to handle payment action
  const handlePayment = (employee) => {
    alert(`Payment processed for ${employee}`);
  };

  // Function to generate and download Employee Salary Report (PDF)
  const generateEmployeeSalaryReport = () => {
    try {
      const doc = new jsPDF();
      doc.text("Employee Salary Report", 10, 10);
      autoTable(doc, {
        head: [["Employee Name", "Salary", "Bonus"]],
        body: filteredPayrolls.map((t) => [t.employee, t.salary, t.bonus]),
      });
      doc.save("Employee_Salary_Report.pdf");
    } catch (error) {
      console.error('Error generating employee salary report:', error);
      alert('Failed to generate employee salary report');
    }
  };

  // Function to generate and download Payment Status Report (PDF)
  const generatePaymentStatusReport = () => {
    try {
      const doc = new jsPDF();
      doc.text("Payment Status Report", 10, 10);
      autoTable(doc, {
        head: [["Employee Name", "Payment Status"]],
        body: filteredPayrolls.map((t) => [t.employee, t.paymentStatus]),
      });
      doc.save("Payment_Status_Report.pdf");
    } catch (error) {
      console.error('Error generating payment status report:', error);
      alert('Failed to generate payment status report');
    }
  };

  // Function to generate and download Total Payments Report (PDF)
  const generateTotalPaymentsReport = () => {
    try {
      const totalPaid = filteredPayrolls.filter((t) => t.paymentStatus === "Paid").length;
      const totalPending = filteredPayrolls.filter((t) => t.paymentStatus === "Pending").length;
      const totalOverdue = filteredPayrolls.filter((t) => t.paymentStatus === "Overdue").length;

      const doc = new jsPDF();
      doc.text("Total Payments Report", 10, 10);
      autoTable(doc, {
        head: [["Status", "Count"]],
        body: [
          ["Paid", totalPaid],
          ["Pending", totalPending],
          ["Overdue", totalOverdue],
        ],
      });
      doc.save("Total_Payments_Report.pdf");
    } catch (error) {
      console.error('Error generating total payments report:', error);
      alert('Failed to generate total payments report');
    }
  };

  // Function to generate and download Payroll Summary Report (PDF)
  const generatePayrollSummaryReport = () => {
    try {
      const totalSalaries = filteredPayrolls.reduce((sum, t) => sum + parseFloat(t.salary.replace(/[^0-9.-]+/g, "") || 0), 0);
      const totalBonuses = filteredPayrolls.reduce((sum, t) => sum + parseFloat(t.bonus.replace(/[^0-9.-]+/g, "") || 0), 0);

      const doc = new jsPDF();
      doc.text("Payroll Summary Report", 10, 10);
      autoTable(doc, {
        head: [["Metric", "Amount"]],
        body: [
          ["Total Salaries", `$${totalSalaries.toFixed(2)}`],
          ["Total Bonuses", `$${totalBonuses.toFixed(2)}`],
          ["Total Payroll", `$${(totalSalaries + totalBonuses).toFixed(2)}`],
        ],
      });
      doc.save("Payroll_Summary_Report.pdf");
    } catch (error) {
      console.error('Error generating payroll summary report:', error);
      alert('Failed to generate payroll summary report');
    }
  };

  return (
    <div className="dashboard-container">
      <header className="header">
        <h1>Payroll Dashboard</h1>
      </header>

      {/* Search and Filter Section */}
      <section className="search-filter-section">
        <h2>Search & Filter</h2>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Search by employee or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        <div className="filter-container">
          <div className="filter-group">
            <label>Payment Status:</label>
            <select
              name="paymentStatus"
              value={filters.paymentStatus}
              onChange={handleFilterChange}
            >
              <option value="all">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Salary Range:</label>
            <input
              type="number"
              name="minSalary"
              placeholder="Min"
              value={filters.minSalary}
              onChange={handleFilterChange}
            />
            <span>to</span>
            <input
              type="number"
              name="maxSalary"
              placeholder="Max"
              value={filters.maxSalary}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label>Date Range:</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleFilterChange}
            />
            <span>to</span>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleFilterChange}
            />
          </div>

          <button className="reset-filters" onClick={resetFilters}>
            Reset Filters
          </button>
        </div>
      </section>

      {/* Results Count */}
      <div className="results-count">
        Showing {filteredPayrolls.length} of {payrolls.length} records
      </div>

      {/* Report Buttons Section */}
      <section className="report-buttons">
        <h2>Generate Reports</h2>
        <div className="buttons-container">
          <button className="report-button" onClick={generateEmployeeSalaryReport}>
            Employee Salary Report
          </button>
          <button className="report-button" onClick={generatePaymentStatusReport}>
            Payment Status Report
          </button>
          <button className="report-button" onClick={generateTotalPaymentsReport}>
            Total Payments Report
          </button>
          <button className="report-button" onClick={generatePayrollSummaryReport}>
            Payroll Summary Report
          </button>
        </div>
      </section>

      {/* Add Payroll Form */}
      <section className="add-payroll">
        <h2>Add Payroll</h2>
        <div className="form-container">
          <input
            type="text"
            name="employee"
            placeholder="Employee Name"
            value={newPayroll.employee}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="bonus"
            placeholder="Bonus"
            value={newPayroll.bonus}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="salary"
            placeholder="Salary"
            value={newPayroll.salary}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="date"
            placeholder="Date"
            value={newPayroll.date}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="paymentStatus"
            placeholder="Payment Status"
            value={newPayroll.paymentStatus}
            onChange={handleInputChange}
          />
          <button onClick={addPayroll}>Add Payroll</button>
        </div>
      </section>

      {/* Edit Payroll Form */}
      {editPayroll && (
        <section className="edit-payroll">
          <h2>Edit Payroll</h2>
          <div className="form-container">
            <input
              type="text"
              name="employee"
              placeholder="Employee Name"
              value={editPayroll.employee}
              onChange={(e) => setEditPayroll({ ...editPayroll, employee: e.target.value })}
            />
            <input
              type="text"
              name="bonus"
              placeholder="Bonus"
              value={editPayroll.bonus}
              onChange={(e) => setEditPayroll({ ...editPayroll, bonus: e.target.value })}
            />
            <input
              type="text"
              name="salary"
              placeholder="Salary"
              value={editPayroll.salary}
              onChange={(e) => setEditPayroll({ ...editPayroll, salary: e.target.value })}
            />
            <input
              type="text"
              name="date"
              placeholder="Date"
              value={editPayroll.date}
              onChange={(e) => setEditPayroll({ ...editPayroll, date: e.target.value })}
            />
            <input
              type="text"
              name="paymentStatus"
              placeholder="Payment Status"
              value={editPayroll.paymentStatus}
              onChange={(e) => setEditPayroll({ ...editPayroll, paymentStatus: e.target.value })}
            />
            <button onClick={updatePayroll}>Update Payroll</button>
            <button onClick={() => setEditPayroll(null)}>Cancel</button>
          </div>
        </section>
      )}

      {/* Recent Salary Transactions Table */}
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
            {filteredPayrolls.map((payroll, index) => (
              <tr key={index}>
                <td>{payroll.employee}</td>
                <td>{payroll.bonus}</td>
                <td>{payroll.salary}</td>
                <td>{payroll.date}</td>
                <td>
                  <span className={`status ${payroll.paymentStatus.toLowerCase()}`}>
                    {payroll.paymentStatus}
                  </span>
                </td>
                <td>
                  <button
                    className="payment-button"
                    onClick={() => handlePayment(payroll.employee)}
                    disabled={payroll.paymentStatus === "Paid"}
                  >
                    {payroll.paymentStatus === "Paid" ? "Paid" : "Pay Now"}
                  </button>
                  <button onClick={() => setPayrollToEdit(payroll)}>Edit</button>
                  <button onClick={() => deletePayroll(payroll._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* HR Manager Dashboard Navigation Button */}
      <button 
        className="hr-dashboard-button"
        onClick={() => navigate('/hr-profile')}
      >
        <i className="fas fa-users"></i> Back
      </button>
    </div>
  );
};

export default PayrollDashboard;