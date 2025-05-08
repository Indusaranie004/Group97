const express = require("express");
const controller = require("../Controller/FMLogin_Ctrl");

const router = express.Router();

router.post("/login", controller.login);

module.exports = router;