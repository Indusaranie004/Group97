const express = require("express");
const router = express.Router();

const FM = require("../Models/StaffMember_Model");
const FMLogin_Ctrl = require("../Controller/FMSignUp_Ctrl");

//router.get("/",CashLog_Ctrl.getAll_CashEntries);
router.post("/",FMLogin_Ctrl.Insert_FM);
router.get("/",FMLogin_Ctrl.DisplayFM);

router.get("/:ID",FMLogin_Ctrl.getByID);
router.put("/:ID",FMLogin_Ctrl.UpdateFM);
router.delete("/:ID",FMLogin_Ctrl.DeleteFM);



module.exports = router;