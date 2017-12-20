'use strict'
//多天数据提取生成json文件
var userDataModel = require('../mongoDB/usercheck.js');
var promise = require('promise');

exports.userInformation = function(req,res) { 
    var dat=req.body.date;
    var name=req.body.name;
    var userStr="";
    function getdate(dat){
        // map function
        var map=function(){
            emit(this.poiid,{count:1,date:this.date});

        };
        // reduce function
        var reduce=function(key,values){
            var result={poiid:0,count:0,date:0}
            values.forEach(function(value){
            result.count+=value.count;
            result.date=value.date;
            result.poiid=key;
        });
        return result;
    };
    // mapreduce function
    return new promise(function(resolve, reject) {
        userDataModel.checkData.collection.mapReduce(map,reduce,{
        query:{ date: dat },out:name,keeptemp:true
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
                            userStr += '{"poiid":"'+collection[i]._id+'","count":"'+collection[i].value.count+'","date":"'+collection[i].value.date+'"},';
                            if(i===collection.length-1){
                                resolve(userStr);
                    }}}
                });
                }
            });
        });
    }
    // 更改为json格式
    function getJson(datas) {
        var userJson = eval("(["+datas+"])");
        res.status(200).send(userJson);
    }
       
    getdate(dat).then(function(mydata) {
        getJson(mydata);
    });
}

//每周HMD分析数据
exports.userInformation = function(req,res) { 
    var dat=req.body.date;
    var filename=req.body.filename;
    var userStr="";
    function getdate(dat){
        // map function
        var map=function(){
            emit(this.poiid,{count:1,date:this.date,time:this.time});

        };
        // reduce function
        var reduce=function(key,values){
            var result={poiid:0,count:0,date:0}
            values.forEach(function(value){
            result.count+=value.count;
            result.date=value.date;
            result.time=value.time;
            result.poiid=key;
        });
        return result;
    };
    // mapreduce function
    return new promise(function(resolve, reject) {
        userDataModel.checkData.collection.mapReduce(map,reduce,{out:filename,
        query:{ date: dat }
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
                            userStr += '{"poiid":"'+collection[i]._id+'","count":"'+collection[i].value.count+'","date":"'+collection[i].value.date+'","time":"'+collection[i].value.time+'"},';
                            if(i===collection.length-1){
                                resolve(userStr);
                    }}}
                });
                }
            });
        });
    }
    // 更改为json格式
    function getJson(datas) {
        var userJson = eval("(["+datas+"])");
        res.status(200).send(userJson);
    }
       
    getdate(dat).then(function(mydata) {
        getJson(mydata);
    });

}

// 每天动态变化专题图分析数据
exports.DynamicInfosservlet = function(req,res) { 
    var StartDate=req.body.StartDate;
    var StartTime=parseInt(req.body.StartTime);
    var EndTime=parseInt(req.body.EndTime);
    console.log(StartTime);
    var filename=req.body.filename;    
    var userDynamicStr="";
    function getdate(StartDate){
        // map function
        var map=function(){
            emit(this.poiid,{count:1,date:this.date});

        };
        // reduce function
        var reduce=function(key,values){
            var result={poiid:0,count:0,date:0}
            values.forEach(function(value){
            result.count+=value.count;
            result.date+=value.date;
            result.poiid=key;
        });
        return result;
    };
    // mapreduce function
    return new promise(function(resolve, reject) {
        userDataModel.checkData.collection.mapReduce(map,reduce,{out:filename,
        query:{ date:StartDate,time:{$gte:StartTime,$lte:EndTime}}
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
                            userDynamicStr += '{"poiid":"'+collection[i]._id+'","count":"'+collection[i].value.count+'","date":"'+collection[i].value.date+'"},';
                            if(i===collection.length-1){
                                resolve(userDynamicStr);
                    }}}
                });
                }
            });
        });
    }
    // 更改为json格式
    function getJson(dydatas) {
        var userJson = eval("(["+dydatas+"])");
        res.status(200).send(userJson);
    }
       
    getdate(StartDate).then(function(mydata) {
        getJson(mydata);
    });
}

// 性别动态专题图
exports.GenderInformation = function(req,res) { 
    var StartDate=req.body.StartDate;
    var StartTime=parseInt(req.body.StartTime);
    var EndTime=parseInt(req.body.EndTime);
    console.log(StartTime);
    var sexType=req.body.sexType;
    var filename=req.body.filename;    
    var userGenderStr="";
    function getdate(StartDate){
        // map function
        var map=function(){
            emit(this.poiid,{count:1,date:this.date});

        };
        // reduce function
        var reduce=function(key,values){
            var result={poiid:0,count:0,date:0}
            values.forEach(function(value){
            result.count+=value.count;
            result.date+=value.date;
            result.poiid=key;
        });
        return result;
    };
    // mapreduce function
    return new promise(function(resolve, reject) {
        userDataModel.checkData.collection.mapReduce(map,reduce,{out:filename,
        query:{ date:StartDate,time:{$gte:StartTime,$lte:EndTime},gender:sexType}
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
                            userGenderStr += '{"poiid":"'+collection[i]._id+'","count":"'+collection[i].value.count+'","date":"'+collection[i].value.date+'"},';
                            if(i===collection.length-1){
                                resolve(userGenderStr);
                    }}}
                });
                }
            });
        });
    }
    // 更改为json格式
    function getJson(dydatas) {
        var userJson = eval("(["+dydatas+"])");
        res.status(200).send(userJson);
    }
       
    getdate(StartDate).then(function(mydata) {
        getJson(mydata);
    });
}

// 年龄动态专题图
exports.ageInformation = function(req,res) { 
    var StartDate=req.body.StartDate;
    var StartTime=parseInt(req.body.StartTime);
    var EndTime=parseInt(req.body.EndTime);
    console.log(StartTime);
    var ageStart=parseInt(req.body.ageStart);
    var ageEnd=parseInt(req.body.ageEnd);
    var filename=req.body.filename;    
    var useraAgeStr="";
    function getdate(StartDate){
        // map function
        var map=function(){
            emit(this.poiid,{count:1,date:this.date});

        };
        // reduce function
        var reduce=function(key,values){
            var result={poiid:0,count:0,date:0}
            values.forEach(function(value){
            result.count+=value.count;
            result.date+=value.date;
            result.poiid=key;
        });
        return result;
    };
    // mapreduce function
    return new promise(function(resolve, reject) {
        userDataModel.checkData.collection.mapReduce(map,reduce,{out:filename,
        query:{ date:StartDate,time:{$gte:StartTime,$lte:EndTime},age:{$gte:ageStart,$lte:ageEnd}}
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
                            useraAgeStr += '{"poiid":"'+collection[i]._id+'","count":"'+collection[i].value.count+'","date":"'+collection[i].value.dates+'"},';
                            if(i===collection.length-1){
                                resolve(useraAgeStr);
                    }}}
                });
                }
            });
        });
    }
    // 更改为json格式
    function getJson(dydatas) {
        var userJson = eval("(["+dydatas+"])");
        res.status(200).send(userJson);
    }
       
    getdate(StartDate).then(function(mydata) {
        getJson(mydata);
    });
}
