const express = require("express");
const router = express.Router();
//Insert Model
const Payroll = require("../Model/PayrollModel");
//Insert Payroll Controller
const PayrollController = require("../Controllers/PayrollControllers");

router.get("/",PayrollController.getAllPayrolls);
router.post("/",PayrollController.addPayrolls);
router.get("/:id",PayrollController.getById);
router.put("/:id",PayrollController.updatePayroll);
router.delete("/:id",PayrollController.deletePayroll);


//export
module.exports = router;
