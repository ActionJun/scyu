$(function(){
	function getQueryString(name) {
			    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
			    var r = window.location.search.substr(1).match(reg);
			    if (r != null) {
			        return unescape(r[2]);
			    }
			    return null;
			}
	var pid=getQueryString("pid");
	console.log(pid)
	$.ajax({
		url:'/renren/details',
		type:'post',
		data:{
			pid:pid
		},
		dataType:'json'
	}).done(function(res){
		console.log(res);
		$(".list td").eq(0).find("img").attr("src","images/"+res[0].imgsrc);
		$(".list td").eq(1).html(res[0].pname);
		$(".list td").eq(2).html(res[0].price);
		$(".list td").eq(3).html(res[0].size);
		$(".list td").eq(4).html(res[0].color);
		$(".list td").eq(5).find("input").val(1);
		function total(){
			var totalCount=Number(res[0].price)*Number($(".list td").eq(5).find("input").val());
			return totalCount;
		}
		console.log(total())
		$(".total").html(total());
		$(".plus").click(function(){
			var inpval=Number($(".list td").eq(5).find("input").val());
			$(".list td").eq(5).find("input").val(inpval+1);
			$(".total").html(total());
		});
		$(".min").click(function(){
			var inpval=Number($(".list td").eq(5).find("input").val());
			if(inpval<=1){
				inpval=1;
			}else{
				$(".list td").eq(5).find("input").val(inpval-1);
			}
			$(".total").html(total());
		});
		$(".sureBuy").click(function(){
			console.log($("#phone").val())
			console.log($("#trueName").val())
			var address='';
			$.each($("#myarea select"),function(index,ele){
				address+=ele.value;
			});
			address+=$("#deAddress").val();
			console.log(address)
			var obj={
				"pid":pid,
				"pname":res[0].pname,
				"price":res[0].price,
				"num":$(".list td").eq(5).find("input").val(),
				"total":$(".total").html(),
				"color":res[0].color,
				"size":res[0].size,
				"imgsrc":res[0].imgsrc,
				"adress":address,
				"phone":$("#phone").val(),
				"truename":$("#trueName").val()
			};
			console.log(11111111)
			$.ajax({
				url:'/order/addOrder',
				type:"post",
				data:obj,
				dataType:"json"
			}).done(function(res){
				console.log(res)
			})
		})
	})
	
})