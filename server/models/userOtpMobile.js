const mongoose = require("mongoose");
const validator = require("validator");

const userOtpSchemaMobile = new mongoose.Schema({
    pnumber:{
        type:Number,
        required:true,
        unique:true,
        
    },
    otp:{
        type:String,
        required:true
    }
});


// user otp model
const userotpmobile = new mongoose.model("userotpsmobile",userOtpSchemaMobile);
module.exports = userotpmobile