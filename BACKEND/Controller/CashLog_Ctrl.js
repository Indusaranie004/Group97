// Controller/CashLog_Ctrl.js
const CashLog = require("../Models/CashLog_Model");

//Display Entries
const getAll_CashEntries = async (req,res,next) => {
    let CashEntries;

    try{
        CashEntries = await CashLog.find();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error occurred while fetching cash entries."});
    }

    if(!CashEntries){
        return res.status(404).json({message:"Cash Log is Empty."});
    }

    return res.status(200).json({ CashEntries });
};

//Insert Data
const Insert_CashEntries = async(req,res,next) => {
    const {date, amount, transactionType, category, description, recordedBy} = req.body;

    let Cash;

    try{
        Cash = new CashLog({date, amount, transactionType, category, description, recordedBy});
        await Cash.save();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message: "Server error occurred while inserting cash entry."});
    }

    if(!Cash){
        return res.status(404).send({message:"Unable to insert cash entries."});
    }

    return res.status(200).json({Cash});
};

// Delete Cash Entry
const Delete_CashEntry = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const cashEntry = await CashLog.findById(id);
        
        if (!cashEntry) {
            return res.status(404).json({ message: "Cash entry not found." });
        }
        
        await CashLog.findByIdAndRemove(id);
        
        return res.status(200).json({ message: "Cash entry successfully deleted." });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error occurred while deleting cash entry." });
    }
};

// Get Cash Entry by ID
const Get_CashEntryById = async (req, res, next) => {
    const id = req.params.id;
    
    try {
        const cashEntry = await CashLog.findById(id);
        
        if (!cashEntry) {
            return res.status(404).json({ message: "Cash entry not found." });
        }
        
        return res.status(200).json({ cashEntry });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error occurred while fetching cash entry." });
    }
};

// Get income and expense summary by month (for financial dashboard)
const getCashSummaryByMonth = async (req, res, next) => {
  try {
    // Get current date
    const currentDate = new Date();
    
    // Calculate date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 5); // -5 to include current month (total 6 months)
    sixMonthsAgo.setDate(1); // Start of month
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    // Get all cash entries from the past 6 months
    const cashEntries = await CashLog.find({
      date: { $gte: sixMonthsAgo.toISOString().split('T')[0] } // Format to YYYY-MM-DD
    });
    
    // Process data for chart
    // Group by month and transaction type
    const monthlyData = {};
    
    cashEntries.forEach(entry => {
      // Parse date
      const entryDate = new Date(entry.date);
      const monthKey = `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: entryDate.toLocaleString('default', { month: 'short' }),
          year: entryDate.getFullYear(),
          income: 0,
          expense: 0
        };
      }
      
      // Sum by transaction type
      if (entry.transactionType.toLowerCase() === 'income') {
        monthlyData[monthKey].income += entry.amount;
      } else if (entry.transactionType.toLowerCase() === 'expense') {
        monthlyData[monthKey].expense += entry.amount;
      }
    });
    
    // Convert to array and sort by date
    const monthsArray = Object.values(monthlyData).sort((a, b) => {
      const dateA = new Date(`${a.year}-${a.month}-01`);
      const dateB = new Date(`${b.year}-${b.month}-01`);
      return dateA - dateB;
    });
    
    return res.status(200).json(monthsArray);
  } catch (err) {
    console.error('Error fetching cash summary by month:', err);
    return res.status(500).json({ message: 'Error fetching cash summary' });
  }
};

exports.getAll_CashEntries = getAll_CashEntries;
exports.Insert_CashEntries = Insert_CashEntries;
exports.Delete_CashEntry = Delete_CashEntry;
exports.Get_CashEntryById = Get_CashEntryById;
exports.getCashSummaryByMonth = getCashSummaryByMonth;