var showpoint = require('./MongoDB/show.js');
var a = showpoint.show.findone({
                            poiid: "B2094753D069AAFC459C"
                        })
                        .exec();
console.log("a="+a);