const CashLog = require("../Models/CashLog_Model");

//Display Entries
const getAll_CashEntries = async (req,res,next) => {

    let CashEntries;

    try{

        CashEntries = await CashLog.find();

    }

    catch(err){

        console.log(err);
    }

    if(!CashEntries){

        return res.status(404).json({message:"Cash Log is Empty."});


    }

    return res.status(200).json({ CashEntries });

};

//Insert Data
const Insert_CashEntries = async(req,res,next) => {

    const {date, amount, transactionType, category, description, recordedBy} = req.body;

    let Cash;

    try{

        Cash = new CashLog({date, amount, transactionType, category, description, recordedBy});
        await Cash.save();

    }

    catch(err){

        console.log(err);

    }

    if(!Cash){

        return res.status(404).send({message:"Unable to insert cash entries."});
    }

    return res.status(200).json({Cash});


}

exports.getAll_CashEntries = getAll_CashEntries;
exports.Insert_CashEntries = Insert_CashEntries;