var libpath = require('path');
var mysql = require('mysql');
var liburl = require('url');
var fs = require('fs');
var crypto = require('crypto');

var global = require('./global.js');


function processLogin(req,res)
{
	global.log('Attempting login:', req.body.email);

	var connection = mysql.createConnection( global.config.database );
	connection.query('SELECT username, HEX(password) AS password, HEX(salt) AS salt FROM Users WHERE email = ?;', [req.body.email],
		function(err,rows,fields){
			if( err ){
				global.error('MySQL error:', err);
				global.renderPage('login', {message: err})(req,res);
				connection.end();
				return;
			}
			else if( rows.length == 0 ){
				global.error('Login error: no such email');
				global.renderPage('login', {message: 'Invalid email or password'})(req,res);
				connection.end();
				return;
			}

			// salt/hash the input password
			var inputPass = crypto.pbkdf2Sync(req.body.password, new Buffer(rows[0].salt, 'hex'), 1000, 32);

			if( inputPass.toString('hex').toUpperCase() == rows[0].password ){
				global.log('Login successful');
				connection.query('UPDATE Users SET last_login = NOW() WHERE username = ?;', [rows[0].username]);
				req.session.user = rows[0].username;
				if( req.body.redir )
					res.redirect(req.body.redir);
				else
					res.redirect('/'+rows[0].username);
			}
			else {
				global.log('Login error: incorrect password');
				global.renderPage('login', {message: 'Invalid email or password'})(req,res);
			}
			connection.end();
		}
	);
}

function processLogout(req,res)
{
	global.log('Logging out user', req.session.user);
	delete req.session.user;
	if( req.query.redir )
		res.redirect(req.query.redir);
	else
		res.redirect('/');
}

exports.processLogin = processLogin;
exports.processLogout = processLogout;

