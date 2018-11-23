function isLogin(){
	
}

var tool={
	isLogin:function(){
		var data=null;
		$.ajax({
			type:"get",
			url:"/renren/isLogin",
			async:false,
			dataType:"json"
		}).done(function(res){
			console.log(res)
			data=res
		});
		return data
	}
}
  
  
  
  function tool(){
  	return {
  		isLogin:function(){
  			
  		}
  	}
  }



function tools(url){
	this.url=url;
	this.isLogin=function(){
		
	}
}