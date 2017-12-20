var mongoose = require("./mongoose");
var Schema = mongoose.mongoose.Schema;
var userSchema = new Schema({
	userID: String,
	address: String,
	gender:String,
	checkT:String,
	poiid:String
});
exports.usersData = mongoose.mongoose.model('userdatas', userSchema);
  