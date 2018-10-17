$(function(){

	// 没有登陆过就返回登陆页面
	if( $.cookie("f111") ){
		console.log("has cookie username");
	}else{
		window.location.href = window.Site+"/login.html"
	}

	var flag = 1;  // 注册三次id


	$("#addName").click(function(){
		if($("#userName").val() !='' ){
			var newUserName = $("#userName").val();
			console.log(newUserName);

			$.ajax({
				url: "/emode",
				type: "post",
				contentType: "application/x-www-form-urlencoded;charser=utf8",
				data: "newUserName="+newUserName,
				dataType: "text",
				success: function(result){
					// 成功后， 获取id
					$("#text").html( "<p><input type='button' id='getidnum' value='获取id' class='btn' /></p>" );
					getIdNum();
				},
				fail: function(err, status){
					console.log(err);
				}
			})
		}
	});


	function getIdNum(){
		// 获取id号
		$("#getidnum").click(function(){
			$.ajax({
				url: "/getidnumber",
				type: "post",
				contentType: "application/x-www-form-urlencoded;",
				data: null,
				dataType: "text",
				success: function(result){
					// 获取id成功后
					console.log(result);
					addFinger();
				},
				fail: function(err, status){
					console.log(err);
				}
			});
		});
	}

	function addFinger(){
		$("#text").html("<p> <span>进入输入指纹模式"
						+"<input type='button' value='进入' id='addFinger' class='btn'></p>");

		// 输入用户名后，让单片机注册
		$("#addFinger").click(function(){
			$("#text").html("<p>请输入指纹</p>");
			$.ajax({
				url: "/enroll",
				type: "post",
				contentType: "application/x-www-form-urlencoded;",
				data: null,
				dataType: "text",
				success: function(result){
					if(result === "enrollSuccess"){
						if(flag<3){
							flag++;
							$("#text").html("<p><input type='button' id='getidnum' value='再次获取id' class='btn'/></p>");
							getIdNum();

						}else if(flag = 3){
							flag = 1;
							showCompleted();
						}
					}
				},
				fail: function(err, status){
					console.log(err);
				}
			});
		});
	}

	function showCompleted(){
		$("#text").html("<p><span>注册成功</span> <button id='completed' class='btn'>完成</button> </p>");
		$("#completed").click(function(){
			$.ajax({
				url: "/completed",
				type: "post",
				contentType: "application/x-www-form-urlencoded;",
				data: null,
				dataType: "text",
				success: function(result){
					if(result==="completedSuccess"){
						window.location.href= window.Site+"/addUser.html";
					}
				},
				fail: function(err, status){
					console.log(err);
				}
			});
		});
	}
});