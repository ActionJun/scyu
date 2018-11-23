var ObjectId=require('mongodb').ObjectId;
var express =require('express');
var router=express.Router();
var mongo=require("./dbfengzhuang");

router.post('/addOrder',function(req,res,next){
	var sel={
		"pid":req.body.pid,
		"pname":req.body.pname,
		"price":req.body.price,
		"total":req.body.total,
		"num":req.body.num,
		"color":req.body.color,
		"size":req.body.size,
		"imgsrc":req.body.imgsrc,
		// "user":req.session.users.name,
		"address":req.body.address,
		"phone":req.body.phone,
		"buyDate":new Date(),
		"status":1,
		"truename":req.body.truename,
		"orderid":new Date().getTime()
	}
	console.log(sel.phone)
	mongo("add","order",sel,function(data){
		if(data.length==0){
			res.send('{"err":"购买失败"}')
		}else{
			res.send('{"success":"购买成功"}')
		}
	})
})
router.get("/allOrder",function(req,res,next){
	mongo('find',"order",{},function(data){
		if(data.length==0){
			res.send('{"err":"没有订单数据"}')
		}else{
			res.send(data)
		}
	})
})
router.post("/sendProduct",function(req,res,next){
	var sel={
		status:2,
		logistics_Code:req.body.logistics_Code,
		logistics_orderId:req.body.logistics_orderId
	}
	mongo("updates","order",[{orderid:Number(req.body.orderid)},{$set:sel}],function(data){
		if(data.length==0){
			res.send('{"err":"发货失败"}')
		}else{
			res.send('{"success":"发货成功"}')
		}
	})
})
//物流接口
router.get("/wuliu",function(req,res,next){
	var appId='81057';
	var secret='9c74db6cadb445d6a7e8a81d6afbb206';
	//开启debug
	//showapiSdk.debug(true);
	if(!(appId&&secret)){
	  console.error('请先设置appId等测试参数,详见样例代码内注释!')
	  return;
	}
	//全局默认设置
	showapiSdk.setting({
	  url:"http://route.showapi.com/64-19",//你要调用的API对应接入点的地址,注意需要先订购了相关套餐才能调
	  appId:appId,//你的应用id
	  secret:secret,//你的密钥
	  timeout:5000,//http超时设置
	  options:{//默认请求参数,极少用到
	    testParam:'test'
	  }
	})
	
	var request=showapiSdk.request();
	request.appendText('com',req.query.com);
	request.appendText('nu',req.query.nu);
	request.post(function(data){
//	  console.info(data)
	  res.send(data)
	})
})
module.exports=router;