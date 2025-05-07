import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

/**
 * Adds a standard header to a PDF document
 * @param {Object} doc - The jsPDF document instance
 * @param {String} title - The title to display in the header
 * @returns {Number} The Y position after the header
 */
const addPDFHeader = (doc, title) => {
  try {
    // Add FitnessPro main header with larger text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24); // Enlarged text size
    doc.text("FitnessPro", 14, 20);
    
    // Add date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 20);
    
    // Add a divider line
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);
    
    // Add "Assets Report" subheading below the line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(title || "Assets Report", 14, 35);
    
    return 45; // Return the Y position after the header and subheading
  } catch (error) {
    console.error("Error creating PDF header:", error);
    return 20; // Return default position if header fails
  }
};

// Utility function to generate PDF reports from asset data
export const generateAssetsPDF = (assets) => {
  try {
    // Validate assets data
    if (!assets || !Array.isArray(assets) || assets.length === 0) {
      console.error("Invalid assets data provided to PDF generator");
      return false;
    }
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add header and get the starting Y position for content
    const startY = addPDFHeader(doc, "Gym Assets Report");
    
    // Add summary information
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Assets: ${assets.length}`, 14, startY + 10);
    
    // Calculate total value safely
    const totalValue = assets.reduce((sum, asset) => {
      const value = parseFloat(String(asset.EstimatedValue).replace(/[^0-9.-]+/g, "") || 0);
      return sum + value;
    }, 0);
    
    doc.text(`Total Value: $${totalValue.toFixed(2)}`, 14, startY + 20);
    
    // Prepare table data with error handling
    const tableBody = assets.map(asset => {
      try {
        return [
          asset.AssetName || 'N/A',
          asset.AssetType || 'N/A',
          String(asset.Quantity || '0'),
          asset.PurchaseDate ? new Date(asset.PurchaseDate).toLocaleDateString() : 'N/A',
          asset.Condition || 'N/A',
          asset.EstimatedValue ? `$${parseFloat(String(asset.EstimatedValue).replace(/[^0-9.-]+/g, "") || 0).toFixed(2)}` : '$0.00'
        ];
      } catch (err) {
        console.error("Error formatting asset row:", err);
        return ['Error', 'Error', '0', 'Error', 'Error', '$0.00'];
      }
    });
    
    // Create table
    autoTable(doc, {
      head: [['Asset Name', 'Asset Type', 'Quantity', 'Purchase Date', 'Condition', 'Estimated Value']],
      body: tableBody,
      startY: startY + 30,
      styles: {
        fontSize: 10,
        cellPadding: 5
      },
      headStyles: {
        fillColor: [44, 62, 80], // --primary-color in RGB
        textColor: [255, 255, 255]
      }
    });
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, 105, 287, { align: "center" });
    }
    
    // Save the PDF document
    doc.save('gym_assets_report.pdf');
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
};

export default {
  generateAssetsPDF
};