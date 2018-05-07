let mysql = require('mysql');
let pool = mysql.createPool({
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	port: '3306',
	database: "clock",
});

let query = function(sql, callback){
	pool.getConnection(function(err, connect){
		if(err){
			callback(err, null);
		}else{
			connect.query(sql, function(err, result){
				connect.release();
				callback(err, result);
			});
		}
	});
};

module.exports = query;