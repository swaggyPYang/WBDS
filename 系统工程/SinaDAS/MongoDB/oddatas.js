var mongoose = require('./mongoose');
var Schema = mongoose.mongoose.Schema;
var flowSchema = new Schema({
	userid:String,	
	poiid:String,
	x:String,
	y:String,
	time:String,
	date:String	
});
exports.oddatas = mongoose.mongoose.model('oddata', flowSchema);