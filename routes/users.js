var express =require('express');
var router=express.Router();
var crypto=require('crypto');
var mongo=require("./dbfengzhuang");
// 处理 mongodb里面的 _id格式 _id:Object("asdsad")
var ObjectId=require('mongodb').ObjectID 

//构造函数  存用户信息
		function User(users){
			this.name=users.name;
			this.veri=users.veri;
			this.password=users.password;
			this.id=users.id;
		}
		//验证码功能
//  请求验证码   	/users/adminVeri?action=veri
//验证验证码        users/adminVeri?action=checkVeri
router.get('/adminVeri',function(req,res,next){
	// res---response----响应
	//前端get传来的参数 req--request  用req.query
	//前端post传来的参数  用req.body
	if(req.query.action=='veri'){
		var veriCode='';
		var codearr='ABCDEFGHIGKLMNabcdefghijklmnopqrstuvwxyz0123456789'
		for(var i=0;i<4;i++){
			veriCode+=codearr[Math.floor(Math.random()*codearr.length)]
		}
		
			var newUser=new User({
				name:"",
				veri:veriCode,
				password:"",
				id:"",
			})
			req.session.user=newUser;////存储到session
			
			res.send('{"success":"成功","veri":"'+veriCode+'"}')
	}else if(req.query.action=="checkVeri"){
		//识别验证码--和session中比较
		if(req.query.veri.toLowerCase()==req.session.user.veri.toLowerCase()){
			res.send('{"success":"校验成功"}')
		}else{
			res.send('{"err":"校验失败"}')
		}
	}
	
});

//注册和登录接口
//  注册功能  /users/LoginAndReg?action=reg
router.post("/LoginAndReg",function(req,res,next){
	if(req.body.action=="reg"){
		mongo("find","Administor",null,function(arr){
			
			var userInfos={
				
			}
			
			userInfos.tokenId=arr.length+1;//用户id
			userInfos.creatAt=new Date();//创建时间
			userInfos.power=req.body.power;//权限
			userInfos.powerCode=req.body.power=="会员"?1:2;//权限码
			userInfos.userName=req.body.userName==""?"false":req.body.userName;//用户名
			userInfos.turename=req.body.turename==""?"false":req.body.turename//真实姓名
			var MD5=crypto.createHash('md5')//密码
			userInfos.password=MD5.update(req.body.password).digest('base64')//加密密码 --转成64位
			userInfos.phone=/^1\d{10}$/.test(parseInt(req.body.phone))?req.body.phone:"false"
			
			//判断用户名和真实姓名不为空
			if(userInfos.userName!="false"&&userInfos.turename!="false"){
				//判断用户名是否存在
				mongo("find","Administor",{userName:req.body.userName},function(data){
					if(data.length==0){
						//添加到数据库
						mongo("add","Administor",userInfos,function(result){
							if(res.length==0){
								res.send('{"err":"注册失败"}')
							}else{
								res.send('{"success":"注册成功"}')
							}
						})
					}else{
						res.send('{"err":"用户已经被注册了"}')
					}
				})
			}else{
				res.send('{"err":"格式错误"}')
			}
		})
	}else if(req.body.action=="login"){
//		密码
		var MD5=crypto.createHash('md5');
		//加密密码--转成64位
		var password=MD5.update(req.body.password).digest('base64');
		//前端传来的账号密码
		var sel={userName:req.body.userName,password:password}
//		数据库中查找
		mongo("find","Administor",sel,function(result){
			if(result.length==0){
				res.send('{"err":"用户名或密码错误"}')
			}else{
				req.session.user.name=req.body.userName;
				req.session.user.password=password;
				req.session.user.id=result[0]._id;
				res.send('{"success":"登录成功"}')
			}
		})
		
	}
})
//退出登录系统
		router.get("/Adminquit",function(req,res,next){
			if(req.query.action=="quit"){
				//退出系统
				if(req.session.user){
					//清空session的值
					req.session.user={};
					res.send('{"success":"退出成功"}')
				}else{
					res.send('{"err":"请登录"}')
				}
			}
		})

//修改密码系统
		router.post("/Adminmod",function(req,res,next){
			if(req.body.action=="mod"){
				
				//		密码
			var MD5=crypto.createHash('md5');
			//加密密码--转成64位
			var oldpassword=MD5.update(req.body.oldpassword).digest('base64');
			//前端传来的账号密码
			var sel={userName:req.body.userName,password:oldpassword}
			mongo("find","Administor",{userName:req.body.userName},function(result){
				if(result.length==0){
					res.send('{"err":"用户名不存在"}')
				}else if(result[0].password==oldpassword){
					var MD5=crypto.createHash('md5');
					var newpassword=MD5.update(req.body.newpassword).digest('base64');
					console.log(newpassword)
					var sell=[{userName:req.body.userName},{$set:{password:newpassword,update:new Date()}}]
					mongo("updates","Administor",sell,function(result){
						res.send('密码修改成功')
					})
				}else{
					res.send('原密码错误')
				}
			})
			
			}else{
				res.send('cuowu')
			}
		})
		
		//获取用户信息
		
		router.post("/userinfo",function(req,res,next){
			if(req.body.action=="look"){
				mongo("find","Administor",{userName:req.session.user.name},function(result){
					res.send(result)
				})
			}
		})
		
		//修改用户资料
		router.post("/redact",function(req,res,next){
			mongo("find","Administor",{userName:req.session.user.name},function(result){
				var sell=[{userName:req.session.user.name},{$set:{
																userName:req.body.userName,
																turename:req.body.turename,
																power:req.body.power,
																phone:req.body.phone,
																creatAt:new Date(),
															}}]
				
					mongo("updates","Administor",sell,function(result){
						mongo("find","Administor",{userName:req.body.userName},function(result){
							req.session.user.name=result[0].userName;
							res.send(result)
					})
				})
			})
		})
module.exports=router;
