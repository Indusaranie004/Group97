const express = require("express");
const router = express.Router();

const FM_LoginSession = require("../Models/FMLogin_Model");
const FMLogin_Ctrl = require("../Controller/FMLogin_Ctrl");

//router.get("/",CashLog_Ctrl.getAll_CashEntries);
router.post("/insert", FMLogin_Ctrl.Insert_LoginSession);
router.post("/FinMngSignIn", FMLogin_Ctrl.Validate_FinancialManager);

module.exports = router;