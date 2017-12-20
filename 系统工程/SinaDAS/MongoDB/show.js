var mongoose = require('./mongoose');
var Schema = mongoose.mongoose.Schema;
var point = new Schema({
	poiid: String,
	category_n:String,
	title: String,
	poi_street: String,
	x: Number,
	y: Number
});
exports.getpoint = mongoose.mongoose.model('poi', point);