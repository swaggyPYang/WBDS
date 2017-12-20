/**
 * Created by Administrator on 2016/3/24 0024.
 */
define([
        'dojo/_base/declare',
        'dojo/parser',
        'jimu/BaseWidget',
        'jimu/WidgetManager',
        "esri/Color",
        "esri/symbols/SimpleLineSymbol",
        "esri/geometry/webMercatorUtils",
        "esri/geometry/Polyline",
        "esri/tasks/QueryTask", 
        "esri/tasks/query",
        "esri/graphic",
        "esri/layers/GraphicsLayer",
        "dojo/domReady!"
    ],
    function(declare,parser,BaseWidget,WidgetManager,Color,SimpleLineSymbol,
        webMercatorUtils,Polyline,QueryTask,Query,Graphic,GraphicsLayer){
        return declare([BaseWidget], {
            baseClass: 'dynamicDataFlow',
            name: 'dynamicDataFlow',
            widgetsInTemplate : true,
            showFlows:null,
            showclusterFlows:null,
            renderodLayer:null,
            FlowsLayer : new GraphicsLayer({id:"SiteDataAnalysis_FlowsLayer"}),
            postCreate: function() {
                this.inherited(arguments); 
                console.log("运行");               
            },
            startup: function() {
                var self=this;
                this.inherited(arguments);
                parser.parse();  
                this.initLayout();
                
            },
            onOpen: function() {
                console.log("onopen");
                WidgetManager.getInstance().closeWidget('_35');
                selectlayer=1;
            },
            initLayout: function() {
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
            }, 
            //未聚类的居民签到变化
            GetFlows:function(){
                var self=this;
                var flownewDate = dijit.byId('flowDate').toString();
                var flowDate= new Date(flownewDate).format("yyyy/M/d");
                var flowTimeStart = dijit.byId('AnalysisTimeFrom').toString();
                var flowTimeEnd = dijit.byId('AnalysisTimeTo').toString();
                console.log(flowDate);
                console.log(flowTimeEnd);
                var ajaxDreturn = dojo.xhrPost({ 
                    url: "/FlowServlet",  
                    postData: {
                        StartDate : flowDate,
                        StartTime : flowTimeStart,
                        StopTime : flowTimeEnd,
                        filename:flowDate
                    },
                    timeout:500000,
                    handleAs: "json"
                });
                ajaxDreturn.then(function(response){
                    var flowJson = response;
                    console.log(flowJson);
                    for(var i=0;i<flowJson.length ;i++){
                        var queryTaska= new QueryTask("http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1");
                        var querya =new Query();
                        querya.returnGeometry = true;
                        querya.outFields = ["poiid","x","y"];
                        querya.outSpatialReference = { wkid: 102100 };
                        var len=flowJson[i].poiid.length;
                        querya.where = "poiid = "+ "'"+flowJson[i].poiid.substring(0,20)+"'" + " OR " +"poiid = "+"'"+ flowJson[i].poiid.substring(len-20,len)+"'";
                        queryTaska.execute(querya,function(resp){
                            console.log(len);
                            var SimpleLine = new SimpleLineSymbol("solid", new Color([64,172,0,1]),1); 
                            var Xa = resp.features[0].geometry.x;
                            var Ya = resp.features[0].geometry.y;
                            var Xb = resp.features[1].geometry.x;
                            var Yb = resp.features[1].geometry.y;
                            var valuea = webMercatorUtils.xyToLngLat(Xa, Ya, true);
                            var valueb = webMercatorUtils.xyToLngLat(Xb, Yb, true);

                            var singlePathPolyline = new Polyline([[valuea[0], valuea[1]], [valueb[0], valueb[1]]]);

                            var DatalineGraphicGH = new Graphic(singlePathPolyline,SimpleLine);
                            self.FlowsLayer.add(DatalineGraphicGH);
                            self.map.graphics.clear();
                            self.map.addLayer(self.FlowsLayer);
                        });
                    }
                });
            },

            cleanGetFlows : function(){
                this.FlowsLayer.clear();
            },

            onClose: function() {
                console.log("onclose");
            }
        });

});