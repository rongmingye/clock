$(function(){

	// 没有登陆过就返回登陆页面
	if( $.cookie("f111") ){
		console.log("has cookie username");
	}else{
		window.location.href = "/login.html"
	}

	var time = setInterval(function(){
		$("#curtime").text(getNowFormatTime());
	}, 1);
	
	var temp = "<li><span class='user-id'>{id}</span>"
					+"<span class='user-name'>{name}</span>"
					+"<span class='user-time'>{time}</span></li>";

	getAjaxRecord();
	// 请求： 请求最近开门记录
	function getAjaxRecord(){
		$.ajax({
			url: "/record_post",
			type: "post",
			contentType: "application/x-www-form-urlencoded;",
			data: null,
			dataType: "json",
			success: function(result){
				showUser(result);
			},
			fail: function(err, status){
				console.log(err);
			}
		});
	}

	// 回调函数：展示数据库里最近开门记录数据的
	function showUser(result){
		$("#article-box").html("");
		result.map(function(item, index){

			_temp = temp.replace("{id}", item.id)
						.replace("{name}", item.name)
						.replace("{time}", item.time);
			$("#article-box").prepend(_temp);
		});
	}

	//获取当前时间
function getNowFormatTime(){
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";

        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();

        var hour = date.getHours();
        var minute = date.getMinutes();
        var second = date.getSeconds();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        

        var currentTime = year + seperator1 + month + seperator1 + strDate+ " "+
                        + hour+ "时" + minute + "分" + second + "秒";
                        
        return currentTime;
}
	
});