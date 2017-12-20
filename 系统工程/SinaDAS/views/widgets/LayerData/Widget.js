/**
 * Created by Administrator on 2016/3/24 0024.
 * 生成一个聚类图层并加载原始点图层
 * 最后的测试获取图层，注：layer的ID十分重要
 * 后面的不需要的方法记得删除
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'jimu/BaseWidget',
        "dojo/_base/array",

        "esri/tasks/QueryTask",
        "dojo/_base/Color",
        "esri/tasks/query",
        "./ClusterLayer",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/renderers/ClassBreaksRenderer",
        "esri/symbols/SimpleLineSymbol",
        "esri/layers/FeatureLayer",
        'esri/dijit/PopupTemplate',
        'jimu/dijit/LoadingShelter',

        "dojo/domReady!"
    ],
    function(declare, lang, BaseWidget,arrayUtils,QueryTask,Color,Query,ClusterFeatureLayer,SimpleMarkerSymbol,
        ClassBreaksRenderer,SimpleLineSymbol,FeatureLayer,PopupTemplate,LoadingShelter){
        var clazz = declare([BaseWidget], {
            baseClass: 'widgets-layerdata',

            name: 'layerdata',
 
            GPoiGraphic : null,
            postCreate: function() {
                this.inherited(arguments);
                this.shelter = new LoadingShelter({
                  hidden: true
                });
                this.shelter.placeAt(this.domNode);
                console.log('this.domNode:'+this.domNode);
                this.shelter.startup();
            },
            startup: function() {
                this.inherited(arguments);
                this.shelter.show();
                this.initLayout();
                this.queryFeature();
                this.showpoint();
            },
            initLayout: function() {
                // 做初始化工作
            },
            queryFeature:function(){
                //使用Query进行查询要素为聚类图层准备数据
                console.log("queryFeature");
                var queryTask = new QueryTask("http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1");  
                var query = new Query();  
                query.returnGeometry = true;  
                query.outFields = ["poiid","category_n","title","category","address","poi_street","phone"];
                query.outSpatialReference = { wkid: 102100 };  
                query.where = "1=1";  
                queryTask.execute(query, lang.hitch(this, lang.hitch(this.addClusters))); 
            },
            showpoint:function(){
                // var poi=this.poi.checked;
                // var sina=this.sina.checked;
                // var user=this.user.checked;
                // var deferredResult = dojo.xhrPost({
                //     url:"/getpoint",
                //     postData:{
                //         poi:poi,
                //         sina:sina,Z
                //         user:user
                //     },
                //     timeout:400000,
                //     handleAs:"json"
                // }).then(function(response){
                //     console.log("response="+response.length);
                // })
                
                //添加poi FeatureLayer
                var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/1";
                var poiPoint=new FeatureLayer(url,{
                        mode : FeatureLayer.MODE_SNAPSHOT,
                        outFields : ["poiid","category_n","title","category","address","poi_street","phone"],
                        id: "poiPoint"
                        });
                console.log(url);
                this.map.addLayer(poiPoint);
                this.map.getLayer("poiPoint").hide();
                //添加user FeatureLayer
                url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/0";
                var userPoint=new FeatureLayer(url,{
                        mode : FeatureLayer.MODE_SNAPSHOT,
                        outFields : ["age","gender","user_id"],
                        id: "userPoint"
                        });
                console.log(url);
                this.map.addLayer(userPoint);
                this.map.getLayer("userPoint").hide();
            },
            addClusters:function(res){
                console.log("addClusters");
                
                var popupTemplate = PopupTemplate({
                  'title': '',
                  'fieldInfos': [{
                    'fieldName': 'poiid',
                    'label': 'poiid: ',
                    visible: true
                  }, {
                    'fieldName': 'title',
                    'label': 'title: ',
                    visible: true
                  }, {
                    'fieldName': 'category_n',
                    'label': 'attribute: ',
                    visible: true
                  }]
                });
                var defaultSym = new SimpleMarkerSymbol("circle", 4,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0, 0.55]), 3),
                        new Color([84,203,237, 1]));
                 
                var PoiInfo = {};  
                //将查询的要素按照ClusterLayer要求的数组对象进行重新组合  
                PoiInfo.data = arrayUtils.map(res.features, function (p) {  
                    var attributes = {  
                        "poiid": p.attributes["poiid"],  
                        "category_n": p.attributes["category_n"],  
                        "title": p.attributes["title"],  
                        "category": p.attributes["category"],
                        "address": p.attributes["address"],  
                        "poi_street": p.attributes["poi_street"],  
                        "phone": p.attributes["phone"]
                    };  
                    return {  
                        "x": p.geometry.x,  
                        "y": p.geometry.y,  
                        "attributes": attributes  
                    };  
                });
                //新建一个聚类图层
                var clusterLayer = new ClusterFeatureLayer({  
                    "data": PoiInfo.data,  
                    "distance": 50,
                    "id": "clusters",
                    "labelColor": "#fff",
                    "resolution": this.map.extent.getWidth() / this.map.width,
                    // "singleColor": "#888",
                    'singleTemplate': popupTemplate,
                    "singleSymbol": defaultSym,
                    "useDefaultSymbol": true
                }); 

                var renderer = new ClassBreaksRenderer(defaultSym, "clusterCount");
                var small = new SimpleMarkerSymbol("circle", 7,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([162,186,194,0.5]), 15),
                        new Color([120,157,183,0.75]));
                var medium = new SimpleMarkerSymbol("circle", 10,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([84,203,237,0.5]), 15),
                        new Color([162,186,194,0.75]));
                var large = new SimpleMarkerSymbol("circle", 20,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0,255,0,0.5]), 15),
                        new Color([84,203,237,0.75]));
                var xlarge = new SimpleMarkerSymbol("circle", 30,
                        new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255,69,0,0.5]), 15),
                        new Color([255,0,0,0.75]));   

                renderer.addBreak(0, 100, small);
                renderer.addBreak(100, 1000, medium);
                renderer.addBreak(1000, 10000, large);
                renderer.addBreak(10000, 150000, xlarge);

                clusterLayer.setRenderer(renderer);
                
                this.map.addLayer(clusterLayer);
                this.shelter.hide();
        },
        ceshi:function(){
           var poiLayer = this.map.getLayer("clusters");
           var poiPoint = this.map.getLayer("poiPoint");
           this.map.removeLayer(poiLayer);
           this.map.removeLayer(poiPoint);
           console.log("removeLayer");
        }
        });
        return clazz;
    });