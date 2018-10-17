// 服务器端
var net = require('net');
var query = require('./serve/mysql.js');
var fs = require("fs");

var HOST = '192.168.123.163'; //net服务器的ip和端口
var PORT = 6969;

var chipSocket; // 保存服务器与单片机的socket通道
var httpSocket; // 保存服务器和网页的socket通道


var server = net.createServer(function(sock) {

    console.log('connect: ' + sock.remoteAddress + ':' + sock.remotePort);

    if(sock.remoteAddress == "192.168.123.70"){
        chipSocket = sock;
    }
    if(sock.remoteAddress == "192.168.123.163"){
        httpSocket = sock;
    }

    // net服务器收到客户端数据时触发
    sock.on('data', function(data){

        data = data.toString();
        console.log(data);

        // 记录开门 插入到record表
        if(data.split("a")[0] == "record" ){
            console.log("chip record open");
            var userId = data.split("a")[1];
            userId = parseInt(userId);

            var sql = "select name from user where passwork=" + userId;
            query(sql, function(err, result){
                if(err){
                    console.log(err);
                }
                result = result[0].name;
                var sql1 = "insert into record(name, time) value('"+ result+"','"+ getNowFormatTime()+"')";
                query(sql1, function(err, result){
                    if(err){
                        console.log(err);
                    }
                    console.log("insert record success")
                });
            });
        }

        // 当数据是open时， 发送到单片机
        if( data === "opendoor"){
            console.log("http order open to chip");
            chipSocket.write("opendoor");
        }

        // 删除用户
        if( data.split("a")[0] === "delete" ){
            chipSocket.write(data);
        }

        // 添加用户， 让单片机进入添加用户模式
        if(data ==="emode"){
            chipSocket.write("emode");
        }
        // 先获取新用户的id
        else if(data === "getidnumber"){
            chipSocket.write("getidnumber");
        }
        // 成功返回id
        else if(data.split("a")[0] === "new"){
            httpSocket.write(data);
        }
        // 让单片机进入录入指纹模式
        else if(data === "enroll"){
            chipSocket.write("enroll");
        }
        // 录入成功返回enrollatrue
        else if(data === "enrollatrue"){
            httpSocket.write("enrollSuccess");
        }
        // 让单片机返回识别开门模式
        else if(data === "imode"){
             chipSocket.write("imode");
        }
           
        // 发送烧录文件
        if(data === "iap"){
            chipSocket.write("iap");
            console.log("iap");
            setTimeout(function(){
                var buf = Buffer.alloc(1024*50);
                fs.open('./static/RNG.bin', 'r+', function(err, fd) {
                   if (err) {
                       return console.error(err);
                   }
                   console.log("文件打开成功！");
                   console.log("准备读取文件：");
                   fs.read(fd, buf, 0, buf.length, 0, function(err, bytes){
                        if (err){
                             console.log(err);
                        }
                        if(bytes > 0){
                            chipSocket.write(buf.slice(0, bytes));
                            console.log("文件发送成功");
                            clearTimeout();
                        }
                    });
                });
            }, 1000);
        }

    });
        
    // net服务器关闭时触发
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress + ' ' + sock.remotePort);
    });
});

server.listen(PORT, HOST, function(){
    console.log('Server listening on ' + HOST +':'+ PORT);
});


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