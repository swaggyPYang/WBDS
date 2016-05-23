var mongoose = require('./mongoose');
var Schema = mongoose.mongoose.Schema;
var point=new Schema({
	poiid:String,
	title:String,
	address:String,
	lon:Number,
	lat:Number,
	city:String,
	category_name:String,
	checkin_num:Number,
	photo_num:Number
})