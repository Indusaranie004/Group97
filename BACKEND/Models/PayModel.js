const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  amount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true,
    enum: ['credit', 'debit'] 
  },
  cardName: { 
    type: String, 
    required: true 
  },
  lastFourDigits: { 
    type: String, 
    required: true 
  },
  billingAddress: { 
    type: String, 
    required: true 
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
    default: 'expense'
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'completed', 'failed']
  },
  transactionId: { 
    type: String, 
    required: true,
    unique: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);