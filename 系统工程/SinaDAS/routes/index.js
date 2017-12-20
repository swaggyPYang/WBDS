"use strict"
var env = require("env2")("../config.env");
var express = require("express");
var router = express.Router();

var UserData = require("./userData.js");
var OdFlow = require('./odFlow.js');

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "webappbulide" });
});

var user = require('../mongoDB/user.js');
/* GET login page. */
router.route("/login").get(function(req,res){
	res.render("login",{title:'User Login'});
}).post(function(req,res){ 
	var uname = req.body.username;
	user.getuser.findOne({"$or":[{name:uname}, {mailbox:uname}]},function(err,doc){
		console.log(doc);
		if(err){
			res.send(500);
			console.log(err);
		}else if(!doc){
			req.session.error = '用户名不存在';
			res.send(404);
		}else{ 
			if(req.body.password != doc.password){
				req.session.error = "密码错误";
				res.send(404);
			}else{
				req.session.user = doc;
				console.log('sucess');
				res.redirect("/");
			}
		}
	});
});

/* GET register page. */
router.route("/register").get(function(req,res){
	res.render("register",{title:'User register'});
}).post(function(req,res){ 
	var uname = req.body.usernamesignup;
	var emailsignup=req.body.emailsignup;
	var upwd = req.body.passwordsignup;
	user.getuser.findOne({"$or":[{name:uname}, {mailbox:uname}]},function(err,doc){
		console.log(doc);
		if(err){ 
			res.send(500);
			// req.session.error =  '网络异常错误！';
			console.log(err);
		}else if(doc){ 
			// req.session.error = '用户名已存在！';
			res.send(500);
		}else{ 
			user.getuser.create({
				name: uname,
				mailbox: emailsignup,
				password: upwd
			},function(err,doc){ 
				console.log(doc+"+++++++++++++++++++++++++++++++");
		 if (err) {
                res.send(500);
                console.log(err);
            } else {
                // req.session.error = '用户名创建成功！';
                res.send(200);
            }
          });
		}
	});
});



router.post("/userInformation",UserData.userInformation);
router.post("/DynamicInfosservlet",UserData.DynamicInfosservlet);
router.post("/workuserInformation",UserData.workuserInformation);
router.post("/GenderInformation",UserData.GenderInformation);
router.post("/ageInformation",UserData.ageInformation);
router.post('/FlowServlet',OdFlow.FlowServlet);

module.exports = router;