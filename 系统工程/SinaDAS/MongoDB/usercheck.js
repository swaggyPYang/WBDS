var mongoose = require('./mongoose');
var Schema = mongoose.mongoose.Schema;
var userSchema = new Schema({
	userID: String,	
	age:String,
	gender:String,
	x:String,
	y:String,
	date:String,
	time:String,
	checkInTime:String,
	poiid:String
});
exports.checkData = mongoose.mongoose.model('checkin', userSchema);