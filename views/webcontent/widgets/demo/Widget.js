/**
 * Created by Administrator on 2016/3/24 0024.
 */
define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/parser',
    'jimu/BaseWidget'],
    function(declare,lang,parser,BaseWidget){
        return declare([BaseWidget],{
            baseClass:'widgets-demo',
            name:'SimpleDemo',

            postCreate:function(){
                this.inherited(arguments);
                console.log("运行");
            },
            startup:function(){
                this.inherited(arguments);

                this.initLayout();
                this.parseXML();
                console.log("运行1");
            },
            parseXML:function(){

                //解析配置文件内容
                //var type=lang.clone(this.config.type);
                var dojoConfig = {
                    async: 1,
                    cacheBust: 0,
                    tlmSiblingOfDojo: false,
                    isDebug: true,
                    packages: [
                        { name: "bootstrap", location: "https://rawgit.com/xsokev/Dojo-Bootstrap/master" }
                    ]
                };
            },
            initLayout:function(){
                //做初始化工作


            },
            onopen:function(){
                console.log("onopen");
            },
            onclose:function(){
                console.log("onclose");
            },
            onMinimize:function(){
                console.log("onMinimize");
            },
            onMaximize:function(){
                console.log("onMaximize");
            },
            onSingIn:function(credential){

            },
            onSingOut:function(){

            }

        });

    });