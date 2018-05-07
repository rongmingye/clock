$(function(){

	// 没有登陆过就返回登陆页面
	if( $.cookie("f111") ){
		console.log("has cookie username");
	}else{
		window.location.href = "/login.html"
	}

	var temp = "<li><span class='user-id'>{id}</span>"
					+"<span class='user-name'>{name}</span>"
					+"<span class='user-time'>{time}</span>"
					+"<span class='user-del'>删除用户</span></li>"
					+"<span class='user-pwd' style='display:none'>{pwd}</span></li>";

	var delShow = false;

	getAjaxUser(); 
	// 请求已有用户
	function getAjaxUser(){
		$.ajax({
			url: "user_post",
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

	// 展示数据库已有用户数据的回调函数
	function showUser(result){
		$("#article-box").html("");
		result.map(function(item, index){

			_temp = temp.replace("{id}", item.id)
						.replace("{name}", item.name)
						.replace("{time}", item.time)
						.replace("{pwd}", item.passwork);

			$("#article-box").prepend(_temp);
		});

		// 删除用户
		$("#user-del").click(function(e) {
			delShow == false? (delShow = true,$(".user-del").css("display", "inline-block")):
								(delShow=false,$(".user-del").css("display", "none"));
				

			$(".user-del").click(function(e){
				if( confirm("确定删除文章吗") ){
					var index = $(".user-del").index( $(this) );
					var oid = $(".user-pwd").eq(index).text();
					oid = parseInt(oid);
					console.log(oid);
					$.ajax({
						url: "/user_del_post",
						type: "post",
						contentType: "application/x-www-form-urlencoded;charset=utf8",
						data: "id="+oid,
						dataType: "text",
						success: function(result){
							alert("删除成功！");
							getAjaxUser(); 
						},
						fail: function(err, status){
							console.log(err);
						}
					});
				}
			});

			return;
		});
	}

});