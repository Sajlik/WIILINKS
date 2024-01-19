const mongoose = require("mongoose");
const connectDB=mongoose.connect("mongodb://127.0.0.1:27017/Wiilinks")

connectDB
         .then(()=>console.log("Database connected"))
         .catch((err)=>console.log(err.message));