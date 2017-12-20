/**
 * Created by Administrator on 2016/3/24 0024.
 */
define([
        'dojo/_base/declare',
        'dojo/parser',
        'jimu/BaseWidget',
        'dojo/dom',
        'dojo/on',
        "esri/tasks/QueryTask",
        "esri/tasks/query",
        "esri/Color",
        'jimu/WidgetManager',
        "esri/tasks/query",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/Color",
        "esri/graphic",
        "esri/toolbars/draw",
        "esri/symbols/SimpleFillSymbol",
        'dojo/domReady!'
    ],
    function(declare, parser, BaseWidget,dom,on,QueryTask,query,color,WidgetManager,Query,
        SimpleMarkerSymbol,SimpleLineSymbol,Color,Graphic,Draw,SimpleFillSymbol) {

        return declare([BaseWidget], {
            // 名称
            baseClass: 'widgets-UsersAnalysis',
            // 类似别名
            name: 'UsersAnalysis',

            red: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,5, 
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, 
                                     new Color([238, 0, 0, 1]),1),
                                     new Color([238, 0, 0, 1])),
            blue: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,5, 
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, 
                                     new Color([24, 116, 205, 1]),1),
                                     new Color([24, 116, 205, 1])),
            green: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,5, 
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, 
                                     new Color([102, 205, 0, 1]),1),
                                     new Color([102, 205, 0, 1])),
            purple: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,5, 
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, 
                                     new Color([154, 50, 205, 1]),1),
                                     new Color([154, 50, 205, 1])),  
            orange: new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE,5, 
                                     new SimpleLineSymbol(SimpleLineSymbol.STYLE_NULL, 
                                     new Color([255, 127, 0, 1]),1),
                                     new Color([255, 127, 0, 1])),  
            // 初始化方法
            postCreate: function() {
                this.inherited(arguments);
            },
            startup: function() {
                parser.parse(); 
                this.initLayout();
                this.inherited(arguments);
            },
            onOpen: function() {
                console.log("onopen");
                WidgetManager. getInstance().openWidget('_35');
                selectlayer=2;

            },
            initLayout: function() {
                // 做初始化工作
                var agestatistics=document.getElementById('agestatistics');
                var mainpopulation=document.getElementById('mainpopulation');
                var sexstatistics=document.getElementById('sexstatistics');
                var populationstatistics=document.getElementById('populationstatistics');

                agestatistics.style.display="block";mainpopulation.style.display="none";
                sexstatistics.style.display="none";populationstatistics.style.display="none";
                
                // 初始化饼状图
                var agechart = c3.generate({
                    bindto:'#chart1',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                        columns: [
                            ['11 - 16 (岁)',120],
                            ['17 - 23 (岁)',500],
                            ['24 - 33 (岁)',480],
                            ['34 - 45 (岁)',230],
                            ['> 46(岁)',100]
                        ],
                        type : 'pie'
                    },
                    /*color:{
                        pattern: ['#63B8FF', '#836FFF', '#EEAEEE', '#008B8B', '#7FFFD4'],
                    }*/
                    /*color:{
                        pattern: ['#FF4500', '#FF8C00', '#FFD39B', '#ADFF2F', '#00B2EE'],
                    }*/
                });
                
                var mainagegroupchart = c3.generate({
                    bindto:'#chart2',
                     size: {
                        width: 300,
                         height:300
                    },
                    data: {
                         // iris data from R
                         columns: [
                             ['17 - 23 (岁)',600],
                             ['24 - 33 (岁)',450],
                        ],   
                        type : 'pie'
                    }
                });
                var genderchart = c3.generate({
                    bindto:'#chart3',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                         // iris data from R
                        columns: [
                            ['男',450],
                            ['女',495],

                        ],
                        
                        type : 'pie'
                    },
                    color:{
                        pattern: ['#1874CD', '#FF8C00'],
                    }
                    /*color: {
                        pattern: ['#FF8C00', '#1874CD'],
                    }*/
                });
                var areachart = c3.generate({
                    bindto:'#chart4',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                         // iris data from R
                        columns: [
                            ['主城区',3000],
                            ['外围城区',2000],
                        ],   
                        type : 'pie'
                    }
                });
        
            },
            agequery:function(){
                console.log("agequery");
                if(postFea===null||postAnaArea===null){
                    alert('未选择任何图层！请先进行选择！');
                }
                else{
                    // postAnaArea
                    var agegroupone=0;
                    var agegrouptwo=0;
                    var agegroupthree=0;
                    var agegroupfour=0;
                    var agegroupfive=0;
                    var self=this;
                    self.map.graphics.clear();
                    console.log(postAnaArea);
                    for(var i=0;i<postFea.length;i++){
                    if(postFea[i].attributes.age>=11&&postFea[i].attributes.age<=16){
                        agegroupone++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.blue));
                    }
                    else if(postFea[i].attributes.age>=17&&postFea[i].attributes.age<=23){
                        agegrouptwo++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.orange));
 }
                    else if(postFea[i].attributes.age>=24&&postFea[i].attributes.age<=33){
                        agegroupthree++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.green));
                    }
                    else if(postFea[i].attributes.age>=34&&postFea[i].attributes.age<=45){
                        agegroupfour++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.red));
                    }
                    else if(postFea[i].attributes.age>=46&&postFea[i].attributes.age<=75){
                        agegroupfive++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.purple));
                    }
                   }
                    dom.byId("AgeGrouptotal").innerHTML=agegroupone+agegrouptwo+agegroupthree+agegroupfour+agegroupfive;
                    dom.byId("AgeGroupone").innerHTML=agegroupone;
                    dom.byId("AgeGrouptwo").innerHTML=agegrouptwo;
                    dom.byId("AgeGroupthree").innerHTML=agegroupthree;
                    dom.byId("AgeGroupfour").innerHTML=agegroupfour;
                    dom.byId("AgeGroupfive").innerHTML=agegroupfive;

                    agechart = c3.generate({
                    bindto:'#chart1',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                        columns: [
                            ['11 - 16 (岁)',agegroupone],
                            ['17 - 23 (岁)',agegrouptwo],
                            ['24 - 33 (岁)',agegroupthree],
                            ['34 - 45 (岁)',agegroupfour],
                            ['> 46(岁)',agegroupfive]
                        ],
                        type : 'pie'
                    }
                });
                }                                              
            },
            mainagequery:function(){
                console.log("mainagequery");
                if(postFea===null||postAnaArea===null){
                    alert('未选择任何图层！请先进行选择！');
                }
                else{
                    // postAnaArea
                    var mainagegroupone=0;
                    var mainagegrouptwo=0;
                    var self=this;
                    self.map.graphics.clear();
                    console.log(postAnaArea);
                    for(var i=0;i<postFea.length;i++){
                    if(postFea[i].attributes.age>=17&&postFea[i].attributes.age<=23){
                        mainagegroupone++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.blue));
                    }
                    else if(postFea[i].attributes.age>=24&&postFea[i].attributes.age<=33){
                        mainagegrouptwo++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.orange));
                    }
                   }
                    dom.byId("MainAgeGrouptotal").innerHTML=postFea.length;
                    dom.byId("MainAgeGroupone").innerHTML=mainagegroupone;
                    dom.byId("MainAgeGrouptwo").innerHTML=mainagegrouptwo;

                    mainagegroupchart = c3.generate({
                    bindto:'#chart2',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                         // iris data from R
                         columns: [
                             ['17 - 23 (岁)',mainagegroupone],
                             ['24 - 33 (岁)',mainagegrouptwo]
                        ],    
                        type : 'pie'
                    }
                });
                    console.log(mainagegroupchart);
                }                                              
            },
            genderquery:function(){
                console.log("genderquery");
                if(postFea===null||postAnaArea===null){
                    alert('未选择任何图层！请先进行选择！');
                }
                else{
                    // postAnaArea
                    var f=0;
                    var m=0;
                    var self=this;
                    self.map.graphics.clear();
                   for(var i=0;i<postFea.length;i++){
                    if(postFea[i].attributes.gender==='m'){
                        m++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.blue));
                        
                    }
                    
                    else{
                        f++;
                        self.map.graphics.add(new Graphic(postFea[i].geometry,this.orange));
                    }
                   }
                dom.byId("total").innerHTML=f+m;
                dom.byId("mancount").innerHTML=m;
                dom.byId("femalecount").innerHTML=f;


                genderchart = c3.generate({
                    bindto:'#chart3',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                         // iris data from R
                        columns: [
                            ['男',m],
                            ['女',f]
                        ],

                        type : 'pie'
                    }
                });
                }                                      
            },

            populationquery:function(){
                var self=this;
                var geometryArea1;
                var populationcount=0;
                var populationarea=0;
                var areaDraw = new Draw(this.map);
                var clusters = this.map.getLayer("clusters");
                clusters.setVisibility(false);
                areaDraw.deactivate();  
                var url="http://219.231.176.20:6080/arcgis/rest/services/sinaData/sina/FeatureServer/3";
                var queryTask = new QueryTask(url);
                var query = new Query();
                query.returnGeometry = true;
                query.outFields = [ "*" ];
                query.outSpatialReference = {
                    wkid : 102100
                };
                query.where = "PYNAME  = '主城区' OR PYNAME  = '外围城区'";
                var graphic;
                var graphic1;
                queryTask.execute(query,function(resp) {
                var features = resp.features;
                console.log(features.length);
                if (features.length > 0) {
                // var area = features[0].attributes.Area_mi;
                        
                var circleSymb = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL,
                                 new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                                 new Color([105, 105, 105]),2), 
                                 new Color([255, 255, 0, 0.25]));
                graphic = new Graphic(features[0].geometry,circleSymb);
                graphic1 = new Graphic(features[1].geometry,circleSymb);
                self.map.graphics.clear();
                self.map.graphics.add(graphic);
                self.map.graphics.add(graphic1);
                }         
                            
                geometryArea1 = features[0].geometry;
                geometryArea2 = features[1].geometry;
                console.log(geometryArea1);
                var querypoi = new Query();
                querypoi.returnGeometry = true;
                var Layer = self.map.getLayer("userPoint");
                querypoi.outFields = ["age","gender","user_id"];
                querypoi.geometry = geometryArea1; 
                Layer.queryFeatures(querypoi,  function(results){
                var features= results.features;
                console.log("_______"+features.length+"jjjjjj"+1);
                populationcount=features.length;
                dom.byId("populationcount").innerHTML=populationcount;
                genderchart = c3.generate({
                    bindto:'#chart4',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                         // iris data from R
                        columns: [
                            ['主城区',populationarea],
                            ['外围城区',populationcount]
                        ],

                        type : 'pie'
                    }
                });
                dom.byId("populationareatotal").innerHTML=populationarea+populationcount;
                for (var j = 0; j < features.length; j++) {
                    self.map.graphics.add(new Graphic(features[j].geometry,self.orange));
                }       
                });
                querypoi.geometry = geometryArea2;
                Layer.queryFeatures(querypoi,  function(results){
                var featuress= results.features;
                console.log("_______"+featuress.length+"jjjjjj"+2);
                populationarea=featuress.length;
                dom.byId("populationarea").innerHTML=populationarea;
                dom.byId("populationareatotal").innerHTML=populationarea+populationcount;
                genderchart = c3.generate({
                    bindto:'#chart4',
                    size: {
                        width: 300,
                        height:300
                    },
                    data: {
                         // iris data from R
                        columns: [
                            ['主城区',populationarea],
                            ['外围城区',populationcount]
                        ],

                        type : 'pie'
                    }
                });
                for (var j = 0; j < featuress.length; j++) {
                    self.map.graphics.add(new Graphic(featuress[j].geometry,self.blue));
                }       
                });
                });
                },
            
            onClose: function() {
                console.log("onclose");
                WidgetManager. getInstance().closeWidget('_35');
            },
            clean: function(){
                this.map.graphics.clear();
                postFea = null;
                var clusters = this.map.getLayer("clusters");
                clusters.setVisibility(true);
            }
        });            
});
 