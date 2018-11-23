$(function(){
	$.ajax({
		url:"/order/allOrder",
		type:"get",
		dataType:"json"
	}).done(function(res){
		console.log(res)
		var str="";
		$.each(res,function(index,ele){
			var statusStr='';
			var sendbtn="";
			
			
			if(ele.status==1){
				statusStr="已付款";
				sendbtn='<button class="sendEnd" onclick="location.href=\'send.html?orderid='+ele.orderid+'\'">确认发货</button>';
				
			}else if(ele.status==2){
				statusStr='已发货';
				sendbtn='<button class="sendEnd">查看物流信息</button>';
				
			}else if(ele.status==4){
				statusStr="退货待审核";
				sendbtn='<button class="tongyi">同意退货</button><button class="bohui">驳回退货</button>';
			}else if(ele.status==3){
				statusStr="已完成";
				sendbtn='<button class="shouhoju">售后</button>';
			}else{
				statusStr="位置订单";
				sendbtn='<button class="del">删除</button>';
			}
			str+='<tr>'
			+'<td>'+ele.truename+'</td>'
			+'<td><img src="images/'+ele.imgsrc+'"/></td>'
			+'<td>'+ele.pname+','+ele.price+','+ele.color+'</td>'
			+'<td>'+ele.num+'</td>'
			+'<td>'+ele.total+'</td>'
			+'<td>'+ele.adress+'</td>'
			+'<td>'+ele.phone+'</td>'
			+'<td>'+statusStr+'</td>'
			+'<td>'+ele.buyDate+'</td>'
			+'<td>'+sendbtn+'</td>'
			+'</tr>'
		});
		$('table').append(str);
	})
})