const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const payrollSchema = new Schema({
    employee: {
         type: String, //dataType
         required: true,  // validate
         }, 
    bonus: {
         type: String,
         required: true,
         },
    salary: {
         type: String,
         required: true ,
        },
    date: {
         type: String, 
        required: true ,
    },
    paymentStatus: {
         type: String, 
         required: true,
         }
});

module.exports = mongoose.model(
    "PayrollModel", //file name
    payrollSchema //function name
)