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
        "./data",
        "dojo/ready",
        "dojo/domReady!"
    ],
    function(declare, lang, parser, BaseWidget,
        Button, Point, SpatialReference,
        SimpleMarkerSymbol, Graphic,
        TabContainer, ContentPane,
        dom, query, Point, SpatialReference,
        SimpleMarkerSymbol,data,ready) {
        return declare([BaseWidget], {
            baseClass: 'widgets-demo',
            name: 'SimpleDemo',
            postCreate: function() {
                this.inherited(arguments);

                console.log("运行");
            },
            startup: function() {

                parser.parse();
                parser.instantiate(query(".tabcon"));
                
                this.inherited(arguments);

                this.initLayout();
                // dojo.connect("mapmanager.showMap",ShowLocation);

            },
            initLayout: function() {
                // 做初始化工作
                var myButton = new Button({
                    label: "Click me!",
                    onClick: function() {
                        // Do something:
                        dom.byId("result").innerHTML += "Thank you! ";
                    }
                }, "progButtonNode").startup();


                var tc = new TabContainer({
                    style: "height: 100%; width: 100%;"
                }, "tc1-prog");

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