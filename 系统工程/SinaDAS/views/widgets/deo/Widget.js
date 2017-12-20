/**
 * Created by Administrator on 2016/3/24 0024.
 */
define([
        'dojo/_base/declare',
        'dojo/_base/lang',
        'dojo/parser',
        'jimu/BaseWidget',
        'dijit/form/Button',
        'esri/geometry/Point',
        'esri/SpatialReference',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/graphic',
        "dijit/layout/TabContainer",
        "dijit/layout/ContentPane",
        'dojo/dom',
        'dojo/query',
        "esri/geometry/Point",
        "esri/SpatialReference",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/graphic",
        "./data",
        "dojo/domReady!"
    ],
    function(declare, lang, parser, BaseWidget,
        Button, Point, SpatialReference,
        SimpleMarkerSymbol, Graphic,
        TabContainer, ContentPane,
        dom, query, Point, SpatialReference,
        SimpleMarkerSymbol, Graphic,data) {
        return declare([BaseWidget], {

            baseClass: 'widgets-demo',
            name: 'SimpleDemo',
            postCreate: function() {
                this.inherited(arguments);
                console.log("运行");
            },
            startup: function() {
                // parser.parse();
                // parser.instantiate(query(".tabco"));
                this.inherited(arguments);

                // this.initLayout();
                // this.parseXML();
                var chart = c3.generate({
                bindto: '#chart',
                data: {
                    columns: [
                        ["Design", 40],
                        ["Work-Out", 15],
                        ["Social", 20], // id, value
                        ["Coding", 70],
                        ["Research", 25], 
                        ["Coffee", 10], 
                        ["Hang-Out", 15]
                    ],
                    colors: {
                        "Social": '#F27E88', // id, color value
                        "Coding": '#ADB8D9', 
                        "Work-Out": '#CCCCCC', 
                        "Design": '#7E8C69', 
                        "Research": '#94A66F', 
                        "Coffee": '#FC0'
                    },
                    type : 'donut',
                    // onmouseover: function (d, i) { console.log("onmouseover", d, i, this); },
                    // onmouseout: function (d, i) { console.log("onmouseout", d, i, this); },
                    // onclick: function (d, i) { console.log("onclick", d, i, this); },
                    order: null, // set null to disable sort of data. desc is the default.
                },
                tooltip: {
                    format: {
                        value: function (value, ratio, id, index) { 
                            var ratio = Math.floor( ratio * 100 );
                            return ratio + '%'; 
                            // return id; 
                        }
                    }
                    // ,
                    // position: function (data, width, height, element) {
                    //  return {top: 0, left: 0}
                    // }
                },
                // size: {
                //  width: 640
                // },
                interaction: {
                    enabled: true
                },
                // transition: {
                //  duration: 1000
                // },
                // axis: {
                //  x: {
                //      label: 'Sepal.Width'
                //  },
                //  y: {
                //      label: 'Petal.Width'
                //  }
                // },
                donut: {
                    label: {
                        show: true,
                        format: function (value, ratio, id) {
                            return value;
                        }
                    },
                    title: "Weekly Activities",
                    width: 50
                }
            });

setTimeout(function () {
    chart.load({
        columns: [
            ['War-Game', 30],
            ['Watching TV', 10]
        ],
        colors: {
            "War-Game": '#ADB8D9',
            "Watching TV": 'green'
        },
        unload : [
            'Work-Out', 
            'Design',
            'Coding'
        ]
    });
}, 1500);


                // dojo.connect("mapmanager.showMap",ShowLocation);

            },
            parseXML: function() {
                //解析配置文件内容
                var type = lang.clone(this.config.type);
                var dojoConfig = {
                    async: 1,
                    cacheBust: 0,
                    tlmSiblingOfDojo: false,
                    isDebug: true
                };
            },
            initLayout: function() {
                // 做初始化工作
                var myButton = new Button({
                    label: "Click me!",
                    onClick: function() {
                        // Do something:
                        dom.byId("result").innerHTML += "Thank you! ";
                    }
                }, "progButtonNode1").startup();


                var tc = new TabContainer({
                    style: "height: 100%; width: 100%;"
                }, "tc1-prog1");

                var cp1 = new ContentPane({
                    title: "Food",
                    content: "We offer amazing food"
                });
                tc.addChild(cp1);

                var cp2 = new ContentPane({
                    title: "Drinks",
                    content: "We are known for our drinks."
                });
                tc.addChild(cp2);

                tc.startup();

                
            },
            showpoint: function() {
                var point = new Point(113, 37, new SpatialReference({
                    wkid: 4326
                }));
                var simpleMarkerSymbol = new SimpleMarkerSymbol();
                var graphic = new Graphic(point, simpleMarkerSymbol);
                this.map.graphics.add(graphic);
            },
            onopen: function() {
                console.log("onopen");

            },
            onclose: function() {
                console.log("onclose");
            },
            onMinimize: function() {
                console.log("onMinimize");
            },
            onMaximize: function() {
                console.log("onMaximize");
            },
            onSingIn: function(credential) {

            },
            onSingOut: function() {

            }

        });

    });