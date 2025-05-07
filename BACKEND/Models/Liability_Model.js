const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const liabilitySchema = new Schema({
    payrollId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PayrollModel',
        required: true
    },
    employee: {
        type: String,
        required: true
    },
    amount: {
        type: String,
        required: true
    },
    dueDate: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Overdue",
        enum: ["Overdue", "Paid"]
    },
    notes: {
        type: String,
        default: ""
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("LiabilityModel", liabilitySchema);