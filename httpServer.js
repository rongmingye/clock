// 项目创建时间 2018/04/22

var express = require('express'); // 快速构建服务器
var app = express();
var routesAdmin = require('./serve/routesAdmin.js');
var session = require('express-session');

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser({extended: false});

var HOST = "192.168.123.163";  // http服务器的ip和端口
var PORT = "6868";

app.use(express.static(__dirname + developState)); //views路径
routesAdmin(app);

app.get('/', function(req, res){
    res.sendFile(__dirname+'/views/login.html');
});

// 监听端口
var server = app.listen(PORT, HOST, function(){
	var host = server.address().address;
	var port = server.address().port;

	console.log("http://%s:%s", host, port);
});
