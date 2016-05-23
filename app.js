var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//加载路由控制
var routes=require('./routes/index');

var ejs = require('ejs');
//创建实例
var app = express();

//定义使用html模板引擎和模板文件位置
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views/webcontent')));

//匹配路径和路由
app.use('/', routes);

//404错误处理
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// 开发环境，500错误处理和错误堆栈跟踪
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

// 生产环境，500错误处理
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
//这是 4.x 默认的配置，分离了 app 模块,将它注释即可，上线时可以重新改回来

 //var debug = require('debug')('my-application'); // debug模块
 //app.set('port', process.env.PORT || 3001); // 设定监听端口
 //console.log("RUN IN PORT :<<<<<<<" + app.get('port')+">>>>>>>");
 //
 ////启动监听
 //var server = app.listen(app.get('port'), function() {
 //  debug('Express server listening on port ' + server.address().port);
 //});