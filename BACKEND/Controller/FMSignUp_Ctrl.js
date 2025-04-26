const mongoose = require("mongoose");
const FinancialManager = require("../Models/StaffMember_Model");

// Display Entries
const DisplayFM = async (req, res, next) => {
    let FM;
    try {
        FM = await FinancialManager.find();
    } catch (err) {
        console.log(err);
    }

    if (!FM) {
        return res.status(404).json({ message: "Financial Manager not found." });
    }

    return res.status(200).json({ FM });
};

// Insert Data
const Insert_FM = async (req, res, next) => {
    const { FullName, Email, UserName, Password, PhoneNo, Role, Joined_Date } = req.body;
    let FM;
    try {
        FM = new FinancialManager({ FullName, Email, UserName, Password, PhoneNo, Role, Joined_Date });
        await FM.save();
    } catch (err) {
        console.log(err);
    }

    if (!FM) {
        return res.status(404).send({ message: "Unable to insert Data." });
    }

    return res.status(200).json({ FM });
};

// Update Data
const UpdateFM = async (req, res, next) => {
    const ID = req.params.ID;
    
    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).send({ message: "Invalid ID format" });
    }

    const { FullName, Email, UserName, Password, PhoneNo, Role, Joined_Date } = req.body;
    let FM;
    try {
        FM = await FinancialManager.findByIdAndUpdate(ID, { FullName, Email, UserName, Password, PhoneNo, Role, Joined_Date }, { new: true });
    } catch (err) {
        console.log(err);
    }

    if (!FM) {
        return res.status(404).send({ message: "Unable to update Data." });
    }

    return res.status(200).json({ FM });
};

// Get By ID
const getByID = async (req, res, next) => {
    const ID = req.params.ID;

    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).send({ message: "Invalid ID format" });
    }

    let FM;
    try {
        FM = await FinancialManager.findById(ID);
    } catch (err) {
        console.log(err);
    }

    if (!FM) {
        return res.status(404).send({ message: "User not found." });
    }

    return res.status(200).json({ FM });
};

// Delete Data
const DeleteFM = async (req, res, next) => {
    const ID = req.params.ID;

    // Validate if ID is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(ID)) {
        return res.status(400).send({ message: "Invalid ID format" });
    }

    let FM;
    try {
        FM = await FinancialManager.findByIdAndDelete(ID);
    } catch (err) {
        console.log(err);
    }

    if (!FM) {
        return res.status(404).send({ message: "Unable to delete." });
    }

    return res.status(200).json({ FM });
};

// Exports
exports.Insert_FM = Insert_FM;
exports.DisplayFM = DisplayFM;
exports.getByID = getByID;
exports.UpdateFM = UpdateFM;
exports.DeleteFM = DeleteFM;