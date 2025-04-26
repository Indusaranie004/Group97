const express = require("express");
const router = express.Router();

const AssetCtrl = require("../Controller/Liabilities_Ctrl");

router.post("/", AssetCtrl.Insert_Assets);
router.get("/",AssetCtrl.getAll_Assets);

module.exports = router;