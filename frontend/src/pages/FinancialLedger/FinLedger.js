import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FinLedger.css";
import PDFGenerator from "./PDFGenerator";
import { 
  filterByCategory, 
  calculateTotals, 
  formatDate, 
  formatAmount 
} from "./FilterUtils";

const CashLogEntries = () => {
  const [cashEntries, setCashEntries] = useState([]);
  const [paymentTransactions, setPaymentTransactions] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  useEffect(() => {
    // Apply filters and calculate totals whenever entries or filters change
    if (cashEntries.length > 0 || paymentTransactions.length > 0) {
      // Combine both transaction types
      const allTransactions = [...cashEntries, ...paymentTransactions];
      
      // Sort by date (newest first)
      allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));
      
      // Apply category filter
      const filtered = filterByCategory(allTransactions, categoryFilter);
      
      // Calculate totals
      const totals = calculateTotals(filtered);
      setTotalIncome(totals.income);
      setTotalExpense(totals.expense);
      setBalance(totals.balance);
      
      setFilteredEntries(filtered);
    }
  }, [cashEntries, paymentTransactions, categoryFilter]);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      // Fetch cash entries
      const cashRes = await axios.get("http://LocalHost:5001/CashLog/Fetch", {
        headers: {
          "x-auth-token": token
        }
      });
      
      // Fetch payment transactions
      const paymentRes = await axios.get("http://LocalHost:5001/Payment/transactions", {
        headers: {
          "x-auth-token": token
        }
      });
      
      // Add source field to cash entries
      const cashWithSource = cashRes.data.CashEntries.map(entry => ({
        ...entry,
        source: "cash"
      }));
      
      // Format payment transactions to match cash structure
      const formattedPayments = paymentRes.data.map(payment => ({
        _id: payment._id,
        date: payment.timestamp || new Date().toISOString(),
        amount: payment.amount,
        transactionType: payment.type || "expense",
        // Map payment type to specific category
        category: payment.type === "income" ? "Subscription Payment" : "Employee Salary",
        description: payment.cardName ? `Card Payment (${payment.cardName})` : "Card Payment",
        source: "card"
      }));
      
      setCashEntries(cashWithSource);
      setPaymentTransactions(formattedPayments);
      
      // Extract unique categories from both sources
      const allTransactions = [...cashWithSource, ...formattedPayments];
      const uniqueCategories = [...new Set(allTransactions.map(entry => entry.category))];
      setCategories(uniqueCategories);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError("Failed to fetch transactions");
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-state">Loading financial ledger...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="cashlog-container">
      <h2 className="cashlog-header">Financial Ledger</h2>
      
      <div className="filter-section">
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="categoryFilter">Filter by Category: </label>
            <select
              id="categoryFilter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="summary-section">
          <div className="summary-item income">
            <span>Total Income:</span>
            <span>{formatAmount(totalIncome)}</span>
          </div>
          <div className="summary-item expense">
            <span>Total Expense:</span>
            <span>{formatAmount(totalExpense)}</span>
          </div>
          <div className="summary-item balance">
            <span>Balance:</span>
            <span>{formatAmount(balance)}</span>
          </div>
        </div>
        
        <div className="pdf-button">
          <PDFGenerator
            data={filteredEntries}
            totals={{ income: totalIncome, expense: totalExpense, balance: balance }}
            title="Financial Ledger Report"
          />
        </div>
      </div>

      {filteredEntries.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <table className="cashlog-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Source</th>
              <th>Category</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry) => (
              <tr key={`${entry.source}-${entry._id}`} className={`source-${entry.source}`}>
                <td>
                  <div className="entry-date">{formatDate(entry.date)}</div>
                </td>
                <td>{entry.source === "card" ? "Card" : "Cash"}</td>
                <td>{entry.category}</td>
                <td>{entry.transactionType}</td>
                <td className={entry.transactionType.toLowerCase() === "income" ? "income-amount" : "expense-amount"}>
                  {formatAmount(entry.amount)}
                </td>
                <td>{entry.description || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CashLogEntries;