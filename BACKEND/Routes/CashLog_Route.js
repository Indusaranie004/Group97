const express = require("express");
const router = express.Router();

const CashLog_Ctrl = require("../Controller/CashLog_Ctrl");
const auth = require("../Middleware/PaymentAuth");  // Assuming you have auth middleware

// Get all cash entries
router.get("/Fetch", CashLog_Ctrl.getAll_CashEntries);

// Get cash entry by ID
router.get("/:id", CashLog_Ctrl.Get_CashEntryById);

// Insert new cash entry
router.post("/", CashLog_Ctrl.Insert_CashEntries);

// Delete cash entry
router.delete("/:id", CashLog_Ctrl.Delete_CashEntry);

module.exports = router;