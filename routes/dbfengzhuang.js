//数据库连接和方法封装

 //自己封装的mongodb操作的js

var mongo=require('mongodb');
var url='mongodb://127.0.0.1:27017' 
var dbName='qq'//库名

var MongoClient=mongo.MongoClient; 
	//删除一个
	var del=function(client,collections,selector,fn){
		var db=client.db(dbName) //链接数据库
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		//删除
		collection.deleteOne(selector,function(err,result){
				if(err) throw err;
			console.log("删除成功");
			fn(result)
			client.close();//释放链接		
		})
		
		
	}
		//删除多个
	var delMany=function(client,collections,selector,fn){
		var db=client.db(dbName) //链接数据库
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		//删除
		collection.deleteMany(selector,function(err,result){
				if(err) throw err;
			console.log("删除成功");
			fn(result)
			client.close();//释放链接		
		})
		
		
	}
	//增加一个方法
	
	var add=function(client,collections,selector,fn){
		
		var db=client.db(dbName) //链接数据库
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		//插入
		collection.insert(selector,function(err,result){
				if(err) throw err;
			console.log("插入数据成功");
			fn(result)
			client.close();//释放链接		
		})

	}
		//增加多个方法
	
	var addMany=function(client,collections,selector,fn){
		
		var db=client.db(dbName) //链接数据库
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		//插入
		collection.insertMany(selector,function(err,result){
				if(err) throw err;
			console.log("插入数据成功");
			fn(result)
			client.close();//释放链接		
		})

	}
	
	
	
	//查询数据函数
	var find=function(client,collections,selector,fn){
		
		var db=client.db(dbName) //链接数据库
		var collection=db.collection(collections) //链接数据库里面的集合--自动创建
		//插入   			查询到的数据 转成数组
		 collection.find(selector).toArray(function(err, result) {
		        if (err) throw err;
		        console.log("查询成功");
		        fn(result)
		        client.close();
		   	 });

	}
	//更新
	var updates=function(client,collections,selector,fn){
		var db=client.db(dbName)
		var collection=db.collection(collections)
	//  selector=[{修改条件},{修改内容}]	
		collection.updateOne(selector[0],selector[1],function(err,data){
			if(err) throw err;
			fn(data)
			client.close()
		})
	}
//更新多条
	var updatesMany=function(client,collections,selector,fn){
		var db=client.db(dbName)
		var collection=db.collection(collections)
	//  selector=[{修改条件},{修改内容}]	
		collection.updateMany(selector[0],selector[1],function(err,data){
			if(err) throw err;
			fn(data)
			client.close()
		})
	}
	
	
	//用一个json对象  装载写好的函数
	var methodType={
		add:add,
		del:del,
		find:find,
		updates:updates,
		updatesMany:updatesMany,
		delMany:delMany,
		addMany:addMany
	}
	//暴露一个函数
module.exports=function(type,collections,selector,fn){
//		type  add
//	collections--person   selector--{name:"张三"}  fn--函数
			//连接数据库  操作数据
			
			MongoClient.connect(url,function(err,client){
				methodType[type](client,collections,selector,fn)
				
				
			})
	
}
	
		
