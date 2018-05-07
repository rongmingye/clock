var express = require('express'); // 快速构建服务器
var app = express();
var routesAdmin = require('./routesAdmin.js');
var session = require('express-session');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser({extended: false});

var HOST = "192.168.123.163";  // http服务器的ip和端口
var PORT = "6868";

app.use(express.static("views")); //views路径
routesAdmin(app);

// 使用 session 中间件
app.use(session({
    secret :  'secret', // 对session id 相关的cookie 进行签名
    resave : true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie : {
        maxAge : 1000 * 60 * 60 * 24 * 1, // 设置 session 的有效时间，单位毫秒 , 这里设7天
        path: '/',
    },
}));

//获取默认页面, 登陆过的session则去到record页面， 没登陆的去到登陆页面
app.get('/', urlencodedParser, function(req, res){
	if(req.session.username){
		console.log("has session username");
		res.sendFile(__dirname + '/views/record.html');
	}else{
		res.redirect('login');
	}
});

// login页面
app.get('/login',urlencodedParser, function(req, res){
	console.log("login.html");
	res.sendFile(__dirname + '/views/login.html');
});

// 登陆 正确则保存session
app.post('/login', urlencodedParser, function(req, res){
	if( req.body.username == "f111" && req.body.pwd == "123456" ){
		console.log("login success");
   		req.session.username = req.body.username;
   		res.send("success");
   		res.end();		
   	}else {
   		console.log("login fail")
   		res.send("fail");
   		res.end();
   	}
});

// 监听端口
var server = app.listen(PORT, HOST, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("http://%s:%s", host, port);
});
