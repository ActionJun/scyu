var express =require('express');
var router=express.Router();
var mongo=require("./dbfengzhuang");
// 处理 mongodb里面的 _id格式 _id:Object("asdsad")
var ObjectId=require('mongodb').ObjectID 
//添加商品接口
router.post('/addPro',function(req,res,next){
	//准备好添加的数据
	mongo("find","product",{},function(result){
		var sel={
			
		}
		sel.pid=result.length+1;
		sel.pname=req.body.pname;
		sel.price=req.body.price;
		sel.imgsrc=req.body.imgsrc;
		sel.color=req.body.color;
		sel.size=req.body.size;
		sel.kucun=req.body.kucun;
		sel.info={};
		sel.info.bigimg=req.body.bigimg;
		sel.info.gonglv=req.body.gonglv;
		
		mongo("add","product",sel,function(result){
			if(result.length==0){
				res.send('{"err":"添加失败"}')
			}else{
				res.send('{"success":"添加成功"}')
			}
		})
		
	})
})

//商品列表
router.post('/prolist',function(req,res,next){
	mongo("find","product",{},function(result){
		if(result.length==0){
				res.send('{"err":"没有商品"}')
			}else{
				res.send(result)
			}
	})
})
//删除商品
router.post('/prodel',function(req,res,next){
	var del={
		pname:req.body.pname,
		price:req.body.price,
		color:req.body.color,
	}
	mongo("del","product",del,function(result){
		console.log(result)
		if(result.length==0){
				res.send('{"err":"没有该商品"}')
			}else{
				res.send('{"success":"删除成功"}')
			}
	})
})

//编辑商品
router.post('/proedit',function(req,res,next){
//	var edit={
//			pname:req.body.pname,
//			price:req.body.price,
//			color:req.body.color,
//		}
	var sel=[
			{pname:req.body.oldpname},
			{$set:{
				pname:req.body.pname,
				price:req.body.price,
				color:req.body.color,
				imgsrc:req.body.imgsrc,
				kucun:req.body.kucun,
				size:req.body.size,
			}}	
	
	]
	mongo("find","product",{pname:req.body.oldpname},function(result){
		if(result.length==0){
			res.send('{"err":"没有找到商品"}')
		}else{
			mongo("updates","product",sel,function(result){
				res.send(result)
			})
		}
	})
})


module.exports=router;