var fs = require('fs');
var libpath = require('path');
var mysql = require('mysql');
//var crypto = require('crypto');

var global = require('./global.js');


function register(req,res)
{
	var body = req.body;
	if( ['register', 'post-register', 'newtoon', 'killtoon', 'site'].indexOf(body.username) != -1 ){
		global.error('Registration error: cannot register reserved word');
		global.renderPage('register', {message: {type:'warning', content:'That username is reserved, choose another.'}})(req,res);
		return;
	}
	else if( !/^[A-Za-z_-]+$/.test(body.username) ){
		global.error('Registration error: cannot register invalid username');
		global.renderPage('register', {message: {type:'warning', content:'That username is invalid, choose another.'}})(req,res);
		return;
	}
	else if( !req.session.user_email ){
		global.error('Registration error: did not log in first');
		global.renderPage('register', {message: {type:'warning', content:'You must sign in before attempting to choose a username.'}})(req,res);
		return;
	}
	global.log('Registering user:', body.username);

	// connect to the db
	var connection = mysql.createConnection( global.config.database );
	connection.query(
		'INSERT INTO Users SET username = ?, email = ?, registered = NOW(), last_login = NOW();', 
		[body.username,req.session.user_email],
		function(err, rows, fields){
			if( err ){
				global.error('Registration error:', err, global.logLevels.error);
				global.renderPage('register', {message: {type:'error', content:err}})(req,res);
			}
			else {
				global.log('Registration successful');
				req.session.user = body.username;
				res.redirect('/post-register');
			}
			connection.end();
		}
	);
}

// username testing
function checkUsername(req,res)
{
	var user = req.query.a;

	// test for reserve words
	if( ['register', 'post-register', 'newtoon', 'killtoon', 'site'].indexOf(user) != -1 ){
		res.json(200, {found: true});
		return;
	}

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
		connection.end();
	});
}

exports.register = register;
exports.checkUsername = checkUsername;

