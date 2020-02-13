var express = require('express');
var mysql = require('mysql2');

var app = express();
app.set('view engine', 'pug');
var PORT = 7000;

function getMySQLConnection() {
	return mysql.createConnection({
		host:'HOSTNAME',
		port:'PORT',
		user:'USER',
		password:'PASSWORD',
		database:'DATABASE'
	});
}

var dt    = new Date();
var time  = dt.getHours()+':'+dt.getMinutes();
console.log(time);

app.get('/', function(req, res) {
	var schedulelist = [];
	var connection = getMySQLConnection();
	connection.connect();
	connection.query('SET time_zone =Japan');
	connection.query('SELECT * FROM schedule1 union all SELECT * FROM schedule2 WHERE departtime > DATE_SUB(NOW(),INTERVAL 0 HOUR) ORDER BY departtime',function(err,rows,fields) {
		if (err) {
			res.status(500).json({"status_code": 500,"status_message": "internal server error"});
		} else {
			console.log(rows.length);
			for (var i=0;i<rows.length;i++) {
				var schedule = {
					'id':rows[i].departid,
					'depart': rows[i].departtime,
					'arrive':rows[i].arrivetime
				}
				schedulelist.push(schedule);
			}
			res.render('index',{'schedulelist': schedulelist})
		}
	});
	connection.end();
});
app.listen(PORT, function () {
	console.log('listening on port:', PORT);
});
