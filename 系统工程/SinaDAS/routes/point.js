'use strict'
var pointmodel = require('../mongoDB/show.js');

exports.getpoint = function(req, res) {
	var poi = req.body.poi;
	var sina = req.body.sina;
	var user = req.body.user;
	console.log(poi+sina+user);
	if (poi == "true") {
		pointmodel.getpoint.find({},function(err, data) {
			var tagStr = "";
			if (err != null) {
				res.status(400).send('Error');
			} else {
				for (let i = 0; i < data.length; i++) {
					tagStr += '{"poiid":"' + data[i].toObject().poiid + '","category_n":"' + data[i].toObject().category_n + '","title":"' + data[i].toObject().title + '","poi_street":"' + data[i].toObject().poi_street + '","x":"' + data[i].toObject().x + '","y":"' + data[i].toObject().y + '"},'
					}
				tagStr = '[' + tagStr + ']';
				res.status(200).send(tagStr);
				console.log("1");
			};
		})
	}else if(sina=="true"){

	}else if(user =="true"){

	}
}