const express = require("express");
const router = express.Router();
//Insert Model
const Register = require("../Model/Register");
//Insert Payroll Controller
const RegisterController = require("../Controllers/RegisterControllers");

router.get("/:id",RegisterController.getById);

module.exports = router;