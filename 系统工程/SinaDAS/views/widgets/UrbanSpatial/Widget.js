/**
 * Created by Administrator on 2016/3/24 0024.
 * 819行因测试改为数字，最后改回来！
 * 分析前的判断未加，
 * 
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/parser',
        'dojo/query',
        'dojo/dom',
        'jimu/BaseWidget',
        "esri/tasks/query",
        "esri/tasks/QueryTask",
        "dojo/topic",
        'jimu/WidgetManager',
        "dojo/_base/event",
        "dojo/on",
        //GP服务工具
        "esri/tasks/FeatureSet",

        "esri/tasks/Geoprocessor",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleFillSymbol",
        "esri/Color",
        "esri/layers/GraphicsLayer",
        "dojo/dom-construct",
        "esri/renderers/SimpleRenderer",
        "esri/renderers/ClassBreaksRenderer",
        "esri/dijit/LayerSwipe",
        'dijit/form/HorizontalSlider',
        "esri/toolbars/edit",
        "esri/layers/FeatureLayer",
        "dojo/domReady!"
    ],
    function(declare,lang,parser,query, dom,BaseWidget, Query, QueryTask, topic,WidgetManager,event, on, FeatureSet, Geoprocessor,
        SimpleLineSymbol, SimpleMarkerSymbol, SimpleFillSymbol, Color, GraphicsLayer,domConstruct, SimpleRenderer,ClassBreaksRenderer, LayerSwipe,
        HorizontalSlider,Edit,FeatureLayer) {

        return declare([BaseWidget], {
            baseClass: 'UrbanSpatial',
            name: 'UrbanSpatial',
            widgetsInTemplate : true,
            GpResultLayer1: null,

            // 双时段卷帘
            SwipeLayer:null,

            // 一天内时间滑块
            GpGRResultLayer1:null,
            GpGRResultLayer2:null,
            GpGRResultLayer3:null,
            GpGRResultLayer4:null,
            GpGRResultLayer5:null,
            GpGRResultLayer6:null,
            GpGRResultLayer7:null,
            GpGRResultLayer7:null,
            TimeSlider:null,

            activeRegisonLayer1:null,

            postCreate: function() {
                this.inherited(arguments);

                console.log("运行");
            },
            startup: function() {
                var self=this;
                parser.parse();
                this.inherited(arguments);
                this.initLayout();

                //一天内时间滑块 
                 this.TimeSlider = new  HorizontalSlider({
                    name: "时间轴",
                    value: 1,
                    minimum: 0,
                    maximum: 8,
                    discreteValues:9,
                    intermediateChanges: true,
                    style: "width:100%;",
                    onChange: function(value){      
                    switch(value)
                    {
                    case 1:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer1);
                        break;
                    case 2:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer2);
                        break;
                    case 3:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer3);
                        break;
                    case 4:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer4);
                        break;
                    case 5:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer5);
                        break;
                    case 6:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer6);
                        break;
                    case 7:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer7);
                    case 8:
                    self.DYcleanMap();
                    self.Display(GpGRResultLayer8);
                        break;     
                    default:
                    }                               
                 }
                }, "LayerTimeSlider").startup();
            },
            //初始化
            initLayout: function() {
                var area=document.getElementById('area');
                var line=document.getElementById('line');
                var point=document.getElementById('point');

                area.style.display="block";line.style.display="none";
                point.style.display="none"
                Date.prototype.format = function(format) {
                    var o = {
                    "M+": this.getMonth() + 1, //month
                    "d+": this.getDate(), //day
                    "h+": this.getHours(), //hour
                    "m+": this.getMinutes(), //minute
                    "s+": this.getSeconds(), //second
                    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
                    "S": this.getMilliseconds() //millisecond
                    };
                    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
                    (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                    for (var k in o)
                    if (new RegExp("(" + k + ")").test(format))
                    format = format.replace(RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] :
                    ("00" + o[k]).substr(("" + o[k]).length));
                return format;
                };
            },

            onOpen: function() {
                WidgetManager. getInstance().closeWidget('_35');
                console.log("onopen UrbanSpatial");
            },

            onClose: function() {
                console.log("onclose UrbanSpatial");
            },

            group: function() {
                //分组分析，获取数据，调用KGroup的GP服务
                //将日期转换为String类型，方便查询数据库
                var self = this;
                self.map.graphics.clear();

                var overData = dijit.byId('areastartDate').get('value');
                var date = new Date(overData);
                var newdate = new Date(date).format("yyyy/M/d");

                var groupnum = dijit.byId('groupunmb').get('value');

                var topic_Admps = topic.subscribe("some/topic_Kgroup_isDone", function(e) {
                    if (e[0] === "Kgroup" && e[1] === '1') {
                        var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(false);
                        var graphic = new GraphicsLayer();
                        var features = GpResultLayer1.value.features;
                        for (var f = 0, fl = features.length; f < fl; f++) {
                            graphic.add(features[f]);
                        }

                        var renderer = new SimpleRenderer(new SimpleMarkerSymbol("circle", 7).setOutline(new SimpleLineSymbol().setWidth(0.1).setColor(new Color('#FFF200'))));
                        renderer.setColorInfo({
                            field: "SS_GROUP",
                            minDataValue: 0,
                            maxDataValue: 100,
                            colors: [
                                new Color("#3FAB00"),
                                new Color("#91D400"),
                                new Color("#BBE600"),
                                new Color("#D1ED00"),
                                new Color('#FFF200'),
                                new Color('#FFBF00'),
                                new Color('#FF8000'),
                                new Color("#FF0000")
                            ]
                        });
                        graphic.renderer = renderer;
                        console.log(graphic);
                        self.map.addLayer(graphic);

                        var jobstatus = "[任务]"+"Kgroup"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "K均值聚类图层添加成功";
                    } else {
                        var jobstatus = "[任务]Kgroup:结果图层添加失败...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                    }
                    dojo.unsubscribe(topic_Admps);
                });
                this.startGp(newdate, "group", groupnum);
            },

            startGp: function(checkindate, name, groupnum) {
                var userdate = checkindate;
                var dataname = name;
                var gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/Kmearngroup/GPServer/Kgroup");
                gp.setOutputSpatialReference({
                    wkid: 102100
                });
                var self = this;
                //获取该时间的userpoi数据
                var getuserPoi = dojo.xhrPost({
                    url: "/userInformation",
                    postData: {
                        name: dataname,
                        date: userdate
                    },
                    timeout: 50000,
                    handleAs: "json"
                });
                getuserPoi.then(function(response) {
                    var Json = eval(response);
                    console.log(Json);
                    var jsonNew = "";
                    var poiid = '';
                    for (var i = 0; i < Json.length; i++) {
                        if (i !== parseInt(Json.length) - 1) {
                            poiid += "'" + Json[i].poiid + "',";
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count) + ",";
                        } else {
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count);
                            poiid += "'" + Json[i].poiid + "'";
                        }
                    }
                    var Date = "{" + jsonNew + "}";
                    var JsonDate = eval("(" + Date + ")");
                    var feature;
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["poiid", "checkin_nu", "x", "y", "TARGET_FID"];
                    query.where = "poiid IN (" + poiid + ")";
                    var URL = "http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(URL);
                    // var layer=self.map.getLayer("poiPoint"); 
                    // layer.queryFeatures

                    queryTask.execute(query, function(res) {
                        feature = res.features;
                        for (var i = 0; i < feature.length; i++) {
                            var poiid = feature[i].attributes.poiid;
                            var data = JsonDate[poiid];
                            feature[i].attributes.checkin_nu = data;
                        }
                        var featureSet = new FeatureSet();
                        featureSet.features = feature;
                        var group = groupnum;
                        var params = {
                            'input': featureSet,
                            'groupnum': group
                        };
                        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                    });
                });
                //成功的回调
                function gpJobComplete(jobinfo) {
                    gp.getResultData(jobinfo.jobId, "output", function(layer) {
                        this.GpResultLayer1 = layer;
                        topic.publish("some/topic_Kgroup_isDone", ['Kgroup', '1']);
                    });
                }
                //失败的回调，运行失败则调用此函数
                function gpJobFailed(error) {
                    self.startGp(userdate, "group", groupnum);
                }
                //如果有需要，也可以在运行过程的函数中获取其运行状态
                function gpJobStatus(jobinfo) {
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+"Kgroup"+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+"Kgroup"+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+"Kgroup"+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;   
                            console.log('esriJobSucceeded');
                            break;
                    }
                }
            },

            //修改区界
            changeDeploy: function() {
                alert("改变区界");
                var clusters = this.map.getLayer("clusters");
                clusters.setVisibility(false);
                var editToolbar = new Edit(this.map);
                var DeployArea = new FeatureLayer("http://219.231.176.20:6080/arcgis/rest/services/sinaData/sinadata/FeatureServer/2", {
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["*"],
                    id: "DeployArea"
                });
                this.map.addLayers([DeployArea]);
                //编辑结束后提交
                editToolbar.on("deactivate", function(evt) {
                    if (evt.info.isModified) {
                        if (confirm("是否提交修改？")) {
                            DeployArea.applyEdits(null, [evt.graphic], null);
                        }
                    }
                });
                var editingEnabled = false;
                DeployArea.on("dbl-click", function(evt) {

                    event.stop(evt);
                    if (editingEnabled) {
                        editingEnabled = false;
                        editToolbar.deactivate();
                        DeployArea.clearSelection();
                    } else {
                        editingEnabled = true;
                        editToolbar.activate(Edit.EDIT_VERTICES, evt.graphic);
                        // select the feature to prevent it from being updated by map navigation
                        var query = new Query();
                        query.objectIds = [evt.graphic.attributes[DeployArea.objectIdField]];
                        DeployArea.selectFeatures(query);
                    }
                });
            },

            //保存区界
            updataDeploy: function() {
                alert("保存区界");
                this.ChangeDeploy = true;
                this.map.graphics.clear();
                var clusters = this.map.getLayer("clusters");
                clusters.setVisibility(true);
                try {
                    var DeployArea = this.map.getLayer("DeployArea");
                    this.map.removeLayer(DeployArea);
                } catch (e) {
                    // TODO: handle exception
                }
            },
            // 统计活动频率及动态变化
            activeRegison:function(){
                var self=this;
                var map=this.map;
                self.map.graphics.clear();
                
                var activeRegisonData =dijit.byId('activeRegisonDate').get('value');
                var date = new Date(activeRegisonData); 
                var dateGroup=[];
                for(var i=0;i<7;i++){
                    var newdate = new Date(date).format("yyyy/M/d");
                    dateGroup[i]=newdate;
                    date = new Date(date.setDate(date.getDate()+1));  //获取七天日期数组
                }
                console.log(dateGroup);

                var topic_activeRegison = topic.subscribe("some/topic_activeRegison_isDone",function(e){
                    if(e[0]==="getactiveRegison"&&e[1]==='1'){
                        // self.displayResult(activeRegisonLayer1);
                        var jobstatus="[任务]"+"getactiveRegison"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                    }else{
                        var jobstatus = "[任务]"+"getactiveRegison"+":结果图层添加失败...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        }
                    dojo.unsubscribe(topic_activeRegison);    
                    
                });

                this.activeRegisonGp('getactiveRegison','1',dateGroup);

                on(dojo.byId('clearactiveRegisonDate'),'click',function(){
                    dojo.unsubscribe(topic_activeRegison);

                    map.graphics.clear();
                    map.removeLayer(activeRegisonLayer1);
                    activeRegisonLayer1=null;
                    dom.byId('resultLayer1').innerHTML = "";
                });
            },

            activeRegisonGp:function(ID,layerid,date){
                var self=this;
                var aID=ID;
                var aLayerid=layerid;
                var adate=date;
                var activeNum = dijit.byId('activeNum').get('value');
                console.log(activeNum);
                var gp=new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/activeRegion/GPServer/activeRegion");
                gp.setOutputSpatialReference({wkid:102100});

                var jobstatus = "[任务]"+aID+":正在查询...";
                dom.byId('stateBack'),innerHTML = jobstatus;
                var activeRegisonresult = dojo.xhrPost({
                    url:"/workuserInformation",
                    postData:{
                        date:adate,
                        name:aID
                    },
                    timeout:50000,
                    handleAs:"json"
                });
                activeRegisonresult.then(function(response) {
                    var Json = eval(response);
                    console.log(Json);
                    var poiid = '';
                    var jsonNew='';
                    for (var i = 0; i < Json.length; i++) {
                        if (i !== parseInt(Json.length) - 1) {
                            poiid += "'" + Json[i].poiid + "',";
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count) + ",";
                        } else {
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count);
                            poiid += "'" + Json[i].poiid + "'";
                        }
                    }
                    var Date = "{" + jsonNew + "}";
                    var JsonDate = eval("(" + Date + ")")
                    var feature;

                    var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(url);
                    var query = new Query();
                    query.returnGeometry=true;
                    query.outFields=["poiid","checkin_nu","unitAreaNum"];
                    query.where="poiid IN ("+poiid+")";
                    queryTask.execute(query,function(res){
                        feature=res.features;
                        console.log('feature');
                        for(var i=0;i<feature.length;i++){
                            var poiid=feature[i].attributes.poiid;
                            var data=JsonDate[poiid];
                            feature[i].attributes.checkin_nu=data;
                        }
                        featureSet = new FeatureSet();
                        console.log(feature);   
                        featureSet.features = feature;
                        var params = {"poiPoint":featureSet};
                        console.log(params);
                        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                    })
                    return response;
                });

                function gpJobComplete(jobinfo){
                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(false);
                    self.map.graphics.clear();
                    gp.getResultData(jobinfo.jobId,"countRegion__4_",function(layer){
                        console.log(layer);
                        switch(aLayerid)
                        {
                        case "1":
                        activeRegisonLayer1 = layer;
                        displayResult(activeRegisonLayer1);
                        console.log(activeRegisonLayer1); 
                            break;
                        default:
                        
                        }
                       topic.publish("some/topic_activeRegison_isDone", [ID,layerid]);
                    });                      
                }

                function displayResult(layer){
                    var symbol;
                    var features = layer.value.features;
                    console.log(features);
                    for(var f=0,f1=features.length;f<f1;f++){
                        var feature = features[f];
                        var number = parseFloat(features[f].attributes.unitAreaNum).toFixed(2);
                        console.log(number);
                        if(number<50){

                        }
                    else if(number<100){
                         symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#3FAB00"));
                    }else if(number<150){
                         symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#91D400"));
                    }else if (number<200){
                         symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#BBE600"));
                    }else if (number<250){
                        symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#D1ED00"));
                    }else if (number<300){
                        symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#FFBF00"));
                    }else if (number>350){
                        symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#FF0000"));
                    }
                    feature.setSymbol(symbol);
                    self.map.graphics.add(feature);
                    }
                }
                function gpJobStatus(jobinfo){
                    var self=this;
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+ID+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+ID+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+ID+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                    dom.byId('stateBack').innerHTML = jobstatus;
                }

                function gpJobFailed(error){
                    self.activeRegisonGp(ID,layerid,date);
                    // alert("运行出错！！");
                    dom.byId('stateBack').innerHTML = "[任务]"+ID+"";
                }
            },

            //道路总体路况启动
            starRoad: function() {
                var roadmap = dijit.byId('roadmap').get('checked');
                var allroadmap = dijit.byId('allroadmap').get('checked');
                var self = this;
                self.map.graphics.clear();

                var linestartDate = dijit.byId('linestartDate').get('value');
                var date = new Date(linestartDate);
                var lineDate = new Date(date).format("yyyy/M/d");
                var topic_Admps = topic.subscribe("some/topic_road_isDone", function(e) {
                    if (e[0] === "roadmap" && e[1] === '1') {
                        var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(false);
                        var symbol;
                        var features = GpResultLayer1.value.features;
                        for (var f = 0, fl = features.length; f < fl; f++) {
                            var feature = features[f];
                            var num = features[f].attributes.checkin_nu;

                            if (num === 'null' || num <= 2) {
                                symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#3FAB00"));
                            } else if (num < 4) {
                                symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#91D400"));
                            } else if (num < 6) {
                                symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#BBE600"));
                            } else if (num < 8) {
                                symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#D1ED00"));
                            } else if (num < 10) {
                                symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#FFBF00"));
                            } else if (num > 10) {
                                symbol = new SimpleFillSymbol(
                                    SimpleFillSymbol.STYLE_SOLID,
                                    new SimpleLineSymbol(
                                        SimpleLineSymbol.STYLE_SOLID,
                                        new Color("#FFF200"), 0.1
                                    ),
                                    new Color("#FF0000"));
                            }
                            feature.setSymbol(symbol);
                            self.map.graphics.add(feature);
                        }
                        // var jobstatus = "[任务]Kgroup:结果图层添加成功...";
                        // dom.byId('stateBack').innerHTML = jobstatus;
                    } else if (e[0] === "allroadmap" && e[1] === '1') {
                        // var jobstatus = "[任务]Kgroup:结果图层添加失败...";
                        // dom.byId('stateBack').innerHTML = jobstatus;
                        let clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(false);
                        let symbol;
                        let features = GpResultLayer1.value.features;
                        for (let f = 0, fl = features.length; f < fl; f++) {
                            let feature = features[f];
                            let num = features[f].attributes.checkin_nu;
                            if (num === 'null' || num <= 2) {
                                symbol = new SimpleLineSymbol({
                                    color: new Color("#3FAB00"),
                                    width: 1,
                                    style: "solid"
                                });
                            } else if (num < 4) {
                                symbol = new SimpleLineSymbol({
                                    color: new Color("#91D400"),
                                    width: 1,
                                    style: "solid"
                                });
                            } else if (num < 6) {
                                symbol = new SimpleLineSymbol({
                                    color: new Color("#BBE600"),
                                    width: 1,
                                    style: "solid"
                                });
                            } else if (num < 8) {
                                symbol = new SimpleLineSymbol({
                                    color: new Color("#D1ED00"),
                                    width: 1,
                                    style: "solid"
                                });
                            } else if (num < 10) {
                                symbol = new SimpleLineSymbol({
                                    color: new Color("#FFBF00"),
                                    width: 1,
                                    style: "solid"
                                });
                            } else if (num > 10) {
                                symbol = new SimpleLineSymbol({
                                    color: new Color("#FF0000"),
                                    width: 1,
                                    style: "solid"
                                });
                            }
                            feature.setSymbol(symbol);
                            self.map.graphics.add(feature);
                        }
                    } else {
                        var jobstatus = "结果图层添加失败...";
                        // dom.byId('stateBack').innerHTML = jobstatus;
                    }
                    dojo.unsubscribe(topic_Admps);
                });
                this.startRoadGp(lineDate, roadmap, allroadmap);
                on(this.cleanRoadmap, "click", function() {
                    dojo.unsubscribe(topic_Admps);
                    self.map.graphics.clear();
                    self.map.removeLayer(GpResultLayer1);
                    GpResultLayer1 = null;

                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(true);
                });
            },

            //道路总体路况分析
            startRoadGp: function(linedate, roadmap, allroadmap) {
                var gp;
                var dataname;
                var self = this;
                var road;
                var query;
                var queryTask;
                if (roadmap) {
                    gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/road/GPServer/road");
                    dataname = 'roadmap';
                    query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["FID_beijin"];
                    query.where = "1=1";
                    query.outSpatialReference = {
                        wkid: 102100
                    };
                    queryTask = new QueryTask('http://219.231.176.20:6080/arcgis/rest/services/sinaData/sinadata/FeatureServer/1');
                    queryTask.execute(query, function(res) {
                        road = res.features;
                    });
                } else if (allroadmap) {
                    gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/allroad/GPServer/allroad");
                    dataname = 'allroadmap';
                    query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["widthroad"];
                    query.where = "1=1";
                    queryTask = new QueryTask('http://219.231.176.20:6080/arcgis/rest/services/sinaData/sinadata/FeatureServer/0');
                    queryTask.execute(query, function(res) {
                        road = res.features;
                    });
                }
                gp.setOutputSpatialReference({
                    wkid: 102100
                });
                var getuserPoi = dojo.xhrPost({
                    url: "/userInformation",
                    postData: {
                        name: dataname,
                        date: linedate
                    },
                    timeout: 50000,
                    handleAs: "json"
                });
                getuserPoi.then(function(response) {
                    var Json = eval(response);
                    var jsonNew = "";
                    var poiid = '';
                    for (var i = 0; i < Json.length; i++) {
                        if (i !== parseInt(Json.length) - 1) {
                            poiid += "'" + Json[i].poiid + "',";
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count) + ",";
                        } else {
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count);
                            poiid += "'" + Json[i].poiid + "'";
                        }
                    }
                    var Date = "{" + jsonNew + "}";
                    var JsonDate = eval("(" + Date + ")");
                    var feature;
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["poiid", "checkin_nu", "x", "y", "TARGET_FID"];
                    query.where = "poiid IN (" + poiid + ")";
                    // query.where = "1=1"; 
                    var URL = "http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(URL);
                   

                    queryTask.execute(query, function(res) {
                        feature = res.features;
                        for (var i = 0; i < feature.length; i++) {
                            var poiid = feature[i].attributes.poiid;
                            var data = JsonDate[poiid];
                            feature[i].attributes.checkin_nu = data;
                        }

                        var featureSet = new FeatureSet();
                        featureSet.features = feature;
                        var roadline = new FeatureSet();
                        roadline.features = road;
                        var params = {
                            "inputroad": roadline,
                            "inputpoi": featureSet
                        };
                        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                    });
                });

                function gpJobComplete(jobinfo) {
                    gp.getResultData(jobinfo.jobId, "outputroad", function(layer) {
                    this.GpResultLayer1 = layer;
                    topic.publish("some/topic_road_isDone", [dataname, '1']);
                    });
                }
                //失败的回调，运行失败则调用此函数
                function gpJobFailed(error) {
                    self.startRoadGp(linedate, roadmap, allroadmap);
                }
                //如果有需要，也可以在运行过程的函数中获取其运行状态
                function gpJobStatus(jobinfo) {
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+"roadAnalysis"+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+"roadAnalysis"+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+"roadAnalysis"+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                }
            },

            //单时段道路路况分析
            starhourRoad: function() {
                var self=this;
                var map=this.map;
                self.map.graphics.clear();

                var linestartDate = dijit.byId('hourRoadDate').get('value');
                var date = new Date(linestartDate);
                var hourDate = new Date(date).format("yyyy/M/d");
                var startHour = dijit.byId('hourRoadTerminal').get('value');
                var endHour = dijit.byId('hourRoadToTerminal').get('value');
                console.log(startHour);
                console.log(endHour);

                //监听
                var topic_Admps = topic.subscribe("some/topic_hourRoad_isDone", function(e){
                    if(e[0]==="hourRoadlayer" && e[1]==='1'){
                        map.graphics.clear();
                        self.Display(GpGRResultLayer1);
                        var jobstatus = "[任务]"+"hourRoadlayer"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        }else{
                            var jobstatus = "[任务]"+"hourRoadlayer"+":结果图层添加失败...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            }
                        dojo.unsubscribe(topic_Admps);    
                });

                this.startHourGp("hourRoadlayer","1",hourDate, startHour, endHour);

                on(dojo.byId('cleanHourmap'),'click',function(){      
                dojo.unsubscribe(topic_Admps);
                            
                map.graphics.clear();
                map.removeLayer(GpGRResultLayer1);
                GpGRResultLayer1 = null;
                dom.byId('resultLayer1').innerHTML = "clearing map...";
                });
            },

            //双时段道路路况分析
            douhourRoad:function(){
                var self = this;
                var map=this.map;
                self.map.graphics.clear();
    
                var linedouDate = dijit.byId('datedouHourroadOne').get('value');
                var dounewDate = new Date(linedouDate);
                var douDate= new Date(dounewDate).format("yyyy/M/d");
                var doudynamicOneTime =dijit.byId('douHourroadone').get('value');
                var doudynamicTwoTime =dijit.byId('douHourroadtwo').get('value');
                doudynamicOneTime = doudynamicOneTime.split('-');  //分割字符串为数组
                doudynamicTwoTime = doudynamicTwoTime.split('-');

                var douStartDateStringA = douDate;
                var douStartTimeStringA = doudynamicOneTime[0];
                var douEndTimeStringA = doudynamicOneTime[1];
                        
                var douStartDateStringB = douDate;
                var douStartTimeStringB = doudynamicTwoTime[0];
                var douEndTimeStringB = doudynamicTwoTime[1];

                //监听
                var topic_DoubleTime = topic.subscribe("some/topic_DoubleTime_isDone", function(e){
                    if(e[0]==="douhourRoadlayer" && e[1]==='1'){
                        var jobstatus = "[任务]"+"DouA"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "对比图层A生成成功";
                    }else if(e[0]==="douhourRoadlayer" && e[1]==='2'){
                        var jobstatus = "[任务]"+"DouB"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "对比图层B生成成功";
                        }
                });


                this.startHourGp("douhourRoadlayer",'1',douStartDateStringA,douStartTimeStringA,douEndTimeStringA);                
                this.startHourGp("douhourRoadlayer",'2',douStartDateStringB,douStartTimeStringB,douEndTimeStringB);

                on(dojo.byId('layercompare'),'click',function(){
                     
                    var symbol = new SimpleLineSymbol();
                    symbol.setColor(new Color([0, 0, 0, 0]),0.0001);

                    var renderer = new ClassBreaksRenderer(symbol, "checkin_nu");
                    renderer.addBreak(0, 1, new SimpleFillSymbol().setColor(new Color([56, 168, 0, 1]),0.001));
                    renderer.addBreak(1, 2, new SimpleFillSymbol().setColor(new Color([139, 209, 0, 1]),0.001));
                    renderer.addBreak(2, 3, new SimpleFillSymbol().setColor(new Color([255, 255, 0, 1]),0.001));
                    renderer.addBreak(3, 5, new SimpleFillSymbol().setColor(new Color([255, 128, 0, 1]),0.001));
                    renderer.addBreak(5, Infinity, new SimpleFillSymbol().setColor(new Color([255, 0, 0, 1]),0.001));
                    
                    var graphic = new GraphicsLayer();
                    var features = GpGRResultLayer1.value.features;
                    for (var f = 0, fl = features.length; f < fl; f++) {
                        graphic.add(features[f]);
                    }
                    graphic.renderer = renderer;
                    map.addLayer(graphic);  
                    var graphictwo = new GraphicsLayer();
                    var featurestwo = GpGRResultLayer2.value.features;
                    for (var f = 0, fl = featurestwo.length; f < fl; f++) {
                        graphictwo.add(featurestwo[f]);
                    }
                    graphictwo.renderer = renderer;
                    map.addLayer(graphictwo);  
                    // 创建卷帘 
                    var father = dom.byId("map");
                    domConstruct.create("div",{id: "swipeDiv"},father, "after");
                            
                    layerSwipe = new LayerSwipe({
                        type: "vertical",
                        top: 250,
                        map: self.map,
                        layers:[graphictwo]
                    }, "swipeDiv");
                    layerSwipe.startup();
                });

                // 清除对比图层
                on(dojo.byId('cleanDouHourmap'),'click',function(){      
                    dojo.unsubscribe(topic_DoubleTime);

                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(true);
                            
                    map.graphics.clear();
                    map.removeLayer(this.GpGRResultLayer1);
                    map.removeLayer(this.GpGRResultLayer2);
                    GpGRResultLayer1 = null;
                    GpGRResultLayer2 = null;
                    layerSwipe.destroy();
                    layerSwipe = null;
                    dom.byId('resultLayer1').innerHTML = "";
                    dom.byId('resultLayer2').innerHTML = "";

                });
             },

             //全时段
             allhourRoad:function(){
                var self = this;
                var map=this.map;
                self.map.graphics.clear();

                var lineallDate = dijit.byId('datedayRoad').get('value');    
                var allnewDate = new Date(lineallDate);
                var allnDate= new Date(allnewDate).format("yyyy/M/d");
                console.log(allnDate);

                var topic_allhourTime = topic.subscribe("some/topic_allhourTime_isDone",function(e){
                    if(e[0]==="allhourTimeLayer" && e[1]==='1'){
                        var jobstatus = "[任务]"+"allhourTimeLayer1"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "第1时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer1);  
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='2'){
                        var jobstatus = "[任务]"+"allhourTimeLayer2"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "第2时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer2);
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='3'){
                        var jobstatus = "[任务]"+"allhourTimeLayer3"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer3').innerHTML = "第3时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer3);
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='4'){
                        var jobstatus = "[任务]"+"allhourTimeLayer4"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer4').innerHTML = "第4时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer4);
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='5'){
                        var jobstatus = "[任务]"+"allhourTimeLayer5"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer5').innerHTML = "第5时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer5);
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='6'){
                        var jobstatus = "[任务]"+"allhourTimeLayer6"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer6').innerHTML = "第6时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer6);
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='7'){
                        var jobstatus = "[任务]"+"allhourTimeLayer7"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer7').innerHTML = "第7时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer7);
                    }else if(e[0]==="allhourTimeLayer" && e[1]==='8'){
                        var jobstatus = "[任务]"+"allhourTimeLayer8"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer8').innerHTML = "第8时段数据生成成功";
                            
                        map.addLayer(GpGRResultLayer8);
                    }
                }); 

                this.startHourGp("allhourTimeLayer",'1',allnDate,0,300);               
                this.startHourGp("allhourTimeLayer",'2',allnDate,300,600);
                this.startHourGp("allhourTimeLayer",'3',allnDate,600,900);
                this.startHourGp("allhourTimeLayer",'4',allnDate,900,1200);
                this.startHourGp("allhourTimeLayer",'5',allnDate,1200,1500);
                this.startHourGp("allhourTimeLayer",'6',allnDate,1500,1800);
                this.startHourGp("allhourTimeLayer",'7',allnDate,1800,2100);
                this.startHourGp("allhourTimeLayer",'8',allnDate,2100,2400);  

                //清除图层
                on(dojo.byId('cleanAllhourLayer'),'click',function(){
                    dojo.unsubscribe(topic_allhourTime);

                    map.graphics.clear();
                    map.removeLayer(GpGRResultLayer1);
                    map.removeLayer(GpGRResultLayer2);
                    map.removeLayer(GpGRResultLayer3);
                    map.removeLayer(GpGRResultLayer4);
                    map.removeLayer(GpGRResultLayer5);
                    map.removeLayer(GpGRResultLayer6);
                    map.removeLayer(GpGRResultLayer7);
                    map.removeLayer(GpGRResultLayer8);
                    GpGRResultLayer1 = null;
                    GpGRResultLayer2 = null;
                    GpGRResultLayer3 = null;
                    GpGRResultLayer4 = null;
                    GpGRResultLayer5 = null;
                    GpGRResultLayer6 = null;
                    GpGRResultLayer7 = null;
                    GpGRResultLayer8 = null;

                    query(".resultLayer").forEach(function(node){
                        node.innerHTML = ".....";
                    })

                    var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);

                    this.TimeSlider.setValue(parseInt(0));
                });         
             },

            //主要道路（高速）道路路况分析
            startHourGp: function(Description,Layernum,hourdate,starthour,endhour) {
                var self=this;
                var gpID = Description;
                var gpLayerNum = Layernum;
                var ghourdate = hourdate;
                var gstarthour = starthour;
                var gendhour = endhour;
                console.log(gendhour);

                var getuserPoi = dojo.xhrPost({
                    url: "/DynamicInfosservlet",
                    postData: {
                        StartDate: ghourdate,
                        StartTime: gstarthour,
                        EndTime: gendhour,
                        filename: 'hourRoad'
                    },
                    timeout: 50000,
                    handleAs: "json"
                });
                getuserPoi.then(function(response) {
                    var Json = eval(response);
                    console.log(Json);
                    var poiid = '';
                    var jsonNew='';
                    var gp;
                    for (var i = 0; i < Json.length; i++) {
                        if (i !== parseInt(Json.length) - 1) {
                            poiid += "'" + Json[i].poiid + "',";
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count) + ",";
                        } else {
                            jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count);
                            poiid += "'" + Json[i].poiid + "'";
                        }
                    }
                    var Date = "{" + jsonNew + "}";
                    var JsonDate = eval("(" + Date + ")");
                    var feature;
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["poiid", "checkin_nu", "x", "y", "TARGET_FID"];
                    query.where = "poiid IN (" + poiid + ")";
                    var URL = "http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(URL);

                    queryTask.execute(query, function(res) {
                        feature = res.features;
                        console.log(feature);
                        for (var i = 0; i < feature.length; i++) {
                            var poiid = feature[i].attributes.poiid;
                            var data = JsonDate[poiid];
                            feature[i].attributes.checkin_nu = data;
                        }

                        var featureSet = new FeatureSet();
                        featureSet.features = feature;
                        var road;
                        this.gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/road/GPServer/road");
                        query = new Query();
                        query.returnGeometry = true;
                        query.outFields = ["FID_beijin"];
                        query.where = "1=1";
                        query.outSpatialReference = {
                            wkid: 102100
                        };
                        queryTask = new QueryTask('http://219.231.176.20:6080/arcgis/rest/services/sinaData/sinadata/FeatureServer/1');
                        queryTask.execute(query, function(res) {
                            road = res.features;
                            console.log(road);

                        var roadline = new FeatureSet();
                        roadline.features = road;
                        var params = {
                            "inputroad": roadline,
                            "inputpoi": featureSet
                        };
                        console.log(params);
                        this.gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                        });
                    });
                    return response;
                });
                function gpJobComplete(jobinfo) {
                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(false);
                    self.map.graphics.clear();

                    gp.getResultData(jobinfo.jobId, "outputroad", function(layer) {
                    switch(gpLayerNum)
                        {
                        case "1":
                        GpGRResultLayer1 = layer;
                        console.log(GpGRResultLayer1); 
                            break;
                        case "2":
                        GpGRResultLayer2 = layer;
                        console.log(GpGRResultLayer2);
                            break;
                        case "3":
                        GpGRResultLayer3 = layer; 
                        console.log(GpGRResultLayer3); 
                            break;
                        case "4":
                        GpGRResultLayer4 = layer; 
                        console.log(GpGRResultLayer4);
                            break;
                        case "5":
                        GpGRResultLayer5 = layer;
                        console.log(GpGRResultLayer5); 
                            break;
                        case "6":
                        GpGRResultLayer6 = layer;
                        console.log(GpGRResultLayer6);  
                            break;
                        case "7":
                        GpGRResultLayer7 = layer;
                        console.log(GpGRResultLayer7);  
                            break;
                        case "8":
                        GpGRResultLayer8 = layer;
                        console.log(GpGRResultLayer8);  
                            break;                  
                        default:
                        }
                        if(gpID === "hourRoadlayer"){
                            topic.publish("some/topic_hourRoad_isDone", [gpID,gpLayerNum]);
                        }else if(gpID === "douhourRoadlayer"){
                            topic.publish("some/topic_douhourRoad_isDone", [gpID,gpLayerNum]);
                        }else if(gpID === "allhourTimeLayer"){
                            topic.publish("some/topic_allhourTime_isDone", [gpID,gpLayerNum]);
                        }
                    });
                }

                function gpJobStatus(jobinfo) {
                    var self=this;
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+gpID+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+gpID+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+gpID+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                }

                //失败的回调，运行失败则调用此函数
                function gpJobFailed(err) {
                    self.startHourGp(Description,Layernum,hourdate,starthour,endhour);
                }
            },
            
            DYcleanMap : function() {
                    // 清除地图
                    var self=this;
                    console.log("cleanMap");
                    self.map.graphics.clear();
                
                    try {
                        //通过ID
                        map.removeLayer(this.GpGRResultLayer1);
                        map.removeLayer(this.GpGRResultLayer2);
                        map.removeLayer(this.GpGRResultLayer3);
                        map.removeLayer(this.GpGRResultLayer4);
                        map.removeLayer(this.GpGRResultLayer5);
                        map.removeLayer(this.GpGRResultLayer6);
                        map.removeLayer(this.GpGRResultLayer7);
                        map.removeLayer(this.GpGRResultLayer8);

                        this.GpGRResultLayer1 = null;
                        this.GpGRResultLayer2 = null;
                        this.GpGRResultLayer3 = null;
                        this.GpGRResultLayer4 = null;
                        this.GpGRResultLayer5 = null;
                        this.GpGRResultLayer6 = null;
                        this.GpGRResultLayer7 = null;
                        this.GpGRResultLayer8 = null;
                        
                    } catch (e) {
                        // TODO: handle exception
                    }                             
            },

             //渲染
            Display:function(layer){
                var self=this;
                var symbol;
                var features=layer.value.features;
                for (var f=0, fl = features.length; f < fl; f++) {
                    var feature = features[f];
                    var num = features[f].attributes.checkin_nu;
                if (num === 'null' || num < 2) {
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color("#FFF200"), 0.1),
                        new Color("#3FAB00"));
                } else if (num < 4) {
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color("#FFF200"), 0.1),
                        new Color("#91D400"));
                } else if (num < 6) {
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color("#FFF200"), 0.1),
                        new Color("#BBE600"));
                } else if (num < 8) {
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color("#FFF200"), 0.1),
                        new Color("#D1ED00"));
                } else if (num < 10) {
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color("#FFF200"), 0.1),
                        new Color("#FFBF00"));
                } else if (num > 10) {
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color("#FFF200"), 0.1),
                        new Color("#FF0000"));
                }
                feature.setSymbol(symbol);
                self.map.graphics.add(feature);
                }
             },

            //POI点显著度计算
            POIimClick:function(){
                var self=this;
                var POIfeatureset = new FeatureSet();
                var inputbeijing = new FeatureSet();
                var weighted_1nmb = dijit.byId('weighted_1nmb').get('value');
                var weighted_2nmb = dijit.byId('weighted_2nmb').get('value');
                var weighted_3nmb = dijit.byId('weighted_3nmb').get('value');
                var weighted_4nmb = dijit.byId('weighted_4nmb').get('value');
                var weighted_5nmb = dijit.byId('weighted_5nmb').get('value');
                var weighted_6nmb = dijit.byId('weighted_6nmb').get('value');
                var daynum = dijit.byId('daynum').get('value');
                console.log(weighted_2nmb);
                
                var gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/poiimport/GPServer/poiimport");
                gp.setOutputSpatialReference({
                    wkid: 102100
                });
                
                var overData = dijit.byId('datedaypoint').get('value');
                var dateArrey = [];
                for (var i =0;i<daynum;i++) {
                    var newdate= new Date(overData).format("yyyy/M/d");
                    dateArrey[i]=newdate;
                    overData = new Date(overData.setDate(overData.getDate() +1)); // 这个是关键！！！
                }
                console.log(dateArrey);
                var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["PYNAME","weight"];
                    query.where = "1=1";
                    var URL = "http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/4";
                    var queryTask = new QueryTask(URL);
                    console.log("11");
                    queryTask.execute(query, function(res) {
                        console.log(res);
                        feature = res.features;
                        for (var i = 0; i < feature.length; i++) {
                            var PYNAME = feature[i].attributes.PYNAME ;
                                console.log(PYNAME);

                            switch(PYNAME){
                                case '东城区':
                                feature[i].attributes.weight  = weighted_1nmb;
                                break;
                                case '西城区':
                                feature[i].attributes.weight  = weighted_2nmb;
                                break;
                                case '朝阳区':
                                feature[i].attributes.weight  = weighted_3nmb;
                                break;
                                case '海淀区':
                                feature[i].attributes.weight  = weighted_4nmb;
                                break;
                                case '丰台区':
                                feature[i].attributes.weight  = weighted_5nmb;
                                break;
                                case '石景山区':
                                feature[i].attributes.weight  = weighted_6nmb;
                                break;
                            }
                        }
                        inputbeijing.features = feature;
                        var getuserPoi = dojo.xhrPost({
                            url: "/workuserInformation",
                            postData: {
                                name: "workPOI",
                                date: dateArrey
                            },
                            timeout: 50000,
                            handleAs: "json"
                        });
                        getuserPoi.then(function(response) {
                            var Json = eval(response);
                            console.log(Json);
                            var jsonNew = "";
                            var poiid = '';
                            for (var i = 0; i < Json.length; i++) {
                                if (i !== parseInt(Json.length) - 1) {
                                    poiid += "'" + Json[i].poiid + "',";
                                    jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count) + ",";
                                } else {
                                    jsonNew += "\"" + Json[i].poiid + "\"" + ":" + parseInt(Json[i].count);
                                    poiid += "'" + Json[i].poiid + "'";
                                }
                            }
                            var num=Math.ceil(Json.length/999);
                            console.log(num);
                            for(var number=0;number<5;number++){
                                console.log("sda");
                                eval( " var poiid_"+ number +" =''");
                                for(var i=0;i<999;i++){
                                    if(i!==998){
                                        var j=number*999+i;
                                        if(j<Json.length-1){
                                            eval("poiid_"+number+"+="+"\"'\" + Json[j].poiid + \"',\"");}
                                            else if(j==Json.length-1){
                                            eval("poiid_"+number+"+="+"\"'\" + Json[j].poiid + \"'\"")}
                                        else{
                                            break;
                                      }
                                    }
                                    else{
                                        var j=number*999+i;
                                        if(j<Json.length){
                                        eval("poiid_"+number+"+="+"\"'\" + Json[j].poiid + \"'\"")}
                                        else{
                                            break;
                                      }
                                    }
                                }
                            }
                            var Date = "{" + jsonNew + "}";
                            var JsonDate = eval("(" + Date + ")");
                            var feature;
                            var query = new Query();
                            query.returnGeometry = true;
                            query.outFields = ["OBJECTID","poiid", "checkin_nu", "checkin_us", "title"];
                            // query.where = "poiid IN ('B2094757DB65A3FF4398','B2094757DB65A7F4429E','B2094757DB68A4FE4198','B2094757DB68A4FF469A','B2094757DB68A5FE499E','B2094757DB68A7F5449B','B2094757DB69A3F8419B')";
                            var sql;
                            for (var querynum=0; querynum<5; querynum++){
                                console.log(querynum);
                                if(querynum==0){
                                sql="poiid IN ("+eval("poiid_"+querynum)+")";
                                // console.log(sql);
                                // sql="poiid IN ('B2094757DB65A3FF4398','B2094757DB65A7F4429E')";
                                }
                                else{
                                sql=sql+" OR " + "poiid IN ("+eval("poiid_"+querynum)+")"
                                // sql=sql+" OR " + "poiid IN ('B2094757DB68A4FE4198','B2094757DB68A4FF469A')"
                                }
                            }
                            // console.log(sql);
                            query.where=sql;
                            var URL = "http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                            var queryTask = new QueryTask(URL);
                            // var layer=self.map.getLayer("poiPoint"); 
                            // layer.queryFeatures
                            queryTask.execute(query, function(res) {
                                feature = res.features;
                                for (var i = 0; i < feature.length; i++) {
                                    var poiid = feature[i].attributes.poiid;
                                    var data = JsonDate[poiid];
                                    feature[i].attributes.checkin_nu = data;
                                }
                                POIfeatureset.features = feature;
                                console.log(POIfeatureset);
                                
                                    console.log(inputbeijing);
                                    var params = {
                                        'beijing': inputbeijing,
                                        'poiPoint': POIfeatureset
                                    };
                                    gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                                });
                        });
                    });
                 //成功的回调
                function gpJobComplete(jobinfo) {
                    gp.getResultData(jobinfo.jobId, "importpoiout", function(layer) {
                        this.GpResultLayer1 = layer;
                        console.log(layer);
                        var importFeatures=layer.value.features;
                        var chinkNu=[];
                        var importnum=[];
                        var j=1;
                        for(var i=0;i<importFeatures.length;i++){
                            chinkNu[i]=importFeatures[i].attributes.checkin_nu;
                            importnum[i]=importFeatures[i].attributes.importpoi;
                        }
                        //对签到数进行排序
                        function sortNumber(a,b)
                        {
                        return a - b
                        }
                        chinkNu.sort(sortNumber);
                        for(var i=importFeatures.length;i>0;i--){
                            for(feanum=0;feanum<importFeatures.length;feanum++){
                                if(chinkNu[i]==importFeatures[feanum].attributes.checkin_nu){
                                    //插入到表格中
                                    var poititle=eval("POI_"+j)
                                    var poichinkin=eval("chinkin_"+j);
                                    var poiimport=eval("import_"+j);
                                    dom.byId(poititle).innerHTML=importFeatures[feanum].attributes.title;
                                    dom.byId(poichinkin).innerHTML=importFeatures[feanum].attributes.checkin_nu;
                                    dom.byId(poiimport).innerHTML=importFeatures[feanum].attributes.importPoi;
                                    j++;
                                    i--;
                                if(j==11){
                                break;
                                }
                                }
                                else{}
                                }
                            if(j==11){
                                break;
                                }
                        }
                    });
                }
                //失败的回调，运行失败则调用此函数
                function gpJobFailed(error) {
                    self.POIimClick();
                }
                //如果有需要，也可以在运行过程的函数中获取其运行状态
                function gpJobStatus(jobinfo) {
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+"poiimport"+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+"poiimport"+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+"poiimport"+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                }
            },

            //第一层地标提取
            getLandmark:function(){
                var self=this;
                voronoiRepeatnum=1;
                var Threshold = dijit.byId('Threshold').get('value');
                if(GpResultLayer1!==null){
                    console.log('!=null');
                    var landmarkset=new FeatureSet();
                    landmarkset.features=GpResultLayer1.value.features;//正确的featureset赋值
                    // 利用发布的服务直接进行set
                    console.log(landmarkset);
                    var gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/poivoronoi/GPServer/poivoronoi");
                    gp.setOutputSpatialReference({
                        wkid: 102100
                    });
                    var params = {
                        'importpoi': landmarkset
                    };
                    gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                     //成功的回调
                function gpJobComplete(jobinfo) {
                    var s,newpoiidvoronoi="";
                    gp.getResultData(jobinfo.jobId, "voronoi", function(layer) {
                        console.log(layer);
                        var poineighborhood=layer.value.features;
                        var poi_length=poineighborhood.length;
                        var poi_id=poineighborhood[poi_length-1].attributes.src_target_fid;
                        console.log(poi_id);
                        var everylen=[0];//存放每个ID的位置指针
                        var ever=1;
                        var poiidarr=[]//poiid存放
                        poiidarr[0]=poineighborhood[0].attributes.src_poiid;
                        var srcimport=[]//当前poi显著度存放
                        srcimport[0]=parseFloat(poineighborhood[0].attributes.src_importpoi.replace(/\"/g, ""));
                        var maxnbrimport=[]//邻近poi显著度最大值存放
                        var nbrimport=[]//所有邻近poi显著度值存放
                        nbrimport[0]=parseFloat(poineighborhood[0].attributes.nbr_importpoi.replace(/\"/g, ""));

                        for(var poiid=1;poiid<poi_length;poiid++){
                            nbrimport[poiid]=parseFloat(poineighborhood[poiid].attributes.nbr_importpoi.replace(/\"/g, ""));
                            if(poineighborhood[poiid].attributes.src_target_fid==poineighborhood[poiid-1].attributes.src_target_fid){

                            }
                            else{
                                everylen[ever]=poiid;
                                poiidarr[ever]=poineighborhood[poiid].attributes.src_poiid;
                                srcimport[ever]=parseFloat(poineighborhood[poiid].attributes.src_importpoi.replace(/\"/g, ""));
                                var priorID=everylen[ever-1];//上一个记录的位置指针
                                var max=nbrimport[priorID];//求取最大值
                                var len=poiid-priorID;
                                for(var i=1;i<len;i++){
                                    if (nbrimport[priorID+i]>max) {
                                        max=nbrimport[priorID+i];
                                    }
                                }
                                maxnbrimport[ever-1]=max;
                                ever++;
                            }
                            if(poiid==poi_length-1){
                                console.log("最后"+poiid);
                                var lastpoid=everylen[poi_id-1];
                                max=nbrimport[lastpoid];
                                len=poi_length-lastpoid;
                                for(var i=1;i<len;i++){
                                if (nbrimport[lastpoid+i]>max) {
                                    max=nbrimport[lastpoid+i]; 
                                }
                                maxnbrimport[poi_id-1]=max;
                            }
                            }
                        }
                        console.log(everylen);
                        console.log(poiidarr);
                        console.log(srcimport);
                        console.log(maxnbrimport);
                        var poiidvoronoi="";
                        var threshold=0;
                        for(i=0;i<poi_id;i++){
                            if(i==poi_id-1){
                               if(srcimport[i]>=maxnbrimport[i]){
                                poiidvoronoi+="'"+poiidarr[i]+"'"
                                threshold++;
                            } 
                            }
                            else{
                            if(srcimport[i]>=maxnbrimport[i]){
                                poiidvoronoi+="'"+poiidarr[i]+"',"
                                threshold++;
                            }
                        }
                        }
                        s=poiidvoronoi.charAt(poiidvoronoi.length-1);
                        if(s==","){
                            for(var i=0;i<poiidvoronoi.length-1;i++){
                                newpoiidvoronoi+=poiidvoronoi[i];
                              }
                        }
                        else{
                            newpoiidvoronoi=poiidvoronoi;
                        }
                        console.log(newpoiidvoronoi);
                        console.log(threshold);
                        if(threshold>=Threshold){
                            self.voronoiRepeat(newpoiidvoronoi,Threshold);
                            //渲染每一层的POI
                            voronoiRepeatnum++;
                            j=0;
                            var voronoiRepeatfa=[];
                            var layer=GpResultLayer1.value.features;
                            for(i=0;i<layer.length;i++){
                                if(newpoiidvoronoi.indexOf(layer[i].attributes.poiid)>0){
                                    console.log('i');
                                voronoiRepeatfa[j]=layer[i];
                                j++;
                                }
                                else{}
                            }
                        console.log(voronoiRepeatfa);
                        self.displayPOIResult(voronoiRepeatfa,voronoiRepeatnum);
                        }

                    });
                    gp.getResultData(jobinfo.jobId, "voronoipoi", function(layer) {
                        addResults(layer);
                    });
                }
                //失败的回调，运行失败则调用此函数
                function gpJobFailed(error) {
                    self.getLandmark();
                }
                //如果有需要，也可以在运行过程的函数中获取其运行状态
                function gpJobStatus(jobinfo) {
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+"第一层地标提取"+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+"第一层地标提取"+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+"第一层地标提取"+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                }
                function addResults(results) {
                    console.log(results);
                    var features = results.value.features;
                    for (var f = 0, fl = features.length; f < fl; f++) {
                          var feature = features[f];
                         // var polySymbolRed = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([204, 102, 51]), 1), new dojo.Color([158, 184, 71, 1]));
                          var symbol = new SimpleFillSymbol(
                            SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(
                              SimpleLineSymbol.STYLE_SOLID,
                              new Color([0, 0, 0, 0.65]), 1
                            ),
                            new Color([0, 0, 0, 0])
                          );

                          feature.setSymbol(symbol);
                          self.map.graphics.add(feature);
                      }
                  }
                }
                else{
                    alert("请先进行POI显著度计算!!");
                    }
            },

            //分层地标提取
            voronoiRepeat:function(sql,Threshold){
                voronoiRepeatnum++;
                console.log(voronoiRepeatnum);
                var self=this;
                console.log(GpResultLayer1);
                var layer=GpResultLayer1.value.features;
                var j=0;
                var voronoiRepeatfea=[];
                for(i=0;i<layer.length;i++){
                    if(sql.indexOf(layer[i].attributes.poiid)>0){
                        console.log('i');
                    voronoiRepeatfea[j]=layer[i];
                    j++;
                    }
                    else{}
                }

                    var landmarkset=new FeatureSet();
                    landmarkset.features=voronoiRepeatfea;


                    console.log(voronoiRepeatfea);
                    // 利用发布的服务直接进行set
                    console.log(landmarkset);
                    var gp = new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/poivoronoi/GPServer/poivoronoi");
                    gp.setOutputSpatialReference({
                        wkid: 102100
                    });
                    var params = {
                        'importpoi': landmarkset
                    };
                    gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                function gpJobComplete(jobinfo) {
                    var s,newpoiidvoronoi="";
                    gp.getResultData(jobinfo.jobId, "voronoi", function(layer) {
                        console.log(layer);
                        var poineighborhood=layer.value.features;
                        var poi_length=poineighborhood.length;
                        var poi_id=poineighborhood[poi_length-1].attributes.src_target_fid;
                        console.log(poi_id);
                        var everylen=[0];//存放每个ID的位置指针
                        var ever=1;
                        var poiidarr=[]//poiid存放
                        poiidarr[0]=poineighborhood[0].attributes.src_poiid;
                        var srcimport=[]//当前poi显著度存放
                        srcimport[0]=parseFloat(poineighborhood[0].attributes.src_importpoi.replace(/\"/g, ""));
                        var maxnbrimport=[]//邻近poi显著度最大值存放
                        var nbrimport=[]//所有邻近poi显著度值存放
                        nbrimport[0]=parseFloat(poineighborhood[0].attributes.nbr_importpoi.replace(/\"/g, ""));

                        for(var poiid=1;poiid<poi_length;poiid++){
                            nbrimport[poiid]=parseFloat(poineighborhood[poiid].attributes.nbr_importpoi.replace(/\"/g, ""));
                            if(poineighborhood[poiid].attributes.src_target_fid==poineighborhood[poiid-1].attributes.src_target_fid){

                            }
                            else{
                                everylen[ever]=poiid;
                                poiidarr[ever]=poineighborhood[poiid].attributes.src_poiid;
                                srcimport[ever]=parseFloat(poineighborhood[poiid].attributes.src_importpoi.replace(/\"/g, ""));
                                var priorID=everylen[ever-1];//上一个记录的位置指针
                                var max=nbrimport[priorID];//求取最大值
                                var len=poiid-priorID;
                                for(var i=1;i<len;i++){
                                    if (nbrimport[priorID+i]>max) {
                                        max=nbrimport[priorID+i];
                                    }
                                }
                                maxnbrimport[ever-1]=max;
                                ever++;
                            }
                            if(poiid==poi_length-1){
                                console.log("最后"+poiid);
                                var lastpoid=everylen[poi_id-1];
                                max=nbrimport[lastpoid];
                                len=poi_length-lastpoid;
                                for(var i=1;i<len;i++){
                                if (nbrimport[lastpoid+i]>max) {
                                    max=nbrimport[lastpoid+i];
                                }
                                maxnbrimport[poi_id-1]=max;
                            }
                            }
                        }
                        console.log(everylen);
                        console.log(poiidarr);
                        console.log(srcimport);
                        console.log(maxnbrimport);
                        var poiidvoronoi="";
                        var threshold=0;
                        for(i=0;i<poi_id;i++){
                            if(i==poi_id-1){
                               if(srcimport[i]>=maxnbrimport[i]){
                                console.log(i);
                                poiidvoronoi+="'"+poiidarr[i]+"'"
                                threshold++;
                                } 
                                }
                            else{
                            if(srcimport[i]>=maxnbrimport[i]){
                                poiidvoronoi+="'"+poiidarr[i]+"',"
                                threshold++;
                            }
                        }
                        }
                        
                        s=poiidvoronoi.charAt(poiidvoronoi.length-1);
                        if(s==","){
                            for(var i=0;i<poiidvoronoi.length-1;i++){
                                newpoiidvoronoi+=poiidvoronoi[i];
                              }
                        }
                        else{
                            newpoiidvoronoi=poiidvoronoi;
                        }
                        console.log(newpoiidvoronoi);
                        console.log(threshold);
                        if(threshold>=Threshold){
                            self.voronoiRepeat(newpoiidvoronoi,Threshold);
                            //渲染每一层的POI
                            voronoiRepeatnum++;
                            j=0;
                            var voronoiRepeatfa=[];
                            var layer=GpResultLayer1.value.features;
                            for(i=0;i<layer.length;i++){
                                if(newpoiidvoronoi.indexOf(layer[i].attributes.poiid)>0){
                                    console.log('i');
                                voronoiRepeatfa[j]=layer[i];
                                j++;
                                }
                                else{}
                            }
                        console.log(voronoiRepeatfa);
                        self.displayPOIResult(voronoiRepeatfa,voronoiRepeatnum);
                        }
                        else{
                            //渲染每一层的POI
                            voronoiRepeatnum++;
                            j=0;
                            var voronoiRepeatfa=[];
                            var layer=GpResultLayer1.value.features;
                            for(i=0;i<layer.length;i++){
                                if(newpoiidvoronoi.indexOf(layer[i].attributes.poiid)>0){
                                    console.log('i');
                                voronoiRepeatfa[j]=layer[i];
                                j++;
                                }
                                else{}
                            }
                        console.log(voronoiRepeatfa);
                        self.displayPOIResult(voronoiRepeatfa,voronoiRepeatnum);
                        }

                    });
                    gp.getResultData(jobinfo.jobId, "voronoipoi", function(layer) {
                        addResults(layer);
                        
                    });
                self.map.graphics.clear();
                }
                //失败的回调，运行失败则调用此函数
                function gpJobFailed(error) {
                    self.getLandmark();
                }
                //如果有需要，也可以在运行过程的函数中获取其运行状态
                function gpJobStatus(jobinfo) {
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+"分层地标提取"+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+"分层地标提取"+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+"分层地标提取"+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                }
                function addResults(results) {
                    console.log(results);
                    var features = results.value.features;
                    for (var f = 0, fl = features.length; f < fl; f++) {
                          var feature = features[f];
                         // var polySymbolRed = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([204, 102, 51]), 1), new dojo.Color([158, 184, 71, 1]));
                          var symbol = new SimpleFillSymbol(
                            SimpleFillSymbol.STYLE_SOLID,
                            new SimpleLineSymbol(
                              SimpleLineSymbol.STYLE_SOLID,
                              new Color([0, 0, 0, 0.65]), 1
                            ),
                            new Color([0, 0, 0, 0])
                          );
                          feature.setSymbol(symbol);
                          self.map.graphics.add(feature);
                      }
                  }
            },
            // ****POI地标图层渲染**** //
            displayPOIResult:function(layer,num){
                var symbol;
                var features = layer;
                console.log(features);
                // 
                for(var f=0,f1=features.length;f<f1;f++){
                    var feature = features[f];
                    var markerSymbol = new SimpleMarkerSymbol();
                    markerSymbol.setColor(new Color([227, 139, 79, 0.75]));
                    markerSymbol.setSize(5*num);
                    markerSymbol.outline.setColor(new Color([51, 51, 51, 1]));
                    markerSymbol.outline.setWidth(1);

                    feature.setSymbol(markerSymbol);
                    this.map.graphics.add(feature);
                }
            }

        });

    });