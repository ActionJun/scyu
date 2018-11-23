var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRourte=require('./routes/product');
var renrenRourte=require('./routes/renren');
var orderRourte=require('./routes/order')
//session模块
var session =require('express-session') // 下载
var app = express();
//  格式
app.use(session({
	    name:'tianmao',
	    secret:'tianmao',
	    cookie:{
	    	maxAge:80000000000 //
	    },
	    resave:false, //每次请求是否重新设置session
//	指每次请求重新设置 session cookie ,假如你设置的 cookie有效 10分钟    
	    saveUninitialized:false //每次请求是否初始化session	    
}))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product',productRourte);
app.use('/renren',renrenRourte);
app.use('/order',orderRourte);



module.exports = app;

