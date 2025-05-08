// Controller/AssetCtrl.js
const AssetModel = require("../Models/AssetModel");

//Insert Data
const Insert_Assets = async(req,res,next) => {
    const { AssetName, AssetType, Quantity, PurchaseDate, Condition, EstimatedValue } = req.body;
    let Asset;
    try {
        Asset = new AssetModel({ AssetName, AssetType, Quantity, PurchaseDate, Condition, EstimatedValue });
        await Asset.save();
        return res.status(200).json({ Asset });
    } catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Error inserting asset." });
    }
}

//Display Entries
const getAll_Assets = async (req,res,next) => {
    let AssetEntries;
    try{
        AssetEntries = await AssetModel.find();
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error fetching assets." });
    }
    if(!AssetEntries){
        return res.status(404).json({message:"No Assets Available."});
    }
    return res.status(200).json({ AssetEntries });
};

//Get One Asset By ID
const getAsset_ById = async (req,res,next) => {
    const assetId = req.params.id;
    try {
        const asset = await AssetModel.findById(assetId);
        if (!asset) {
            return res.status(404).json({message:"Asset not found."});
        }
        return res.status(200).json({ asset });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching asset details." });
    }
};

//Update Asset
const update_Asset = async (req,res,next) => {
    const assetId = req.params.id;
    const { AssetName, AssetType, Quantity, PurchaseDate, Condition, EstimatedValue } = req.body;
    try {
        const asset = await AssetModel.findByIdAndUpdate(
            assetId, 
            { AssetName, AssetType, Quantity, PurchaseDate, Condition, EstimatedValue },
            { new: true }
        );
        if (!asset) {
            return res.status(404).json({message:"Asset not found."});
        }
        return res.status(200).json({ message: "Asset updated successfully", asset });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating asset." });
    }
};

//Delete Asset
const delete_Asset = async (req,res,next) => {
    const assetId = req.params.id;
    try {
        const asset = await AssetModel.findByIdAndDelete(assetId);
        if (!asset) {
            return res.status(404).json({message:"Asset not found."});
        }
        return res.status(200).json({ message: "Asset deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting asset." });
    }
};

// Get total value of assets
const getAssetsTotal = async (req, res, next) => {
  try {
    // Aggregate to sum the estimated value of all assets
    const assetTotal = await AssetModel.aggregate([
      { $group: { _id: null, totalValue: { $sum: "$EstimatedValue" } } }
    ]);
    
    // Return the total or 0 if there are no assets
    const totalValue = assetTotal.length > 0 ? assetTotal[0].totalValue : 0;
    
    return res.status(200).json({ totalValue });
  } catch (err) {
    console.error('Error calculating asset total:', err);
    return res.status(500).json({ message: 'Error calculating asset total' });
  }
};

exports.Insert_Assets = Insert_Assets;
exports.getAll_Assets = getAll_Assets;
exports.getAsset_ById = getAsset_ById;
exports.update_Asset = update_Asset;
exports.delete_Asset = delete_Asset;
exports.getAssetsTotal = getAssetsTotal;