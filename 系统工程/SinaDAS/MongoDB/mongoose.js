var mongoose=require("mongoose");
mongoose.connect(process.env.DB_HOST);
console.log("Mongodb is run on :" + process.env.DB_HOST);
exports.mongoose=mongoose;