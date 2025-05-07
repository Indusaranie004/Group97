const express = require("express");
const controller = require("../Controller/FMSignUp_Ctrl");

const router = express.Router();

router.post("/Insert", controller.signup);

module.exports = router;