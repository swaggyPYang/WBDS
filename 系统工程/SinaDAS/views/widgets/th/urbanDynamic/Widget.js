/**
 * Created by Administrator on 2016/3/24 0024.
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/parser',
        'jimu/BaseWidget',
        'dojo/on',
        'dojo/query',
        'dojo/dom',
        "dojo/dom-construct",
        'jimu/WidgetManager',
        'dojo/topic',
        'dijit/form/HorizontalSlider',
        'dijit/form/HorizontalRuleLabels',
        "esri/Color",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/dijit/LayerSwipe",
        "esri/domUtils",
        "esri/tasks/FeatureSet",
        "esri/layers/FeatureLayer",
        "esri/tasks/Geoprocessor",
        "esri/layers/ImageParameters",
        "esri/tasks/QueryTask", 
        "esri/tasks/query",
        "esri/graphic",
        "dojo/domReady!"
    ],
    function(declare,lang,parser,BaseWidget,on,query,dom,domConstruct,WidgetManager,topic,HorizontalSlider,
        HorizontalRuleLabels,Color,SimpleFillSymbol,SimpleLineSymbol,SimpleMarkerSymbol,LayerSwipe,domUtils, 
        FeatureSet, FeatureLayer, Geoprocessor, ImageParameters, QueryTask,Query,graphic
        ) {
        return declare([BaseWidget], {
            baseClass: 'urbanDynamic',
            name: 'urbanDynamic',
            widgetsInTemplate : true,
            // 一周内时间滑块
            GpResultLayer0 : null,
            GpResultLayer1 : null,
            GpResultLayer2 : null,
            GpResultLayer3 : null,
            GpResultLayer4 : null,
            GpResultLayer5 : null,
            GpResultLayer6 : null,
            TimeSlider:null,
            
            // 双时段卷帘
            layerSwipe:null,

            // 一天内时间滑块
            GpGridResultLayer1:null,
            GpGridResultLayer2:null,
            GpGridResultLayer3:null,
            GpGridResultLayer4:null,
            GpGridResultLayer5:null,
            GpGridResultLayer6:null,
            GpGridResultLayer7:null,
            GpGridResultLayer7:null,
            GpGridResultLayer8:null,
            dyTimeSlider:null,

            //性别卷帘
            sexlayerSwipe:null,

            // 年龄滑块
            GpAgeResultLayer1:null,
            GpAgeResultLayer2:null,
            GpAgeResultLayer3:null,
            GpAgeResultLayer4:null,
            GpAgeResultLayer5:null,
            ageTimeSlider:null,
            
            postCreate: function() {
                this.inherited(arguments); 
                console.log("运行");               
            },
            startup: function() {
                var self=this;
                this.inherited(arguments);
                parser.parse();  
                this.initLayout();
                // 一周内时间滑块
                this.TimeSlider = new HorizontalSlider({
                 name: "时间轴",
                 value: 1,
                 minimum: 0,
                 maximum: 6,
                 discreteValues:7,
                 intermediateChanges: true,
                 style: "width:100%;",
                 onChange: function(value){ 
                    switch(value)
                    {
                    case 0:
                    GpResultLayer0.setVisibility(true);
                    GpResultLayer1.setVisibility(false);
                    GpResultLayer2.setVisibility(false);
                    GpResultLayer3.setVisibility(false);
                    GpResultLayer4.setVisibility(false);
                    GpResultLayer5.setVisibility(false);
                    GpResultLayer6.setVisibility(false);
                          break;
                    case 1:
                    GpResultLayer1.setVisibility(true);
                    GpResultLayer0.setVisibility(false);
                    GpResultLayer2.setVisibility(false);
                    GpResultLayer3.setVisibility(false);
                    GpResultLayer4.setVisibility(false);
                    GpResultLayer5.setVisibility(false);
                    GpResultLayer6.setVisibility(false);
                          break;
                    case 2:
                    GpResultLayer2.setVisibility(true);
                    GpResultLayer0.setVisibility(false);
                    GpResultLayer1.setVisibility(false);
                    GpResultLayer3.setVisibility(false);
                    GpResultLayer4.setVisibility(false);
                    GpResultLayer5.setVisibility(false);
                    GpResultLayer6.setVisibility(false);
                          break;
                    case 3:
                    GpResultLayer3.setVisibility(true);
                    GpResultLayer0.setVisibility(false);
                    GpResultLayer1.setVisibility(false);
                    GpResultLayer2.setVisibility(false);
                    GpResultLayer4.setVisibility(false);
                    GpResultLayer5.setVisibility(false);
                    GpResultLayer6.setVisibility(false);
                          break;
                    case 4:
                    GpResultLayer4.setVisibility(true);
                    GpResultLayer0.setVisibility(false);
                    GpResultLayer1.setVisibility(false);
                    GpResultLayer2.setVisibility(false);
                    GpResultLayer3.setVisibility(false);
                    GpResultLayer5.setVisibility(false);
                    GpResultLayer6.setVisibility(false);
                    
                          break;
                    case 5:
                    GpResultLayer5.setVisibility(true);
                    GpResultLayer0.setVisibility(false);
                    GpResultLayer1.setVisibility(false);
                    GpResultLayer2.setVisibility(false);
                    GpResultLayer3.setVisibility(false);
                    GpResultLayer4.setVisibility(false);
                    GpResultLayer6.setVisibility(false);
                          break;
                    case 6:
                    GpResultLayer6.setVisibility(true);
                    GpResultLayer0.setVisibility(false);
                    GpResultLayer1.setVisibility(false);
                    GpResultLayer2.setVisibility(false);
                    GpResultLayer3.setVisibility(false);
                    GpResultLayer4.setVisibility(false);
                    GpResultLayer5.setVisibility(false);
                          break;
                    default:
                    }
                 }
             }, "LayerTimeSlider").startup();
                
                //一天内时间滑块
                this.dyTimeSlider = new HorizontalSlider({
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
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer1);
                                      break;
                                case 2:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer2);
                                      break;
                                case 3:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer3);
                                      break;
                                case 4:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer4);
                                      break;
                                case 5:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer5);
                                break;
                                case 6:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer6);
                                      break;
                                case 7:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer7);
                                      break;
                                case 8:
                                self.dycleanMap();
                                self.displayResult(GpGridResultLayer8);
                                      break;      
                                default:
                                }                               
                             }
                }, "LayerGridTimeSlider").startup();

                //年龄滑块
                this.ageTimeSlider = new HorizontalSlider({
                             name: "时间轴",
                             value: 1,
                             minimum: 0,
                             maximum: 4,
                             discreteValues:5,
                             intermediateChanges: true,
                             style: "width:100%;",
                             onChange: function(value){      
                                switch(value)
                                {
                                case 1:
                                self.dycleanMap();
                                self.displayResult(GpAgeResultLayer1);
                                      break;
                                case 2:
                                self.dycleanMap();
                                self.displayResult(GpAgeResultLayer2);
                                      break;
                                case 3:
                                self.dycleanMap();
                                self.displayResult(GpAgeResultLayer3);
                                      break;
                                case 4:
                                self.dycleanMap();
                                self.displayResult(GpAgeResult Layer4);
                                      break;
                                case 5:
                                self.dycleanMap();
                                self.displayResult(GpAgeResultLayer5);
                                break;  
                                default:
                                }                               
                             }
                }, "ageTimeSlider").startup();

            },
            onOpen: function() {
                console.log("onopen");
                WidgetManager.getInstance().openWidget('_35');
                selectlayer=1;
            },
            initLayout: function() {
                
                var overallTab=document.getElementById('overallTab');
                var dynamicTab=document.getElementById('dynamicTab');
                var genderTab=document.getElementById('genderTab');
                var ageTab=document.getElementById('ageTab');
              
                //div切换
                overallTab.style.display="block";dynamicTab.style.display="none";
                genderTab.style.display="none";ageTab.style.display="none";
                // 改时间格式
                Date.prototype.format = function(format){
                var o = {
                "M+" : this.getMonth()+1, //month
                "d+" : this.getDate(),   //day
                "h+" : this.getHours(),  //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                "S" : this.getMilliseconds() //millisecond
                };
                if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                RegExp.$1.length===1 ? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
                return format;
                };
                
                //初始化折线图 
                var overallchart = c3.generate({
                bindto:'#overallChart',
                    size: {
                        width: 330,
                        height:200,
                    },
                    data: {
                        x: 'x',
                        columns: [
                            ['x', '2015-09-28', '2015-09-29', '2015-09-30', '2015-10-01', '2015-10-02', '2015-10-03','2015-10-04'],
                            ['data1', 30, 200, 100, 400, 150, 250,200]
                        ]
                    },
                    axis: {
                        x: {
                            type: 'timeseries',
                            tick: {
                                format: '%m-%d'
                            }
                        }
                    }
                });
                

                // 初始化饼图（年龄）
                var agechart = c3.generate({
                    bindto:'#urbanageChart',
                    size: {
                        width: 300,
                        height:210
                    },
                    data: {
                        columns: [
                            ['11 - 16 (岁)',300],
                            ['17 - 23 (岁)',600],
                            ['24 - 33 (岁)',450],
                            ['34 - 45 (岁)',230],
                            ['> 46(岁)',180]
                        ],
                        type : 'pie'
                    }
                });
            }, 
            //总体特征分析模块
            //获得分组日期及表名，将日期转换为String类型，方便查询数据库
            groupDataHmd:function(){
                if(postFea===null||postAnaArea===null){
                    dom.byId('stateBack').innerHTML = "请选择区域后再进行计算！";
                    alert('未选择任何图层！请先进行选择！');
                }
                else{
                var overData =dijit.byId('SelectAllDate').get('value');
                console.log(overData);
                var date = new Date(overData); 
                var dateArrey = [];
                var dateGroup = [];
                for (var i =0;i<7;i++) {
                    var newdate= new Date(date).format("yyyy/M/d");
                    dateArrey[i]=newdate;
                    var dategroup = new Date(date).format("M/d");
                    dateGroup[i]=dategroup;
                    date = new Date(date.setDate(date.getDate() +1)); // 这个是关键！！！
                }
                console.log('222');
                dom.byId("UdataA").innerHTML=dateGroup[0];
                dom.byId("UdataB").innerHTML=dateGroup[1];
                dom.byId("UdataC").innerHTML=dateGroup[2];
                dom.byId("UdataD").innerHTML=dateGroup[3];
                dom.byId("UdataE").innerHTML=dateGroup[4];
                dom.byId("UdataF").innerHTML=dateGroup[5];
                dom.byId("UdataG").innerHTML=dateGroup[6];
                this.calculateLayers('0',dateArrey[0]);
                this.calculateLayers('1',dateArrey[1]);
                this.calculateLayers('2',dateArrey[2]);
                this.calculateLayers('3',dateArrey[3]);
                this.calculateLayers('4',dateArrey[4]);
                this.calculateLayers('5',dateArrey[5]);
                this.calculateLayers('6',dateArrey[6]);
                }
            },

            // 总体特征核密度分析
            calculateLayers:function(layerID,dateArrey){
                var self=this;
                var map=this.map;
                self.map.graphics.clear();
                topic_calculateLayers=topic.subscribe("some/topic_calculateLayers_isDone", function(e){
                    
                    if(e[0]==="urbanHmd" && e[1]==='0'){
                        var jobstatus = "[任务]"+"hmdDay0"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "第1天数据生成成功";
                        console.log('urbanHmd0');
                        console.log(GpResultLayer0); 
                        map.addLayer(GpResultLayer0); 
                        GpResultLayer0.setVisibility(false);
                            
                    }else if(e[0]==="urbanHmd" && e[1]==='1'){
                        var jobstatus = "[任务]"+"hmdday1"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "第2天数据生成成功";
                        console.log('urbanHmd1');
                        console.log(GpResultLayer1);
                        map.addLayer(GpResultLayer1);
                        GpResultLayer1.setVisibility(true);
                    }else if(e[0]==="urbanHmd" && e[1]==='2'){
                        var jobstatus = "[任务]"+"hmdday2"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer3').innerHTML = "第3天数据生成成功";
                        console.log('urbanHmd2');
                        console.log(GpResultLayer2);
                        map.addLayer(GpResultLayer2);
                        GpResultLayer2.setVisibility(false);
                    }else if(e[0]==="urbanHmd" && e[1]==='3'){
                        var jobstatus = "[任务]"+"hmdday3"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer4').innerHTML = "第4天数据生成成功";
                        console.log('urbanHmd3');
                        console.log(GpResultLayer3);
                        map.addLayer(GpResultLayer3);
                        GpResultLayer3.setVisibility(false);
                    }else if(e[0]==="urbanHmd" && e[1]==='4'){
                        var jobstatus = "[任务]"+"hmdday4"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer5').innerHTML = "第5天数据生成成功";
                        console.log('urbanHmd4');
                        console.log(GpResultLayer4);
                        map.addLayer(GpResultLayer4);
                        GpResultLayer4.setVisibility(false);
                    }else if(e[0]==="urbanHmd" && e[1]==='5'){
                        var jobstatus = "[任务]"+"hmdday5"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer6').innerHTML = "第6天数据生成成功";
                        console.log('urbanHmd5');
                        console.log(GpResultLayer5);
                        map.addLayer(GpResultLayer5);
                        GpResultLayer5.setVisibility(false);
                    }else if(e[0]==="urbanHmd" && e[1]==='6'){
                        var jobstatus = "[任务]"+"hmdday6"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer7').innerHTML = "第7天数据生成成功";
                        console.log('urbanHmd6');
                        console.log(GpResultLayer6);
                        map.addLayer(GpResultLayer6);
                        GpResultLayer6.setVisibility(false);
                    }
                });

                on(dojo.byId('CleanAllLayerData'),'click',function(){        
                        dojo.unsubscribe(topic_calculateLayers);
                        
                        self.map.graphics.clear();
                        self.map.removeLayer(GpResultLayer0);
                        self.map.removeLayer(GpResultLayer1);
                        self.map.removeLayer(GpResultLayer2);
                        self.map.removeLayer(GpResultLayer3);
                        self.map.removeLayer(GpResultLayer4);
                        self.map.removeLayer(GpResultLayer5);
                        self.map.removeLayer(GpResultLayer6);
                        GpResultLayer0 = null;
                        GpResultLayer1 = null;
                        GpResultLayer2 = null;
                        GpResultLayer3 = null;
                        GpResultLayer4 = null;
                        GpResultLayer5 = null;
                        GpResultLayer6 = null;
                        
                        query(".resultLayer").forEach(function(node){
                                node.innerHTML = "";
                              });

                        var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);

                        this.TimeSlider.setValue(parseInt(0)); 
                });

                this.urbanTotalGp('urbanHmd',layerID,dateArrey);
            },
            // 拿到分组获取的poiid及对应的count——核密度GP工具
             urbanTotalGp:function(ID,layerID,checkindate) { 
                var self=this;
                var usernum0=0;
                var usernum1=0;
                var usernum2=0;
                var usernum3=0;
                var usernum4=0;
                var usernum5=0;
                var usernum6=0;
                var mID = ID;
                var mlayerID = layerID;
                var userdate=checkindate; 
                console.log(userdate);
                gp=new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/DensityEstimation/GPServer/DensityEstimation");
                gp.setOutputSpatialReference({wkid: 102100});
                var deferredResult = dojo.xhrPost({   
                    url:"/userInformation",
                    postData: {
                        date:userdate,
                        filename:userdate
                    },
                    timeout:50000,
                    handleAs:"json"
                });
                deferredResult.then(function(response){
                    var Json = eval(response);
                    console.log(Json.length); 
                    var jsonNew ="";
                    var poiid='';
                    for (var i = 0; i < Json.length; i++) {
                        if(i !== parseInt(Json.length) - 1){
                            poiid+="'"+Json[i].poiid+"',";
                            jsonNew += "\""+Json[i].poiid+"\""+":"+parseInt(Json[i].count)+",";
                        }else{
                            jsonNew += "\""+Json[i].poiid+"\""+":"+parseInt(Json[i].count);
                            poiid+="'"+Json[i].poiid+"'";
                        }
                    }
                    var Date = "{"+jsonNew+"}";
                    var JsonDate = eval("(" + Date + ")");
                        var feature;
                        var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                        var queryTask = new QueryTask(url);
                        var query = new Query();
                        query.returnGeometry = true;  
                        query.outFields = ["poiid","checkin_nu"];
                        query.where = "poiid IN ("+poiid+")";
                        query.geometry = postAnaArea; 
                        queryTask.execute(query,function(res){
                            feature=res.features;
                            for(var i=0;i<feature.length;i++){
                                var poiid=feature[i].attributes.poiid;
                                var data=JsonDate[poiid];
                                feature[i].attributes.checkin_nu=data;
                                switch(mlayerID){
                                    case '0':
                                    usernum0 += data;
                                    dom.byId("UnumA").innerHTML=usernum0;
                                    break;
                                    case '1':
                                    usernum1 += data;
                                    dom.byId("UnumB").innerHTML=usernum1;
                                    break;
                                    case '2':
                                    usernum2 += data;
                                    dom.byId("UnumC").innerHTML=usernum2;
                                    break;
                                    case '3':
                                    usernum3 += data;
                                    dom.byId("UnumD").innerHTML=usernum3;
                                    break;
                                    case '4':
                                    usernum4 += data;
                                    dom.byId("UnumE").innerHTML=usernum4;
                                    break;
                                    case '5':
                                    usernum5 += data;
                                    dom.byId("UnumF").innerHTML=usernum5;
                                    break;
                                    case '6':
                                    usernum6 += data;
                                    dom.byId("UnumG").innerHTML=usernum6;
                                    break;
                                    default:
                                }
    
                            }
                            var featureSet = new FeatureSet();
                            featureSet.features = feature;
                            var pixel = "30";
                            var params = {"poiPoint":featureSet,"pixel":pixel};
                            gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                        });
                    return response;

                });
                function gpJobComplete(jobinfo){
                console.log("suceess");
                // map.graphics.clear();
                var self=this;
                var imageParams = new ImageParameters();
                imageParams.format = "jpeg";
                gp.getResultImageLayer(jobinfo.jobId,null,imageParams,function(layer){
                    console.log('2');
                    layer.setOpacity(1);
                    switch(mlayerID){
                        case '0':
                        self.GpResultLayer0 = layer;
                        console.log(self.GpResultLayer0);  
                        break;
                        case '1':
                        self.GpResultLayer1 = layer;
                        console.log(self.GpResultLayer1);
                        break;
                        case '2':
                        self.GpResultLayer2 = layer;
                        console.log(self.GpResultLayer2);  
                        break;
                        case '3':
                        self.GpResultLayer3 = layer; 
                        console.log(self.GpResultLayer3);
                        break;
                        case '4':
                        self.GpResultLayer4 = layer; 
                        console.log(self.GpResultLayer4);
                        break;
                        case '5':
                        self.GpResultLayer5 = layer;  
                        console.log(self.GpResultLayer5);
                        break;
                        case '6':
                        self.GpResultLayer6 = layer;  
                        console.log(self.GpResultLayer6);
                        break;
                        default:
                            }   
                        console.log('111');
                        topic.publish("some/topic_calculateLayers_isDone", [mID,mlayerID]);
                            
                        });
                                    
                    }       

                function gpJobStatus(jobinfo){
                    var self=this;
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                        jobstatus += "[任务]"+mID+":异步请求中...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        break;
                        case 'esriJobExecuting':
                        jobstatus += "[任务]"+mID+":正在执行运算...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        break;
                        case 'esriJobSucceeded':
                        jobstatus += "[任务]"+mID+":运行成功！";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        break;
                    }
                dom.byId('stateBack').innerHTML = jobstatus;
                }   
            
                function gpJobFailed(error){
                    
                    // alert("运行出错！！");
                    self.calculateLayers(mlayerID,userdate);
                    dom.byId('stateBack').innerHTML = "[任务]"+mID+":运行错误！！";
                }

            },

            // 城市动态变化模块
            // 单个时段poi下签到用户格网专题图
            startTerminal:function(){
                var self = this;
                var map=this.map;
                self.map.graphics.clear();

                var StartDate = dijit.byId('DynamicStartDate').toString();
                var Startnewdate = new Date(StartDate);
                console.log(Startnewdate);
                var Startndate= new Date(Startnewdate).format("yyyy/M/d");
                var StartTime =parseInt(dijit.byId('selectDynamicFromTerminal').get('value'));
                var EndTime =parseInt(dijit.byId('selectDynamicToTerminal').get('value'));

                var StartDateString = Startndate;
                console.log(StartDateString);
                var StartTimeString = StartTime;
                console.log(StartTimeString);
                var EndTimeString = EndTime;
                console.log(EndTimeString);

                //监听
                var topic_startTerminal = topic.subscribe("some/topic_startTerminal_isDone", function(e){
                    if(e[0]==="startTerminalGrid" && e[1]==='1'){
                        map.graphics.clear();
                        self.displayResult(GpGridResultLayer1);
                        var jobstatus = "[任务]"+"startTerminalGrid"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        }else{
                            var jobstatus = "[任务]"+"startTerminalGrid"+":结果图层添加失败...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            }
                        dojo.unsubscribe(topic_startTerminal);    
                });
                this.startGridGp("startTerminalGrid",'1',StartDateString,StartTimeString,EndTimeString);

                on(dojo.byId('cleanTerminalMap'),'click',function(){      
                dojo.unsubscribe(topic_startTerminal);
                            
                map.graphics.clear();
                map.removeLayer(GpGridResultLayer1);
                GpGridResultLayer1 = null;
                layerSwipe = null;
                dom.byId('resultLayer1').innerHTML = "clearing map...";
                });

            },

            // 双时段poi下签到用户格网专题图
            startDoubleTime:function(){
                var self = this;
                var map=this.map;
                self.map.graphics.clear();
    
                var doubleDate = dijit.byId('DynamicDoubleDate').toString();
                console.log(doubleDate);
                var doublenewDate = new Date(doubleDate);
                var doublenDate= new Date(doublenewDate).format("yyyy/M/d");
                var dynamicOneTime =dijit.byId('selectDynamicOneTime').get('value');
                var dynamicTwoTime =dijit.byId('selectDynamicTwoTime').get('value');
                dynamicOneTime = dynamicOneTime.split('-');
                dynamicTwoTime = dynamicTwoTime.split('-');

                var StartDateStringA = doublenDate;
                console.log(StartDateStringA);
                var StartTimeStringA = dynamicOneTime[0];
                console.log(StartTimeStringA);
                var EndTimeStringA = dynamicOneTime[1];
                        
                var StartDateStringB = doublenDate;
                console.log(StartDateStringB);
                var StartTimeStringB = dynamicTwoTime[0];
                console.log(StartTimeStringB);
                var EndTimeStringB = dynamicTwoTime[1];

                // 监听
                var topic_startDoubleTime = topic.subscribe("some/topic_startDoubleTime_isDone", function(e){
                    if(e[0]==="startDoubleTimeLayer" && e[1]==='1'){
                        var jobstatus = "[任务]"+"GridA"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "对比图层A生成成功";
                    }else if(e[0]==="startDoubleTimeLayer" && e[1]==='2'){
                        var jobstatus = "[任务]"+"GridB"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "对比图层B生成成功";
                        }
                });

                this.startGridGp("startDoubleTimeLayer",'1',StartDateStringA,StartTimeStringA,EndTimeStringA);                
                this.startGridGp("startDoubleTimeLayer",'2',StartDateStringB,StartTimeStringB,EndTimeStringB);

                   on(dojo.byId('twocompaer'),'click',function(){
                    self.displayResult(GpGridResultLayer1);
                    self.displayResult(GpGridResultLayer2);
                    var layerone = self.displayResult(GpGridResultLayer1);
                    console.log(layerone);
                    map.addLayers([layerone]);  
                    var layertwo = self.displayResult(GpGridResultLayer2);
                    map.addLayers([layertwo]);  
                    // 创建卷帘 
                    var father = dom.byId('main');
                    domConstruct.create("div",{ id: "swipeDiv"}, father, "first");
                            
                    this.layerSwipe = new LayerSwipe({
                        type: "vertical",
                        top: 250,
                        map: map,
                        layers: [layertwo]
                    }, "swipeDiv");
                    self.layerSwipe.startup();
                });

                // 清除对比图层
                on(dojo.byId('cleanLayerSwipe'),'click',function(){      
                    dojo.unsubscribe(topic_startDoubleTime);

                     var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);
                            
                    map.graphics.clear();
                    map.removeLayer(this.GpGridResultLayer1);
                    map.removeLayer(this.GpGridResultLayer2);
                    GpGridResultLayer1 = null;
                    GpGridResultLayer2 = null;
                    layerSwipe.destroy();
                    layerSwipe = null;
                    dom.byId('resultLayer1').innerHTML = "clearing map...";
                    dom.byId('resultLayer2').innerHTML = "clearing map...";

                });
             },

             // 全时段poi下签到用户格网专题图
             startAllTime:function(){
                var self = this;
                var map=this.map;
                self.map.graphics.clear();

                var anaDate = dijit.byId('DynamicAllDate').toString();
                console.log(anaDate);
                var ananewDate = new Date(anaDate);
                var ananDate= new Date(ananewDate).format("yyyy/M/d");
                console.log(ananDate);

                var topic_startAllTime = topic.subscribe("some/topic_startAllTime_isDone",function(e){
                    if(e[0]==="startAllTimeLayer" && e[1]==='1'){
                        var jobstatus = "[任务]"+"startAllTimeLayer1"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "第1时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer1);  
                        // GpGridResultLayer1.setVisibility(false)
                            
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='2'){
                        var jobstatus = "[任务]"+"startAllTimeLayer2"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "第2时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer2);
                        // GpGridResultLayer2.setVisibility(false)
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='3'){
                        var jobstatus = "[任务]"+"startAllTimeLayer3"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer3').innerHTML = "第3时段数据生成成功";
                            
                        // map.addLayer(GpGridResultLayer3);
                        // GpGridResultLayer3.setVisibility(false)
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='4'){
                        var jobstatus = "[任务]"+"startAllTimeLayer4"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer4').innerHTML = "第4时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer4);
                        // GpGridResultLayer4.setVisibility(false)
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='5'){
                        var jobstatus = "[任务]"+"startAllTimeLayer5"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer5').innerHTML = "第5时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer5);
                        // GpGridResultLayer5.setVisibility(false)
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='6'){
                        var jobstatus = "[任务]"+"startAllTimeLayer6"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer6').innerHTML = "第6时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer6);
                        // GpGridResultLayer6.setVisibility(false)
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='7'){
                        var jobstatus = "[任务]"+"startAllTimeLayer7"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer7').innerHTML = "第7时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer7);
                        // GpGridResultLayer7.setVisibility(false)
                    }else if(e[0]==="startAllTimeLayer" && e[1]==='8'){
                        var jobstatus = "[任务]"+"startAllTimeLayer8"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer8').innerHTML = "第8时段数据生成成功";
                            
                        map.addLayer(GpGridResultLayer8);
                        // GpGridResultLayer8.setVisibility(false)
                    }
                });
                this.startGridGp("startAllTimeLayer",'1',ananDate,0,300);               
                this.startGridGp("startAllTimeLayer",'2',ananDate,300,600);
                this.startGridGp("startAllTimeLayer",'3',ananDate,600,900);
                this.startGridGp("startAllTimeLayer",'4',ananDate,900,1200);
                this.startGridGp("startAllTimeLayer",'5',ananDate,1200,1500);
                this.startGridGp("startAllTimeLayer",'6',ananDate,1500,1800);
                this.startGridGp("startAllTimeLayer",'7',ananDate,1800,2100);
                this.startGridGp("startAllTimeLayer",'8',ananDate,2100,2400);

                // 清除图层
                on(dojo.byId('cleanAllTimeLayer'),'click',function(){
                    dojo.unsubscribe(topic_startAllTime);

                    map.graphics.clear();
                    map.removeLayer(GpGridResultLayer1);
                    map.removeLayer(GpGridResultLayer2);
                    map.removeLayer(GpGridResultLayer3);
                    map.removeLayer(GpGridResultLayer4);
                    map.removeLayer(GpGridResultLayer5);
                    map.removeLayer(GpGridResultLayer6);
                    map.removeLayer(GpGridResultLayer7);
                    map.removeLayer(GpGridResultLayer8);
                    GpGridResultLayer1 = null;
                    GpGridResultLayer2 = null;
                    GpGridResultLayer3 = null;
                    GpGridResultLayer4 = null;
                    GpGridResultLayer5 = null;
                    GpGridResultLayer6 = null;
                    GpGridResultLayer7 = null;
                    GpGridResultLayer7 = null;
                    GpGridResultLayer8 = null;

                    query(".resultLayer").forEach(function(node){
                        node.innerHTML = ".....";
                    })

                    var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);

                    this.dyTimeSlider.setValue(parseInt(0));
                });
             },
             // poi下签到用户格网专题图——GP工具
            startGridGp:function(description,LayerNum,dStartDate,dStartTime,dEndTime){
                var self=this;
                var gID = description;
                var gLayerNum = LayerNum;
                var StartDateString=dStartDate;
                var StartTimeString=dStartTime;
                var EndTimeString=dEndTime;
                var gp=new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/HridThematicMap/GPServer/Hrid");
                gp.setOutputSpatialReference({wkid:102100});
                var jobstatus = "[任务]"+gID+":正在查询...";
                dom.byId('stateBack').innerHTML = jobstatus;
                var griddeferredResult = dojo.xhrPost({
                    url:"/DynamicInfosservlet",
                    postData:{
                        StartDate:StartDateString,
                        StartTime:StartTimeString,
                        EndTime:EndTimeString,
                        filename:StartTimeString
                    },
                    timeout:100000,
                    handleAs:"json"
                });
                griddeferredResult.then(function(response){
                    console.log(response);
                    var EachJson = eval(response);
                    var eachDayJson = "";
                    var poiid = "";
                    for (var i = 0; i < EachJson.length; i++) {
                        if(i != parseInt(EachJson.length) - 1){
                            poiid+="'"+EachJson[i].poiid+"',";
                            eachDayJson += "\""+EachJson[i].poiid+"\""+":"+parseInt(EachJson[i].count)+",";
                        }else{
                            eachDayJson += "\""+EachJson[i].poiid+"\""+":"+parseInt(EachJson[i].count);
                            poiid+="'"+EachJson[i].poiid+"'";
                        }
                    }
                    var Date = "{"+eachDayJson+"}";
                    var JsonDate = eval("(" + Date + ")");
                    if(postFea!=null||postAnaArea!=null){
                    var feature;
                    var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(url);
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["poiid","checkin_nu"];
                    query.where = "poiid IN ("+poiid+")";
                    query.geometry = postAnaArea;
                    queryTask.execute(query,function(res){
                        feature=res.features;
                        console.log('feature');
                        console.log(feature);
                        console.log(feature.length+'==============----------------');
                        for(var i=0;i<feature.length;i++){
                            var poiid=feature[i].attributes.poiid;
                            var data=JsonDate[poiid];
                            feature[i].attributes.checkin_nu=data;
                        }
                        featureSet = new FeatureSet();
                        console.log(feature);   
                        featureSet.features = feature;
                        var pixel = 600;
                        console.log(pixel);
                        var params = {"pixel":parseFloat(pixel).toFixed(2),"poiPoint":featureSet};
                        console.log(params);
                        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                    })
                    }else{
                        dom.byId('stateBack').innerHTML = "[!]请选择区域后再进行计算！";
                        alert("[!]请选择区域后再进行计算！");
                        }
                        return response;
                });

                function gpJobComplete(jobinfo){
                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(false);
                    self.map.graphics.clear();
                    gp.getResultData(jobinfo.jobId,"GridSpatialJoin",function(layer){
                        console.log(layer);
                        switch(gLayerNum)
                        {
                        case "1":
                        GpGridResultLayer1 = layer;
                        console.log(GpGridResultLayer1); 
                            break;
                        case "2":
                        GpGridResultLayer2 = layer;
                        console.log(GpGridResultLayer2);
                            break;
                        case "3":
                        GpGridResultLayer3 = layer; 
                        console.log(GpGridResultLayer3); 
                            break;
                        case "4":
                        GpGridResultLayer4 = layer; 
                        console.log(GpGridResultLayer4);
                            break;
                        case "5":
                        GpGridResultLayer5 = layer;
                        console.log(GpGridResultLayer5); 
                            break;
                        case "6":
                        GpGridResultLayer6 = layer;
                        console.log(GpGridResultLayer6);  
                            break;
                        case "7":
                        GpGridResultLayer7 = layer;
                        console.log(GpGridResultLayer7);  
                            break;
                        case "8":
                        GpGridResultLayer8 = layer;
                        console.log(GpGridResultLayer8);  
                            break;       
                        default:

                        }
                        if(gID === "startTerminalGrid"){
                            topic.publish("some/topic_startTerminal_isDone", [gID,gLayerNum]);
                        }else if(gID === "startDoubleTimeLayer"){
                            topic.publish("some/topic_startDoubleTime_isDone", [gID,gLayerNum]);
                        }else if(gID === "startAllTimeLayer"){
                            topic.publish("some/topic_startAllTime_isDone", [gID,gLayerNum]);
                        }
                    });                      
                }
               
                function gpJobStatus(jobinfo){
                    var self=this;
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+gID+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+gID+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+gID+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                    dom.byId('stateBack').innerHTML = jobstatus;
                }

                function gpJobFailed(error){
                    self.startGridGp(description,LayerNum,dStartDate,dStartTime,dEndTime);
                    // alert("运行出错！！");
                    dom.byId('stateBack').innerHTML = "[任务]"+gID+":! ！！";
                }
            },

            dycleanMap : function() {
                    // 清除地图
                    var self=this;
                    console.log("cleanMap");
                    self.map.graphics.clear();

                     var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);
                
                    try {
                        //通过ID
                        map.removeLayer(this.GpGridResultLayer1);
                        map.removeLayer(this.GpGridResultLayer2);
                        map.removeLayer(this.GpGridResultLayer3);
                        map.removeLayer(this.GpGridResultLayer4);
                        map.removeLayer(this.GpGridResultLayer5);
                        map.removeLayer(this.GpGridResultLayer6);
                        map.removeLayer(this.GpGridResultLayer7);
                        map.removeLayer(this.GpGridResultLayer8);

                        this.GpGridResultLayer1 = null;
                        this.GpGridResultLayer2 = null;
                        this.GpGridResultLayer3 = null;
                        this.GpGridResultLayer4 = null;
                        this.GpGridResultLayer5 = null;
                        this.GpGridResultLayer6 = null;
                        this.GpGridResultLayer7 = null;
                        this.GpGridResultLayer8 = null;
                        
                    } catch (e) {
                        // TODO: handle exception
                    }                             
            },

            // 性别专题图分析
            startGenderAna :function(){
                var self=this;
                var map=this.map;
                self.map.graphics.clear;

                var genderDate = dijit.byId('genderDate').toString();
                var gendernewDate = new Date(genderDate);
                var gendernDate= new Date(gendernewDate).format("yyyy/M/d");
                var genderTime =dijit.byId('genderTime').get('value');
                genderTime = genderTime.split('-');

                // 女
                var StartDateStringF = gendernDate;
                var StartTimeStringF = genderTime[0];
                var EndTimeStringF = genderTime[1];
                        
                // 男
                var StartDateStringM = gendernDate;
                var StartTimeStringM = genderTime[0];
                var EndTimeStringM = genderTime[1];

                // 监听
                var topic_startGender = topic.subscribe("some/topic_startGender_isDone", function(e){
                    if(e[0]==="startGenderLayer" && e[1]==='1'){
                        self.displayResult(GenderResultLayer1);
                        self.displayResult(GenderResultLayer2);
                        var jobstatus = "[任务]"+"F"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "女性图层生成成功";
                    }else if(e[0]==="startGenderLayer" && e[1]==='2'){
                        var jobstatus = "[任务]"+"M"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "男性图层生成成功";
                        }
                });

                this.startGenderGp("startGenderLayer",'1',StartDateStringF,StartTimeStringF,EndTimeStringF,'f');                
                this.startGenderGp("startGenderLayer",'2',StartDateStringM,StartTimeStringM,EndTimeStringM,'m');

                on(dojo.byId('SexcompaerLayer'),'click',function(){
                    var Sexlayerone =GenderResultLayer1.value.features ;
                    map.addLayers([layerone]);  
                    var Sexlayertwo =GenderResultLayer2.value.features ;
                    map.addLayers([layertwo]);  
                    // 创建卷帘 
                    var father = dom.byId('sexmain');
                    domConstruct.create("div",{ id: "sexswipeDiv"}, father, "first");
                            
                    self.sexlayerSwipe = new LayerSwipe({
                        type: "vertical",
                        top: 250,
                        map: map,
                        layers: [Sexlayertwo]
                    }, "swipeDiv");
                    self.sexlayerSwipe.startup();
                });
                // 清除对比图层
                on(dojo.byId('sexcleanLayerSwipe'),'click',function(){      
                    dojo.unsubscribe(topic_startGender);

                     var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);
                            
                    map.graphics.clear();
                    map.removeLayer(this.GenderResultLayer1);
                    map.removeLayer(this.GenderResultLayer2);
                    GenderResultLayer1 = null;
                    GenderResultLayer2 = null;
                    sexlayerSwipe.destroy();
                    sexlayerSwipe = null;
                    dom.byId('resultLayer1').innerHTML = "clearing map...";
                    dom.byId('resultLayer2').innerHTML = "clearing map...";
                });
            },

            startGenderGp:function(sexNum,sexnumLayer,sexdyStartDate,sexStartdyTime,sexEnddyTime,sexdyType){
                var self = this;
                var sexID = sexNum;
                var sexLayer = sexnumLayer;
                var sexStartDate = sexdyStartDate;
                var sexStartTime = sexStartdyTime;
                console.log(sexStartTime);
                var sexEndTime = sexEnddyTime;
                console.log(sexEndTime);
                var sexType = sexdyType
                console.log(sexType);

                var gp=new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/HridThematicMap/GPServer/Hrid");
                gp.setOutputSpatialReference({wkid:102100});
                var jobstatus = "[任务]"+sexID+":正在查询...";
                dom.byId('stateBack').innerHTML = jobstatus;
                var genderResult = dojo.xhrPost({
                    url:"/GenderInformation",
                    postData:{
                        StartDate:sexStartDate,
                        StartTime:sexStartTime,
                        EndTime:sexEndTime,
                        sexType:sexType,
                        filename:sexType
                    },
                    timeout:50000,
                    handleAs:"json"
                });
                genderResult.then(function(response){
                    console.log(response);
                    var SexJson = eval(response);
                    var eachsexJson = "";
                    var poiid = "";
                    for (var i = 0; i < SexJson.length; i++) {
                        if(i != parseInt(SexJson.length) - 1){
                            poiid+="'"+SexJson[i].poiid+"',";
                            eachsexJson += "\""+SexJson[i].poiid+"\""+":"+parseInt(SexJson[i].count)+",";
                        }else{
                            eachsexJson += "\""+SexJson[i].poiid+"\""+":"+parseInt(SexJson[i].count);
                            poiid+="'"+SexJson[i].poiid+"'";
                        }
                    }
                    var SexDate = "{"+eachsexJson+"}";
                    var JsonDate = eval("(" + SexDate + ")");
                    if(postFea!=null||postAnaArea!=null){
                    var feature;
                    var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(url);
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["poiid","checkin_nu"];
                    query.where = "poiid IN ("+poiid+")";
                    query.geometry = postAnaArea;
                    queryTask.execute(query,function(res){
                        feature=res.features;
                        console.log('feature');
                        console.log(feature);
                        console.log(feature.length+'==============----------------');
                        for(var i=0;i<feature.length;i++){
                            var poiid=feature[i].attributes.poiid;
                            var data=JsonDate[poiid];
                            feature[i].attributes.checkin_nu=data;
                        }
                        featureSet = new FeatureSet();
                        console.log(feature);   
                        featureSet.features = feature;
                        var pixel = 600;
                        console.log(pixel);
                        var params = {"pixel":parseFloat(pixel).toFixed(2),"poiPoint":featureSet};
                        console.log(params);
                        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                    })
                    }else{
                        dom.byId('stateBack').innerHTML = "[!]请选择区域后再进行计算！";
                        alert("[!]请选择区域后再进行计算！");
                        }
                        return response;
                });

                function gpJobComplete(jobinfo){
                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(false);
                    self.map.graphics.clear();
                    gp.getResultData(jobinfo.jobId,"GridSpatialJoin",function(layer){
                        console.log(layer);
                        switch(sexLayer)
                        {
                        case "1":
                        GenderResultLayer1 = layer;
                        console.log(GenderResultLayer1); 
                            break;
                        case "2":
                        GenderResultLayer2 = layer;
                        console.log(GenderResultLayer2);
                            break;
                        default:

                        }
                       topic.publish("some/topic_startGender_isDone", [sexID,sexLayer]);
                    });                      
                }

                function gpJobStatus(jobinfo){
                    var self=this;
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+sexID+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+sexID+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+sexID+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                    dom.byId('stateBack').innerHTML = jobstatus;
                }

                function gpJobFailed(error){
                    self.startGenderGp(sexID,sexLayer,sexStartDate,sexStartTime,sexEndTime,sexType);
                    // alert("运行出错！！");
                    dom.byId('stateBack').innerHTML = "[任务]"+sexID+":! ！！";
                }
            },

            // 年龄GP
            // 年龄专题图分析
            startAgeTime:function(){
                var self = this;
                var map=this.map;
                self.map.graphics.clear();

                var ageDate = dijit.byId('ageDate').toString();
                var agenewDate = new Date(ageDate);
                var ageTime =dijit.byId('ageTime').get('value');
                ageTime = ageTime.split('-');

                var agenDate= new Date(agenewDate).format("yyyy/M/d");
                console.log(agenDate);
                var StartTimeStringage = ageTime[0];
                var EndTimeStringage = ageTime[1];

                var topic_startageTime = topic.subscribe("some/topic_startageTime_isDone",function(e){
                    if(e[0]==="startageLayer" && e[1]==='1'){
                        var jobstatus = "[任务]"+"ageGPLayer1"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer1').innerHTML = "第1时段数据生成成功";
                            
                        map.addLayer(GpAgeResultLayer1);  
                            
                    }else if(e[0]==="startageLayer" && e[1]==='2'){
                        var jobstatus = "[任务]"+"ageGPLayer2"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer2').innerHTML = "第2时段数据生成成功";
                            
                        map.addLayer(GpAgeResultLayer2);
                    }else if(e[0]==="startageLayer" && e[1]==='3'){
                        var jobstatus = "[任务]"+"ageGPLayer3"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer3').innerHTML = "第3时段数据生成成功";
                            
                        map.addLayer(GpAgeResultLayer3);
                    }else if(e[0]==="startageLayer" && e[1]==='4'){
                        var jobstatus = "[任务]"+"ageGPLayer4"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer4').innerHTML = "第4时段数据生成成功";
                            
                        map.addLayer(GpAgeResultLayer4);
                    }else if(e[0]==="startageLayer" && e[1]==='5'){
                        var jobstatus = "[任务]"+"ageGPLayer5"+":结果图层添加成功...";
                        dom.byId('stateBack').innerHTML = jobstatus;
                        dom.byId('resultLayer5').innerHTML = "第5时段数据生成成功";
                            
                        map.addLayer(GpAgeResultLayer5);
                    }
                });
                this.startAgeGp("startageLayer",'1',agenDate,StartTimeStringage,EndTimeStringage,11,16);               
                this.startAgeGp("startageLayer",'2',agenDate,StartTimeStringage,EndTimeStringage,17,23);
                this.startAgeGp("startageLayer",'3',agenDate,StartTimeStringage,EndTimeStringage,24,33);
                this.startAgeGp("startageLayer",'4',agenDate,StartTimeStringage,EndTimeStringage,34,45);
                this.startAgeGp("startageLayer",'5',agenDate,StartTimeStringage,EndTimeStringage,46,75);

                清除图层
                on(dojo.byId('cleanageAgeLayer'),'click',function(){
                    dojo.unsubscribe(topic_startageTime);

                    map.graphics.clear();
                    map.removeLayer(GpAgeResultLayer1);
                    map.removeLayer(GpAgeResultLayer2);
                    map.removeLayer(GpAgeResultLayer3);
                    map.removeLayer(GpAgeResultLayer4);
                    map.removeLayer(GpAgeResultLayer5);
                    GpAgeResultLayer1 = null;
                    GpAgeResultLayer2 = null;
                    GpAgeResultLayer3 = null;
                    GpAgeResultLayer4 = null;
                    GpAgeResultLayer5 = null;

                    query(".resultLayer").forEach(function(node){
                        node.innerHTML = ".....";
                    })
                    var clusters = self.map.getLayer("clusters");
                        clusters.setVisibility(true);

                    this.ageTimeSlider.setValue(parseInt(0));
                });
             },

            startAgeGp:function(AgeID,ageLayer,ageStartDate,ageStartTime,ageEndTime,ageStart,ageEnd){
                var self = this;
                var AgeID = AgeID;
                var ageLayer = ageLayer;
                var ageStartDate = ageStartDate;
                var ageStartTime = ageStartTime;
                var ageEndTime = ageEndTime;
                var ageStart = ageStart;
                var ageEnd = ageEnd;

                var agenum1=0;
                var agenum2=0;
                var agenum3=0;
                var agenum4=0;
                var agenum5=0;


                var gp=new Geoprocessor("http://219.231.176.55:6080/arcgis/rest/services/SinaAnalysis/HridThematicMap/GPServer/Hrid");
                gp.setOutputSpatialReference({wkid:102100});
                var jobstatus = "[任务]"+AgeID+":正在查询...";
                dom.byId('stateBack').innerHTML = jobstatus;
                var agedeferredResult = dojo.xhrPost({
                    url:"/ageInformation", 
                    postData:{
                        StartDate:ageStartDate,
                        StartTime:ageStartTime,
                        EndTime:ageEndTime,
                        ageStart:ageStart,
                        ageEnd:ageEnd,
                        filename:ageEnd
                    },
                    timeout:100000,
                    handleAs:"json"
                });
                agedeferredResult.then(function(response){
                    console.log(response);
                    var AgeJson = eval(response);
                    var eachAgeJson = "";
                    var poiid = "";
                    for (var i = 0; i < AgeJson.length; i++) {
                        if(i != parseInt(AgeJson.length) - 1){
                            poiid+="'"+AgeJson[i].poiid+"',";
                            eachAgeJson += "\""+AgeJson[i].poiid+"\""+":"+parseInt(AgeJson[i].count)+",";
                        }else{
                            eachAgeJson += "\""+AgeJson[i].poiid+"\""+":"+parseInt(AgeJson[i].count);
                            poiid+="'"+AgeJson[i].poiid+"'";
                        }
                    }
                    var AgeDate = "{"+eachAgeJson+"}";
                    var JsonDate = eval("(" + AgeDate + ")");
                    if(postFea!=null||postAnaArea!=null){
                    var feature;
                    var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                    var queryTask = new QueryTask(url);
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = ["poiid","checkin_nu"];
                    query.where = "poiid IN ("+poiid+")";
                    query.geometry = postAnaArea;
                    queryTask.execute(query,function(res){
                        feature=res.features;
                        console.log('feature');
                        console.log(feature);
                        console.log(feature.length+'==============----------------');
                        for(var i=0;i<feature.length;i++){
                            var poiid=feature[i].attributes.poiid;
                            var data=JsonDate[poiid];
                            feature[i].attributes.checkin_nu=data;
                            // if (ageLayer='1') {
                            //     agenum1 += data;
                            //     dom.byId("UagenumA").innerHTML=agenum1;
                            // }else if (ageLayer='2') {
                            //     agenum2 += data;
                            //     dom.byId("UagenumB").innerHTML=agenum2;
                            // }else if (ageLayer='2') {
                            //     agenum3 += data;
                            //     dom.byId("UagenumC").innerHTML=agenum3;
                            // }else if (ageLayer='2') {
                            //     agenum4 += data;
                            //     dom.byId("UagenumD").innerHTML=agenum4;
                            // }else if (ageLayer='2') {
                            //     agenum5 += data;
                            //     dom.byId("UagenumE").innerHTML=agenum5;
                            // }
                              switch(ageLayer){
                                    case '1':
                                    agenum1 += data;
                                    dom.byId("UagenumA").innerHTML=agenum1;
                                    break;
                                    case '2':
                                    agenum2 += data;
                                    dom.byId("UagenumB").innerHTML=agenum2;
                                    break;
                                    case '3':
                                    agenum3 += data;
                                    dom.byId("UagenumC").innerHTML=agenum3;
                                    break;
                                    case '4':
                                    agenum4 += data;
                                    dom.byId("UagenumD").innerHTML=agenum4;
                                    break;
                                    case '5':
                                    agenum5 += data;
                                    dom.byId("UagenumE").innerHTML=agenum5;
                                    break;
                                    default:
                                }
                        }
                        featureSet = new FeatureSet();
                        console.log(feature);   
                        featureSet.features = feature;
                        var pixel = 600;
                        console.log(pixel);
                        var params = {"pixel":parseFloat(pixel).toFixed(2),"poiPoint":featureSet};
                        console.log(params);
                        gp.submitJob(params, gpJobComplete, gpJobStatus, gpJobFailed);
                    })
                    }else{
                        dom.byId('stateBack').innerHTML = "[!]请选择区域后再进行计算！";
                        alert("[!]请选择区域后再进行计算！");
                        }
                        return response;
                });

                function gpJobComplete(jobinfo){
                    // var clusters = self.map.getLayer("clusters");
                    // clusters.setVisibility(false);
                    self.map.graphics.clear();
                    gp.getResultData(jobinfo.jobId,"GridSpatialJoin",function(layer){
                        console.log(layer);
                        switch(ageLayer)
                        {
                        case "1":
                        GpAgeResultLayer1 = layer;
                        console.log(GpAgeResultLayer1); 
                            break;
                        case "2":
                        GpAgeResultLayer2 = layer;
                        console.log(GpAgeResultLayer2);
                            break;
                        case "3":
                        GpAgeResultLayer3 = layer;
                        console.log(GpAgeResultLayer3);
                            break;
                        case "4":
                        GpAgeResultLayer4 = layer;
                        console.log(GpAgeResultLayer4);
                            break;
                        case "5":
                        GpAgeResultLayer5 = layer;
                        console.log(GpAgeResultLayer5);
                            break;
                        default:

                        }
                       topic.publish("some/topic_startageTime_isDone", [AgeID,ageLayer]);
                    });                      
                }
                
                function gpJobStatus(jobinfo){
                    var self=this;
                    var jobstatus = '';
                    switch (jobinfo.jobStatus) {
                        case 'esriJobSubmitted':
                            jobstatus += "[任务]"+AgeID+":异步请求中...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSubmitted');
                            break;
                        case 'esriJobExecuting':
                            jobstatus += "[任务]"+AgeID+":正在执行运算...";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobExecuting');
                            break;
                        case 'esriJobSucceeded':
                            jobstatus += "[任务]"+AgeID+":运行成功！";
                            dom.byId('stateBack').innerHTML = jobstatus;
                            console.log('esriJobSucceeded');
                            break;
                    }
                    dom.byId('stateBack').innerHTML = jobstatus;
                }

                function gpJobFailed(error){
                    self.startAgeGp(AgeID,ageLayer,ageStartDate,ageStartTime,ageEndTime,ageStart,ageEnd);
                    // alert("运行出错！！");
                    dom.byId('stateBack').innerHTML = "[任务]"+ageLayer+":! ！！";
                }
            },

            //清除年龄图层 
            // agecleanMap : function() {
            //         // 清除地图
            //         var self=this;
            //         console.log("cleanMap");
            //         self.map.graphics.clear();

            //          var clusters = self.map.getLayer("clusters");
            //             clusters.setVisibility(true);
                
            //         try {
            //             //通过ID
            //             map.removeLayer(this.GpAgeResultLayer1);
            //             map.removeLayer(this.GpAgeResultLayer2);
            //             map.removeLayer(this.GpAgeResultLayer3);
            //             map.removeLayer(this.GpAgeResultLayer4);
            //             map.removeLayer(this.GpAgeResultLayer5);

            //             this.GpAgeResultLayer1 = null;
            //             this.GpAgeResultLayer2 = null;
            //             this.GpAgeResultLayer3 = null;
            //             this.GpAgeResultLayer4 = null;
            //             this.GpAgeResultLayer5 = null;
                        
            //         } catch (e) {
            //             // TODO: handle exception
            //         }                             
            // },


             // ****图层渲染**** //
            displayResult:function(layer){
                var symbol;
                var features = layer.value.features;
                console.log(features);
                for(var f=0,f1=features.length;f<f1;f++){
                    var feature = features[f];
                    var number = features[f].attributes.checkin_nu;
                if(number<1){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0, 0, 0, 0.5]), 0.001),
                    new Color([0, 0, 0, 0]));
                }else if(number<2){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0, 0, 0, 0.5]), 0.1),
                    new Color("#3FAB00"));
                }else if (number<3){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0, 0, 0, 0.5]), 0.1),
                    new Color("#91D400"));
                }else if (number<4){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0, 0, 0, 0.5]), 0.1),
                    new Color("#BBE600"));
                }else if (number<5){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0, 0, 0, 0.5]), 0.1),
                    new Color("#D1ED00"));
                }else if (number<5){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new Color([0, 0, 0, 0.5]), 0.1),
                    new Color("#FFBF00"));
                }else if (number>5){
                    symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,new  Color([0, 0, 0, 0.5]), 0.1),
                    new Color("#FF0000"));
                }
                feature.setSymbol(symbol);
                this.map.graphics.add(feature);
                }
            },
            onclose: function() {
                console.log("onclose");
                self.WidgetManager.getInstance().closeWidget('_35');
            },


        });

});