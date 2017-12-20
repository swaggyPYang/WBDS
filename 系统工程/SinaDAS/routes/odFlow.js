'use strict'
var flowDataModel = require('../mongoDB/oddatas.js');
var promise = require('promise');


exports.FlowServlet = function(req,res) { 
    var StartDate=req.body.StartDate;
    var StartTime=parseInt(req.body.StartTime);
    var StopTime=parseInt(req.body.StopTime);
    var filename=req.body.filename;    
    var userFlowStr="";
    function getdate(StartDate){
        // map function
        var map=function(){
            emit(this.userid,{poiid:this.poiid,time:this.time});
        };
        // reduce function
        var reduce=function(key,values){
            var result={userid:0,poiid:'',time:0}
            values.forEach(function(value){
            result.poiid+=value.poiid;
            result.time+=value.time;
            result.userid=key;
        });
        return result;
    };
    // mapreduce function
    return new promise(function(resolve, reject) {
        flowDataModel.oddatas.collection.mapReduce(map,reduce,{out:filename,
        query:{date:StartDate,time:{$gte:StartTime,$lte:StopTime}}
        },function(err,collection){
            if(err!==null){
                res.status(400).send('Error');
                console.log('I will not easily go die ,but I have err------'+err);
            }
            else{
                collection.find().toArray(function(err,collection){
                    if(err!==null){
                        res.status(400).send('Error');
                        console.log('I will not easily go die ,but I have err------'+err);
                    }
                    else{
                        for(var i=0;i<collection.length;i++){
                            userFlowStr += '{"userid":"'+collection[i]._id+'","poiid":"'+collection[i].value.poiid+'","time":"'+collection[i].value.time+'"},';
                            if(i===collection.length-1){
                                resolve(userFlowStr);
                    }}}
                });
                }
            });
        });
    }
    // 更改为json格式
    function getJson(flowdata) {
        var FlowJson = eval("(["+flowdata+"])");
        res.status(200).send(FlowJson);
    }
    getdate(StartDate).then(function(myflowdata) {
        getJson(myflowdata);
    });
}



