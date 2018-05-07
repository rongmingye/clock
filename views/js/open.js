$(function(){
	$("#open-door").click(function(){
		getAjaxOpen();
	});
	
	// 请求开门
	function getAjaxOpen(){
		$.ajax({
			url: "/open_post",
			type: "post",
			contentType: "application/x-www-form-urlencoded;",
			data: null,
			dataType: "text",
			success: function(result){
				alert("已经开门！");
			},
			fail: function(err, status){
				console.log(err);
			}
		});
	}
});