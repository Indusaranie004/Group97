import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BankTransactions.css";
import PDFGenerator from "./PDFGenerator";
import { 
  filterTransactions, 
  calculateBalance, 
  formatDate, 
  formatAmount,
  getTransactionTypeDisplay
} from "./FilterUtil";

const BankTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [filter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const queryParams = filter !== "all" ? `?type=${filter}` : "";
      
      const res = await axios.get(`http://localhost:5001/Payment/transactions${queryParams}`, {
        headers: {
          "x-auth-token": token
        }
      });
      
      setTransactions(res.data);
      setBalance(calculateBalance(res.data));
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch transactions");
      setLoading(false);
    }
  };

  const filteredTransactions = filterTransactions(transactions, filter);

  if (loading) return <div className="loading-state">Loading transactions...</div>;
  if (error) return <div className="error-state">{error}</div>;

  return (
    <div className="transactions-container">
      <h2 className="transactions-header">Bank Transactions</h2>
      
      <div className="filter-section">
        <div>
          <label htmlFor="filter">Filter by: </label>
          <select 
            id="filter" 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Transactions</option>
            <option value="income">Subscription Fees</option>
            <option value="expense">Employee Salaries</option>
          </select>
        </div>
        
        <div className="balance-display">
          <span>Current Balance: {formatAmount(balance)}</span>
        </div>
        
        <div className="pdf-button">
          <PDFGenerator 
            transactions={filteredTransactions} 
            balance={balance} 
          />
        </div>
      </div>

      {filteredTransactions.length === 0 ? (
        <div className="empty-state">No transactions found</div>
      ) : (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Card Name</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>
                  <div className="transaction-date">{formatDate(transaction.timestamp)}</div>
                </td>
                <td>{getTransactionTypeDisplay(transaction.type)}</td>
                <td className={transaction.type === "income" ? "income" : "expense"}>
                  {transaction.type === "income" ? "+" : "-"} {formatAmount(transaction.amount)}
                </td>
                <td>{transaction.paymentMethod}</td>
                <td>{transaction.cardName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BankTransactions;