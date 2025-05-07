const Liability = require("../Models/Liability_Model");
const Payroll = require("../Models/PayrollModel");

// Get all liabilities (overdue payments)
const getAllLiabilities = async (req, res, next) => {
    try {
        // First, get all payrolls with overdue status
        const overduePayrolls = await Payroll.find({ paymentStatus: "Overdue" });
        
        // Check if any overdue payrolls exist
        if (!overduePayrolls || overduePayrolls.length === 0) {
            return res.status(200).json({ 
                message: "No overdue payments found",
                liabilities: [] 
            });
        }
        
        // Return the overdue payrolls as liabilities
        return res.status(200).json({ liabilities: overduePayrolls });
    } catch (err) {
        console.error("Error fetching liabilities:", err);
        return res.status(500).json({ message: "Failed to fetch liabilities", error: err.message });
    }
};

// Get liability by ID
const getLiabilityById = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const liability = await Payroll.findById(id);
        
        if (!liability) {
            return res.status(404).json({ message: "Liability not found" });
        }
        
        return res.status(200).json({ liability });
    } catch (err) {
        console.error("Error fetching liability by ID:", err);
        return res.status(500).json({ message: "Failed to fetch liability", error: err.message });
    }
};

// Update liability status to Paid
const updateLiabilityStatus = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        // Update the payroll's status to "Paid"
        const updatedPayroll = await Payroll.findByIdAndUpdate(
            id,
            { paymentStatus: "Paid" },
            { new: true }
        );
        
        if (!updatedPayroll) {
            return res.status(404).json({ message: "Liability not found" });
        }
        
        return res.status(200).json({ 
            message: "Liability marked as paid",
            updatedLiability: updatedPayroll 
        });
    } catch (err) {
        console.error("Error updating liability status:", err);
        return res.status(500).json({ message: "Failed to update liability", error: err.message });
    }
};

// Add notes to a liability
const addNotesToLiability = async (req, res, next) => {
    const id = req.params.id;
    const { notes } = req.body;
    
    if (!notes) {
        return res.status(400).json({ message: "Notes are required" });
    }
    
    try {
        // Here we're assuming you'd extend PayrollModel with a notes field
        // Otherwise, you'd need to use the separate LiabilityModel
        const updatedPayroll = await Payroll.findByIdAndUpdate(
            id,
            { notes },
            { new: true }
        );
        
        if (!updatedPayroll) {
            return res.status(404).json({ message: "Liability not found" });
        }
        
        return res.status(200).json({ 
            message: "Notes added to liability",
            updatedLiability: updatedPayroll 
        });
    } catch (err) {
        console.error("Error adding notes to liability:", err);
        return res.status(500).json({ message: "Failed to add notes", error: err.message });
    }
};

module.exports = {
    getAllLiabilities,
    getLiabilityById,
    updateLiabilityStatus,
    addNotesToLiability
};