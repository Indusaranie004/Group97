import React from "react";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const PDFGenerator = ({ data, totals, title }) => {
  const generatePDF = () => {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Add header with FitnessPro branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("FitnessPro", 14, 20);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
    
    // Add report title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title || "Financial Ledger Report", 14, 35);
    
    // Add date at top right
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 20);
    
    // Format currency with $ sign
    const formatCurrency = (amount) => {
      return `$${new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount)}`;
    };
    
    // Add totals
    doc.setFontSize(12);
    
    if (title === "Liabilities Report") {
      // For liabilities report
      const totalAmount = data.reduce((sum, liability) => {
        const salary = parseFloat(liability.salary.replace(/[^0-9.-]+/g, "") || 0);
        const bonus = parseFloat(liability.bonus.replace(/[^0-9.-]+/g, "") || 0);
        return sum + salary + bonus;
      }, 0);
      
      doc.text(`Total Overdue Payments: ${data.length}`, 14, 45);
      doc.text(`Total Amount: ${formatCurrency(totalAmount)}`, 14, 55);
      
      // Prepare table columns for liabilities
      const tableColumns = ['Employee', 'Salary', 'Bonus', 'Due Date', 'Total Amount'];
      
      // Prepare table rows for liabilities
      const tableRows = data.map((liability) => {
        const salary = parseFloat(liability.salary.replace(/[^0-9.-]+/g, "") || 0);
        const bonus = parseFloat(liability.bonus.replace(/[^0-9.-]+/g, "") || 0);
        const total = salary + bonus;
        
        return [
          liability.employee,
          formatCurrency(salary),
          formatCurrency(bonus),
          liability.date,
          formatCurrency(total)
        ];
      });
      
      // Add table to document
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 65,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [44, 62, 80], // --primary-color in RGB
          textColor: [255, 255, 255]
        }
      });
    } else {
      // For financial ledger report
      doc.text(`Total Income: ${formatCurrency(totals.income)}`, 14, 45);
      doc.text(`Total Expense: ${formatCurrency(totals.expense)}`, 14, 55);
      doc.text(`Balance: ${formatCurrency(totals.balance)}`, 14, 65);
      
      // Prepare table columns for financial ledger
      const tableColumns = ["Date", "Source", "Category", "Type", "Amount", "Description"];
      
      // Format date
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
      };
      
      // Prepare table rows for financial ledger
      const tableRows = data.map((entry) => [
        formatDate(entry.date),
        entry.source === "card" ? "Card" : "Cash",
        entry.category,
        entry.transactionType,
        entry.transactionType.toLowerCase() === "income" 
          ? formatCurrency(entry.amount) 
          : formatCurrency(entry.amount),
        entry.description || "N/A"
      ]);
      
      // Add table to document
      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 75,
        styles: {
          fontSize: 10,
          cellPadding: 5
        },
        headStyles: {
          fillColor: [44, 62, 80], // --primary-color in RGB
          textColor: [255, 255, 255]
        }
      });
    }
    
    // Save the PDF
    const filename = title 
      ? title.toLowerCase().replace(/\s+/g, '-') + '.pdf'
      : 'financial-report.pdf';
    
    doc.save(filename);
  };

  return (
    <button onClick={generatePDF} className="pdf-button">
      Generate PDF
    </button>
  );
};

// Additional function for generating assets PDF
PDFGenerator.generateAssetsPDF = (assets) => {
  try {
    const doc = new jsPDF();
    
    // Add header with FitnessPro branding
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("FitnessPro", 14, 20);
    
    // Add horizontal line
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
    
    // Add report title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Gym Assets Report", 14, 35);
    
    // Add date at top right
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 20);
    
    // Add summary
    doc.setFontSize(12);
    doc.text(`Total Assets: ${assets.length}`, 14, 45);
    
    // Calculate total value
    const totalValue = assets.reduce((sum, asset) => {
      const value = parseFloat(asset.EstimatedValue) || 0;
      return sum + value;
    }, 0);
    
    doc.text(`Total Value: $${totalValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`, 14, 55);
    
    // Prepare table columns
    const tableColumns = [
      'Asset Name', 
      'Asset Type', 
      'Quantity', 
      'Purchase Date', 
      'Condition', 
      'Estimated Value'
    ];
    
    // Prepare table data
    const tableRows = assets.map(asset => [
      asset.AssetName,
      asset.AssetType,
      asset.Quantity,
      new Date(asset.PurchaseDate).toLocaleDateString(),
      asset.Condition,
      `$${parseFloat(asset.EstimatedValue).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`
    ]);
    
    // Add table to document
    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 65,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [44, 62, 80], // --primary-color in RGB
        textColor: [255, 255, 255]
      }
    });
    
    // Save the PDF
    doc.save('gym-assets-report.pdf');
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export default PDFGenerator;