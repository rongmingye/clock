var query = require('./mysql.js');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser({extended: false});

var net = require('net');
var HOST = '192.168.123.163'; // net服务器的ip和端口
var PORT = 6969; 

var newUserName = null; // 记录新用户的用户名
var newUserId = null;	// 记录新用户的密码

// app 管理 get/post
function routesAdmin(app){

	// 登陆 正确则保存session
	app.post('/login', urlencodedParser, function(req, res){
		if( req.body.username == "f111" && req.body.pwd == "123456" ){
			console.log("login success");
	   		res.send("success");
	   		res.end();		
	   	}else {
	   		console.log("login fail")
	   		res.send("fail");
	   		res.end();
	   	}
	});

	// 开门
	app.post('/open_post', urlencodedParser, function(req, res){
		console.log("open success");
		goSocket("opendoor", res);
	});

	// 删除用户
	app.post('/user_del_post', urlencodedParser, function(req, res){
		var sql = "delete from user where passwork ='"+req.body.id+"'";
	    query(sql, function(err, result){
			if(err) {
				console.log(err.message);
				return;
			}
			console.log("user del success");
			goSocket("deletea"+formateDel(req.body.id), res);	
	    });
	});

	// 查询开门记录
	app.post('/record_post', urlencodedParser, function(req, res){
		var sql = "select * from record";
	    query(sql, function(err, result){
			if(err) {
				console.log(err.message);
				return;
			}

			console.log("get record_post success");
			res.send(result);
	        res.end(); // 使服务器停止处理脚本，返回当前结果  	
	    });
	});

	// 查询已有用户
	app.post('/user_post', urlencodedParser, function(req, res){
		var sql = "select * from user";
	    query(sql, function(err, result){
			if(err) {
				console.log(err.message);
				return;
			}

			console.log("get user_post success");
			res.send(result);
	        res.end(); // 使服务器停止处理脚本，返回当前结果  	
	    });
	});

	// 添加用户 进入录指纹模式
	app.post('/emode', urlencodedParser, function(req, res){
        console.log("emode");
        newUserName = req.body.newUserName;
        console.log(newUserName);
        goSocket("emode", res);
	});

	// 添加用户 请求指纹id
	app.post('/getidnumber', urlencodedParser, function(req, res){
        console.log("getidnumber");
        goSocket("getidnumber", res);
	});

	// 添加用户名， 然后单片机烧录
	app.post('/enroll', urlencodedParser, function(req, res){
		console.log("enroll");
        goSocket("enroll", res);
	});

		// 添加用户 进入录指纹模式
	app.post('/completed', urlencodedParser, function(req, res){
        console.log("completed");
        goSocket("imode", res);
	});


	// 烧录文件
	app.post('/iap', urlencodedParser, function(req, res){
		// goSocket("iap", res);
		console.log("iap success");
	});

}

// 发送到net服务器
function goSocket(odata, res){
        // 客户端socket
		var socket = new net.Socket();
		socket.connect(PORT, HOST, function() {
		    console.log('connect TO: ' + HOST + ':' + PORT);
		});

		// 开门
		if(odata === "opendoor"){
			socket.write(odata); 
			res.send();
        	res.end(); 
        	socket.end();
		}

		// 注册用户， 进入录入模式
		if(odata === "emode"){
			socket.write(odata);
			res.send();
        	res.end();  
        	socket.end();
		}
		// 获取新用户的id
		if(odata === "getidnumber"){
			socket.write("getidnumber");
		}
		// 录入进行录入指纹
		if(odata === "enroll"){
			socket.write("enroll");
		}
		// 退出添加用户模式，返回识别模式
		if(odata === "imode"){
			socket.write(odata); 
			res.send("completedSuccess");
        	res.end();  
        	socket.end();
		}

		// 烧录文件
		if(odata === "iap"){
			socket.end(odata); 
			res.send();
        	res.end(); 
		}

		// 删除用户
		if( odata.split("a")[0] === "delete" ){
			socket.write(odata); 
			res.send("delete user success");
        	res.end();  
        	socket.end();
		}

		// 返回的数据
		socket.on('data', function(data) {

			data = data.toString();
			console.log(data);

			// 返回的新用户id
			if(data.split("a")[0] === "new"){
				newUserId = data.split("a")[1];
				
				res.send("getidnumSuccess");
		 		res.end();
		 		socket.end();
			}

			// 单片机烧录成功，然后保存用户名和id
			if(data === "enrollSuccess"){
				console.log("enroll sucess");
				console.log(newUserName + newUserId );
				var sql = "insert into user(name, passwork, time) value('"+newUserName +"','"+ newUserId+"','"+getNowFormatTime()+"')";
				query(sql, function(err, result){
					if(err) {
		                console.log(err.message);
		                return;
		            }
		            newUserId = null;

		            res.send("enrollSuccess");
		            res.end();
		            socket.end();
				});
			}			
		 });

		// 为客户端添加“close”事件处理函数
		socket.on('close', function() {
		    console.log('Connection closed');
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
        
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var second = date.getSeconds().toString();

        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        
        var currentTime = year + seperator1 + month + seperator1 + strDate+ " "+
                        + hour + seperator2 + minute + seperator2 + second;
        return currentTime;
}

// 删除id时的id格式， 三位数字
function formateDel(id){
	if(id<10){
		id= "00" + id
	}else if(id<100){
		id = "0" + id;
	}
	return id;
}
module.exports = routesAdmin;
