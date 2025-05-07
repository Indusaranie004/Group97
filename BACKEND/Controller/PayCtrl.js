const Payment = require("../Models/PayModel");
const { v4: uuidv4 } = require("uuid");

// Process payment and save to database
exports.processPayment = async (req, res) => {
  try {
    const { amount, paymentMethod, cardName, lastFourDigits, billingAddress, type } = req.body;
    
    // Basic validation
    if (!amount || !paymentMethod || !cardName || !lastFourDigits || !billingAddress) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    // Generate transaction ID
    const transactionId = uuidv4();
    
    // Create and save payment
    const payment = new Payment({
      amount,
      paymentMethod,
      cardName,
      lastFourDigits,
      billingAddress,
      type: type || 'expense',
      status: 'completed',
      transactionId
    });
    
    await payment.save();
    
    return res.status(200).json({ 
      success: true, 
      transactionId: payment.transactionId,
      message: 'Payment processed successfully'
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Payment processing failed' 
    });
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find()
      .sort({ timestamp: -1 })
      .select('-__v');
      
    return res.status(200).json(payments);
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching payment history' 
    });
  }
};

// Get transactions for bank transactions page
exports.getTransactions = async (req, res) => {
  try {
    const { type } = req.query; // 'income', 'expense', or null for all
    
    let query = {};
    if (type) {
      query = { type };
    }
    
    const transactions = await Payment.find(query)
      .sort({ timestamp: -1 })
      .select('-__v');
    
    return res.status(200).json(transactions);
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching transactions' 
    });
  }
};

// Get transaction by ID
exports.getTransactionById = async (req, res) => {
  try {
    const transaction = await Payment.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }
    
    return res.status(200).json(transaction);
  } catch (error) {
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Error fetching transaction' 
    });
  }
};

// Delete transaction
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Payment.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ 
        success: false,
        message: 'Transaction not found' 
      });
    }
    
    await Payment.findByIdAndRemove(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Transaction deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || 'Error deleting transaction' 
    });
  }
};