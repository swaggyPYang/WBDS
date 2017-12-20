/**
 * Created by Administrator on 2016/3/24 0024.
 * 加载的选择分析的区域
 * {postAnaApostFea/selectlayer全局变量，从env.js里面设置，有需要可以自己添加}
 * 注：this作用区域是有限的，可以使用self（相当于lang.hitch）来扩展其区域
 * 下面.then测试，删除；
 * 以下为实例选择，需要什么自己写
 * userPoint用户点图层，poiPoint用户签到图层
 */
define([
        'dojo/_base/declare',
        'dojo/parser',
        'jimu/BaseWidget',
        'dojo/on',
        "esri/tasks/QueryTask", 
        "esri/tasks/query",
        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/Color",
        "esri/graphic",
        "esri/graphicsUtils",
        "esri/toolbars/draw",
        'jimu/dijit/LoadingShelter',
        "dojo/domReady!"
    ],
    function(declare, parser, BaseWidget,on,QueryTask,Query,SimpleFillSymbol,SimpleLineSymbol,
        SimpleMarkerSymbol,Color,Graphic,graphicsUtils,Draw,LoadingShelter) {
        return declare([BaseWidget], {
            baseClass: 'widgets-selectfeature',
            name: 'SelectFeature',
            selectONEv:'',
            selectTWOv:'',
            AnalysisArea:null,
            serverurl:'http://219.231.176.20:6080/arcgis/rest/services/',
            postCreate: function() {
                this.inherited(arguments);
            },
            startup: function() {
                
                parser.parse();
                this.inherited(arguments);
                this.initLayout();
                this.shelter = new LoadingShelter({
                  hidden: true
                });
                this.shelter.placeAt(this.domNode);
                this.shelter.startup();

            },
            initLayout: function() {
                // 做初始化工作
                var img=document.getElementById('img');
                on(img,"click",function(){
                    if(document.getElementById("tool").style.display==="block"){
                        document.getElementById("tool").style.display="none";
                    }
                    else{
                        document.getElementById("tool").style.display="block";
                    }
                }); 
            },

            onOpen: function() {
                console.log("onopen");
                //   Date.prototype.format = function(format)
                //     {
                //     var o = {
                //     "M+" : this.getMonth()+1, //month
                //     "d+" : this.getDate(),   //day
                //     "h+" : this.getHours(),  //hour
                //     "m+" : this.getMinutes(), //minute
                //     "s+" : this.getSeconds(), //second
                //     "q+" : Math.floor((this.getMonth()+3)/3), //quarter
                //     "S" : this.getMilliseconds() //millisecond
                //     }
                //     if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                //     (this.getFullYear()+"").substr(4 - RegExp.$1.length));
                //     for(var k in o)if(new RegExp("("+ k +")").test(format))
                //     format = format.replace(RegExp.$1,
                //     RegExp.$1.length==1 ? o[k] :
                //     ("00"+ o[k]).substr((""+ o[k]).length));
                //     return format;
                //     };
                // var str= new Date(2015,8,29).format("yyyy/MM/dd") ;


            },
            onClose: function() {
                console.log("onclose");
            },
            startSearch : function() {
                var self=this;
                // this.selectONEv = this.selectONE.value ;
                this.selectONEv = dijit.byId('selectONE').getValue();
                this.selectTWOv =dijit.byId('selectTWO').getValue();

                var isRadioOne = dijit.byId('analysisRadioONE').get('checked');
                var isRadioTwo = dijit.byId('analysisRadioTWO').get('checked');

                var areaDraw = new Draw(this.map);
                if (isRadioOne) {
                    var clusters = this.map.getLayer("clusters");
                    clusters.setVisibility(false);
                    areaDraw.deactivate();  
                    var url=self.serverurl+"sinaData/sina/FeatureServer/4";
                    var queryTask = new QueryTask(url);
                    var query = new Query();
                    query.returnGeometry = true;
                    query.outFields = [ "*" ];
                    query.outSpatialReference = {
                        wkid : 102100
                    };
                    //判断是否为全市
                    if(this.selectONEv!=='北京市'){
                    query.where = "PYNAME  = '" + this.selectONEv+"'";
                    }
                    else{
                    url=self.serverurl+"sinaData/sina/FeatureServer/2";
                    queryTask = new QueryTask(url);
                    query = new Query();
                    query.returnGeometry = true;
                    query.outFields = [ "*" ];
                    query.outSpatialReference = {
                    wkid : 102100};
                    query.where = "PYNAME  = '北京市'";  
                    }
                    var graphic;
                    queryTask.execute(query,function Data(resp) {
                                var features = resp.features;
                                if (features.length > 0) {
                                // var area = features[0].attributes.Area_mi;
                                postAnaA = features;
                                var circleSymb = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                                                 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                                                 new Color([105, 105, 105]),2), 
                                                 new Color([255, 255, 0, 0.25]));
                                graphic = new Graphic(features[0].geometry,circleSymb);
                                self.map.graphics.clear();
                                self.map.graphics.add(graphic);
                                self.map.setExtent(graphicsUtils.graphicsExtent(features), true);
                                }
                                
                                
                    self.AnalysisArea = features[0].geometry;
                    
                    self.shelter.show();
                    self.SearchPoint();
                    });

                }
                else if (isRadioTwo) {
                    this.selectTWOv = dijit.byId('selectTWO').getValue();
                    if (this.selectTWOv === 'Polygon') {
                        self.map.graphics.clear();
                        areaDraw.deactivate();
                        areaDraw.activate(Draw.POLYGON);
                    } else if (this.selectTWOv === "Circle") {
                        self.map.graphics.clear();
                        areaDraw.deactivate();
                        areaDraw.activate(Draw.CIRCLE);
                    } else if (this.selectTWOv === "FreehandPolygon") {
                        self.map.graphics.clear();
                        areaDraw.deactivate();
                        areaDraw.activate(Draw.FREEHAND_POLYGON);
                    }
                    areaDraw.on("draw-end", function addGraphic(evt) {
                    areaDraw.deactivate();

                    //移除聚类图层
                    var clusters = self.map.getLayer("clusters");
                    clusters.setVisibility(false);
                    
                    var circleSymb = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                                     new Color([105, 105, 105]),2), 
                                     new Color([255, 255, 0, 0.25]));
                      
                    self.map.graphics.clear();
                    self.map.graphics.add(new Graphic(evt.geometry,circleSymb));
                    self.AnalysisArea = evt.geometry;
                    self.SearchPoint();
                    });
                }
                                    
            },
            SearchPoint: function(){
                //通过面积查询点
                this.shelter.show();

                var self=this;
                var Layer=null;
                var geometryArea = self.AnalysisArea;
                
                var query = new Query();
                query.returnGeometry = true;
                if(selectlayer===1){
                    Layer = this.map.getLayer("poiPoint"); 
                    query.outFields = ["poiid","category_n","title","category","address","poi_street","phone"];
                }
                else if(selectlayer===2){
                    Layer = this.map.getLayer("userPoint");
                    query.outFields = ["age","gender","user_id"];
                }
                query.geometry = geometryArea; 
                Layer.queryFeatures(query,  function(results){
                    var features= results.features;
                    if(features.length>0){
                        var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,5, 
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, 
                                     new Color([247, 34, 101, 0.9]),1),
                                     new Color([207, 34, 171, 0.5]));
                        
                        for (var i = 0; i < features.length; i++) {
                            self.map.graphics.add(new Graphic(features[i].geometry,symbol));
                            
                        }
                        
                        //将拿到的features赋值postFea
                        postFea = features;
                        self.map.setExtent(graphicsUtils.graphicsExtent(features), true);
                    self.shelter.hide();
                    }else{
                        alert("未查询到站点");
                        self.shelter.hide();
                    }
                });
                postAnaArea = self.AnalysisArea;
            },
             cleanMap : function(){
                this.map.graphics.clear();
                postFea = null;
                var clusters = this.map.getLayer("clusters");
                clusters.setVisibility(true);
            },
            _onChange:function(){
                for(let i=0;i<10;i++){console.log(i)}
            }

        });

    });