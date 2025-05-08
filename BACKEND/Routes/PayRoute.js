const express = require("express");
const router = express.Router();
const paymentController = require("../Controller/payCtrl");
const auth = require("../Middleware/PaymentAuth");

// Payment routes
router.post("/Insert", paymentController.processPayment);
router.get("/", paymentController.getPaymentHistory);

// Bank transactions routes
router.get("/transactions", auth, paymentController.getTransactions);
router.get("/transaction/:id", auth, paymentController.getTransactionById);
router.delete("/transaction/:id", auth, paymentController.deleteTransaction);

module.exports = router;