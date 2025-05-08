const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CashSchema = new Schema({

    date:{

        type:String,
        required:true
    },
    amount:{

        type:Number,
        required:true

    },
    transactionType:{

        type:String,
        required:true

    },
    category:{

        type:String,
        required:true

    },
    description:{

        type:String,
        required:false

    },
    
});

module.exports = mongoose.model("Cash", CashSchema);