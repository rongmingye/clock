$(function(){

	// 登陆事件处理函数
	$("#loginBtn").click(function(){
		if(checkForm()) {
			var username = $("#username").val();
			var pwd = $("#password").val();
			$.ajax({
				url: "/login",
				type: "post",
				contentType: "application/x-www-form-urlencoded;charser=utf8",
				data: "username="+ username + "&pwd="+pwd ,
				dataType: "text",
				success: function(result){

					if(result==="success"){
						$.cookie( username, pwd, {expires: 1, path: '/'} ); // 设置cookie
						window.location.href="/record.html"; //调到record.html
					}else if(result==="fail"){
						alert("密码错误");
					}

				},
				fail: function(err, status){
					console.log(err);
				}
			});
		}
	})
		
	
	// 格式验证
	function checkForm(){
  		return checkUserName() && checkPassword();       
	}

	function checkUserName(){
	   	var userName = document.getElementById("username");
	  	if(userName.value.length==0){
	    	alert("请输入用户名");
	    	userName.select();
	    	return false;
	  	}
	  	return true;
	}

	function checkPassword(){
	   	var password = document.getElementById("password");
	  	if(password.value.length==0){
	     	 alert("请输入密码");
	      	password.select();
	      	return false;
	  	 }
	  	 //检测密码
	  	var reg = /^\w{1,16}$/;
	   	if(!reg.test(password.value)){
	     	tip.style.display = "block";
	     	tip.innerHTML = "密码名格式错误";
	     	password.select();
	      	return false;
	   }
	   return true;
	}

});
