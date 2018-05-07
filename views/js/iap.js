$(function(){

	// 没有登陆过就返回登陆页面
	if( $.cookie("f111") ){
		console.log("has cookie username");
	}else{
		window.location.href = "http://192.168.123.163:6868/login.html"
	}

	$("#start").click(function(){
		$.ajax({
			url: "iap",
			type: "post",
			contentType: "application/x-www-form-urlencoded;",
			data: null,
			dataType: "text",
			success: function(result){
				alert("烧录成功");
			},
			fail: function(err, status){
				console.log(err);
			}
		});
	});
})