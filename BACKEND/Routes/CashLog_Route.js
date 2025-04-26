const express = require("express");
const router = express.Router();

const CashLog = require("../Models/CashLog_Model");
const CashLog_Ctrl = require("../Controller/CashLog_Ctrl");

router.get("/",CashLog_Ctrl.getAll_CashEntries);
router.post("/",CashLog_Ctrl.Insert_CashEntries);

module.exports = router;