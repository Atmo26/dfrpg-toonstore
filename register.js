var fs = require('fs');
var libpath = require('path');
var mysql = require('mysql');
var crypto = require('crypto');

var global = require('./global.js');


function registrationPage(req, res)
{
	var path = libpath.normalize('public/register.html');
	global.log('Serving registration file:', path);
	res.sendfile( path );
}

function register(req,res)
{
	var body = req.body;

	// salt and hash the password
	body.salt = crypto.randomBytes(32);
	body.password = crypto.pbkdf2Sync(body.password, body.salt, 1000, 32);
	body.salt = body.salt.toString('hex');
	body.password = body.password.toString('hex');
	global.log('Registering user:', body.username);

	// connect to the db
	var connection = mysql.createConnection( global.config.database );
	connection.query(
		'INSERT INTO Users SET username = ?, email = ?, salt = UNHEX(?), password = UNHEX(?), registered = NOW(), last_login = DEFAULT;', 
		[body.username,body.email,body.salt,body.password],
		function(err, rows, fields){
			if( err ){
				global.error('Registration error:', err, global.logLevels.error);
				res.send(500);
			}
			else {
				global.log('Registration successful');
				res.redirect('/post-register.html');
			}
		}
	);
}

// username testing
function checkUsername(req,res)
{
	var user = req.query.a;
	
	// connect to the db
	var connection = mysql.createConnection( global.config.database );
	connection.query('SELECT COUNT(username) AS userCount FROM Users WHERE username = ?', [user], function(err, rows, fields)
	{
		if( err ){
			global.error('MySQL error:', err);
			res.send(500, 'MySQL error');
		}
		else {
			var userFound = rows[0]["userCount"] == 1;
			res.json(200, {found: userFound});
		}
	});
}

exports.registrationPage = registrationPage;
exports.register = register;
exports.checkUsername = checkUsername;

