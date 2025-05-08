const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FMLogin = new Schema({

    UserName:{

        type:String,
        required:true

    },

    Password:{

        type:String,
        required:true

    },

});

module.exports = mongoose.model("FMLogin_Session",FMLogin);