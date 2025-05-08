import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (transactions, balance) => {
  // Initialize PDF
  const doc = new jsPDF();
  
  // Format functions
  const formatDate = (dateString) => {
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  // Calculate summary data
  const incomeTotal = transactions
    .filter(t => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
    
  const expenseTotal = transactions
    .filter(t => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  
  // Add FitnessPro branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("FitnessPro", 14, 20);
  
  // Add horizontal line
  doc.setLineWidth(0.5);
  doc.line(10, 25, 200, 25);
  
  // Add report title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Bank Transactions Report", 14, 35);
  
  // Add date at top right
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 20);
  
  // Add summary
  doc.setFontSize(12);
  doc.text(`Total Transactions: ${transactions.length}`, 14, 45);
  doc.text(`Total Income: $${formatAmount(incomeTotal)}`, 14, 55);
  doc.text(`Total Expenses: $${formatAmount(expenseTotal)}`, 14, 65);
  doc.text(`Current Balance: $${formatAmount(balance)}`, 14, 75);
  
  // Define table columns and style
  const tableColumn = ["Date & Time", "Type", "Amount", "Payment Method", "Card Name"];
  
  // Convert transaction data to table rows
  const tableRows = transactions.map(transaction => {
    const formattedAmount = `${transaction.type === "income" ? "+" : "-"} $${formatAmount(transaction.amount)}`;
    
    return [
      formatDate(transaction.timestamp),
      transaction.type === "income" ? "Subscription Fees" : "Employee Salary",
      formattedAmount,
      transaction.paymentMethod || "Card",
      transaction.cardName || "N/A"
    ];
  });
  
  // Generate the table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 85,
    styles: { 
      fontSize: 10,
      cellPadding: 5
    },
    headStyles: {
      fillColor: [44, 62, 80], // --primary-color in RGB
      textColor: [255, 255, 255]
    },
    columnStyles: {
      0: { cellWidth: 40 }, // Date & Time
      1: { cellWidth: 35 }, // Type
      2: { cellWidth: 30 }, // Amount
      3: { cellWidth: 35 }, // Payment Method
      4: { cellWidth: 35 }  // Card Name
    },
    didDrawCell: (data) => {
      // Color income/expense cells - only if we have row data and it's the amount column
      if (data.column.index === 2 && data.section === "body" && 
          data.row.index !== undefined && tableRows[data.row.index]) {
        const cellValue = tableRows[data.row.index][2]; // Get the formatted amount cell
        if (cellValue && cellValue.startsWith("+")) {
          doc.setTextColor(26, 188, 156); // teal color (--accent-color) for income
        } else if (cellValue && cellValue.startsWith("-")) {
          doc.setTextColor(231, 76, 60); // red color (--warning-color) for expense
        }
      }
    },
    didParseCell: (data) => {
      // Reset text color after each cell
      doc.setTextColor(0, 0, 0);
    }
  });
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
  }
  
  // Save the PDF
  doc.save("bank-transactions-report.pdf");
};

// Button component
const PDFGenerator = ({ transactions, balance }) => {
  return (
    <button 
      onClick={() => generatePDF(transactions, balance)}
      className="pdf-button"
    >
      Generate PDF
    </button>
  );
};

export default PDFGenerator;