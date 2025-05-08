// FilterUtils.js

/**
 * Filters transactions based on the selected filter type
 * @param {Array} transactions - The full list of transactions
 * @param {String} filterType - The filter to apply ('all', 'income', 'expense')
 * @returns {Array} Filtered transactions
 */
export const filterTransactions = (transactions, filterType) => {
    if (filterType === "all") return transactions;
    return transactions.filter(transaction => transaction.type === filterType);
  };
  
  /**
   * Calculates the current balance from a list of transactions
   * @param {Array} transactions - The list of transactions
   * @returns {Number} The calculated balance
   */
  export const calculateBalance = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      return transaction.type === "income" 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
  };
  
  /**
   * Formats a date object for display
   * @param {String} dateString - The date string to format
   * @returns {String} Formatted date string
   */
  export const formatDate = (dateString) => {
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  /**
   * Formats an amount for display without dollar signs
   * @param {Number} amount - The amount to format
   * @returns {String} Formatted amount string
   */
  export const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      currencyDisplay: "code"
    }).format(amount).replace("USD", "").trim();
  };
  
  /**
   * Gets the appropriate display text for a transaction type
   * @param {String} type - The transaction type ('income' or 'expense')
   * @returns {String} Display text for the transaction type
   */
  export const getTransactionTypeDisplay = (type) => {
    return type === "income" ? "Subscription Fee" : "Employee Salary";
  };