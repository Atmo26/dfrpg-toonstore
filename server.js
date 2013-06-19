var http = require('http'),
fs = require('fs'),
libpath = require('path'),
mime = require('mime'),
global = require('./global.js');

function startServer()
{
	var server = http.createServer(function(request,response)
	{
		// convert url to fs path
		var path = 'public' + request.url;
		if( request.url == '/' )
			path += 'index.html';
	
		// serve files from the public/ dir
		if( fs.existsSync(path) ){
			global.log('Serving file:', path);
			fs.readFile(path, function(err,data){
				response.writeHead(200, {'Content-Type': mime.lookup(path)});
				response.end(data);
			});
		}
	
		// return 404
		else {
			global.error('File not found:', path, global.logLevels.warning);
			global._404(response);
		}
	});

	server.listen(3001);
	global.log('Server running at http://localhost:3001/');
}

exports.startServer = startServer;
