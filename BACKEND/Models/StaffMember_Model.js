const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FinancialManager = new Schema({
    FullName: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true
    },
    UserName: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    PhoneNo: {
        type: String,
        required: true
    },
    Role: {
        type: String,
        required: true
    },
    Joined_Date: {
        type: String,
        required: true
    },
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true
    }
});

module.exports = mongoose.model("StaffMember", FinancialManager);