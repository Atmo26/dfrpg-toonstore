var http = require('http');
var fs = require('fs');
var libpath = require('path');
var liburl = require('url');
var express = require('express');

var global = require('./global.js');
var register = require('./register.js');
var login = require('./login.js');
var user = require('./user.js');
var character = require('./character.js');


// create the express application
var app = express();
var parser = express.bodyParser();
app.use(function(req,res,next){
	if( /\/\w+\/\w+\/json/.test(req.url) && req.method == 'POST' ){
		console.log('Bypassing bodyParser');
		return next();
	}
	parser(req,res,next);
});
app.use(express.cookieParser());
app.use(express.session({secret: global.config.cookie_secret}));
app.set('views', 'templates');
app.set('view engine', 'jade');

// the global logger middleware
app.use(express.logger());

// route the registration pages
app.get('/register', global.renderPage('register'));
app.get('/post-register', global.renderPage('register'));
app.post('/register', register.register);
app.get('/register/verify', register.checkUsername);

// route the login pages
app.post('/login', login.processLogin);
app.post('/logout', login.processLogout);

// route the user pages
app.get('/:user', user.userPage);

// route the character management pages
app.get('/newtoon', character.newCharacterPage);
app.post('/newtoon', character.newCharacterRequest);
app.get('/:user/:char', character.servePage);
app.get('/:user/:char/json', character.serveJson);
app.post('/:user/:char/json', character.pushJson);

app.get('/', global.renderPage('index'));

app.use('/static', express.static(__dirname+'/static', {maxAge: 24*60*60}));

// catch-all: serve static file or 404
app.use(function(req,res)
{
	global.error('File not found:', req.url, global.logLevels.warning);
	global.renderPage('404', {code: 404})(req,res);
	//res.send(404);
});

// start the server
http.createServer(app).listen(global.config.port);
global.log('Server running at http://localhost:'+global.config.port+'/');

