// FilterUtils.js
export const filterByCategory = (entries, categoryFilter) => {
  if (!categoryFilter || categoryFilter === "all") return entries;
  return entries.filter(
    entry => entry.category.toLowerCase() === categoryFilter.toLowerCase()
  );
};

export const calculateTotals = (entries) => {
  let incomeTotal = 0;
  let expenseTotal = 0;
  
  entries.forEach(entry => {
    if (entry.transactionType.toLowerCase() === "income") {
      incomeTotal += Number(entry.amount);
    } else if (entry.transactionType.toLowerCase() === "expense") {
      expenseTotal += Number(entry.amount);
    }
  });
  
  return {
    income: incomeTotal,
    expense: expenseTotal,
    balance: incomeTotal - expenseTotal
  };
};

export const formatDate = (dateString) => {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric"
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};