const express = require("express");
const router = express.Router();

const AssetCtrl = require("../Controller/AssetCtrl");

router.post("/", AssetCtrl.Insert_Assets);
router.get("/", AssetCtrl.getAll_Assets);
router.get("/:id", AssetCtrl.getAsset_ById);
router.put("/:id", AssetCtrl.update_Asset);
router.delete("/:id", AssetCtrl.delete_Asset);

module.exports = router;