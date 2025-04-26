const AssetModel = require("../Models/Liabilities_Model");

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
    }

    if(!AssetEntries){

        return res.status(404).json({message:"No Assets Available."});


    }

    return res.status(200).json({ AssetEntries });

};

exports.Insert_Assets = Insert_Assets;
exports.getAll_Assets = getAll_Assets;