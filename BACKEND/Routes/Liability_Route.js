const express = require("express");
const router = express.Router();
const LiabilitiesController = require("../Controller/Liability_Ctrl");

// Get all liabilities (overdue payments)
router.get("/Fetch", LiabilitiesController.getAllLiabilities);

// Get liability by ID
router.get("/:id", LiabilitiesController.getLiabilityById);

// Update liability status to Paid
router.patch("/:id/status", LiabilitiesController.updateLiabilityStatus);

// Add notes to a liability
router.patch("/:id/notes", LiabilitiesController.addNotesToLiability);

module.exports = router;