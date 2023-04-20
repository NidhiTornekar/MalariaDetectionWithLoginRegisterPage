const mongoose = require("mongoose");
const DB = process.env.DATABASE;

mongoose.connect(DB,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(()=>console.log("MongoDB Connection successful"))
.catch((error)=>{
    console.log("error",error);
})