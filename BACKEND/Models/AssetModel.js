const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Assets = new Schema({
    AssetName: {
        type: String,
        required: true
    },
    AssetType: {
        type: String,
        required: true
    },
    Quantity: {
        type: Number,
        required: true
    },
    PurchaseDate: {
        type: Date,  // Changed from String to Date
        required: true
    },
    Condition: {
        type: String,
        required: true
    },
    EstimatedValue: {
        type: Number,
        required: true,
        min: [0, 'Estimated value must be a positive number']  // Added validation
    },
});

module.exports = mongoose.model("Asset", Assets);