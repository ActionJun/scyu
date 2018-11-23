var express =require('express');
var router=express.Router();
var mongo=require("./dbfengzhuang");
// 处理 mongodb里面的 _id格式 _id:Object("asdsad")
var ObjectId=require('mongodb').ObjectID 

router.post("/renrenList",function(req,res,ext){
	//库存排序  req.body.kumax
	//价格        req.body.pricemax
	//搜索字段 req.body.searchText
	
	mongo("find","product",{},function(data){
		//搜索
		if(req.body.searchText){
			var searchArr=[];
			var reg=new RegExp(req.body.searchText,"g");
			console.log(data.length)
			for (var i=0;i<data.length;i++) {
				if(reg.test(data[i].pname)){
					searchArr.push(data[i])
				}
			}	
			console.log(searchArr)
			if(searchArr.length==0){
				res.send('{"err":"没有找到该商品"}')
			}else{
					if(req.body.order){
						
					}else{
						res.send(searchArr)
					}
			}
		}else{
					if(req.body.order){
						
					}else{
						res.send(data)
					}
		}
		
				function orderData(arr){
					for(var i=0;i<arr.length;i++){
						for (var j=0;j<arr.length-1-i;j++) {
							if(Number(arr[j].price)>Number(arr[j+1].price)){
								var temp=arr[j];
								arr[j]=arr[j+1];
								arr[j+1]=temp;
							}
						}
					}
					if(req.body.order=="down"){
						res.send(arr)
					}else if(req.body.order=="up"){
						res.send(arr.reverse())
					}
				}
				
				if(req.body.order){
					if(req.body.searchText){
						orderData(searchArr)
					}else{
						orderData(data)
					}
				}
	})
	
})

router.post("/details",function(req,res,next){
	console.log(req.body.pid)
	mongo("find","product",{pid:Number(req.body.pid)},function(data){
		if(data.length==0){
			res.send('{"err":"查询失败"}')
		}else{
			res.send(data)
		}
	})
})

//判断用户是否登录

router.get("/isLogin",function(req,res,next){
	if(req.session.user.name){
		res.send('{"success":"已登录"}')
	}else{
		res.send('{"err":"未登录"}')
	}
})
module.exports=router;