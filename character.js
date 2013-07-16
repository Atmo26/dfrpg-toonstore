var mysql = require('mysql');
var libpath = require('path');
var global = require('./global.js');

function servePage(req,res,next)
{
	var connection = mysql.createConnection( global.config.database );
	connection.query(
		'SELECT name FROM Characters WHERE owner = ? AND canonical_name = ?;',
		[req.params.user, req.params.char],
		function(err,rows,fields){
			if( !err && rows.length == 1 ){
				global.log('Serving character page for', req.url);
				global.renderPage('charsheet')(req,res);
			}
			else {
				next();
			}
			connection.end();
		}
	);
}

function serveJson(req,res,next)
{
	var connection = mysql.createConnection( global.config.database );
	connection.query(
		'SELECT info FROM Characters WHERE owner = ? AND canonical_name = ?;',
		[req.params.user, req.params.char],
		function(err,rows,fields){
			if( !err && rows.length == 1 ){
				global.log('Serving character JSON for', req.url);
				res.json(200, JSON.parse(rows[0].info));
			}
			else {
				next();
			}
			connection.end();
		}
	);
}

function pushJson(req,res,next)
{
	// don't update if incorrect user is logged in
	if( req.session.user != req.params.user ){
		res.send(403, '403 forbidden');
		return;
	}

	// gather the data
	var data = '';
	req.on('data', function(chunk){
		data += chunk;
	});
	req.on('end', function(){
		req.body = JSON.parse(data);
		_pushJson(req,res,next);
	});
}

function _pushJson(req,res,next)
{
	global.log('Attempting to update character sheet of', req.params.char);
	//console.log( JSON.stringify(req.body.stress[0], null, 2) );
	//res.send(200);

	var connection = mysql.createConnection( global.config.database );
	connection.query(
		'UPDATE Characters SET info = ?, name = ?, concept = ? WHERE owner = ? AND canonical_name = ?;',
		[JSON.stringify(req.body), req.body.name, req.body.aspects.high_concept.name, req.params.user, req.params.char],
		function(err,rows,fields){
			if( !err ){
				global.log('Success');
				res.send(200);
			}
			else {
				global.log('MySQL error:', err);
				next();
			}
			connection.end();
		}
	);
}

function newCharacterPage(req,res)
{
	if( req.session.user ){
		global.log('Serving new character page');
		global.renderPage('newtoon')(req,res);
	}
	else {
		res.redirect('/login?redir=/newtoon');
	}
}

function newCharacterRequest(req,res)
{
	// create blank character JSON object
	var toon = {
		'name': req.body.name,
		'player': req.session.user,
		'aspects': {
			'high_concept': {'name': req.body.concept,'description': ''},
			'trouble': {'name': '', 'description': ''},
			'aspects': []},
		'stress': [{
			'name': 'Physical','skill': 'Endurance','toughness': 0,'boxes': [{'used': false},{'used':false}],'armor': []},{
			'name': 'Mental','skill': 'Conviction','toughness': 0,'boxes': [{'used': false},{'used':false}],'armor': []},{
			'name': 'Social','skill': 'Presence','toughness': 0,'boxes': [{'used': false},{'used':false}],'armor': []}],
		'consequences': [{
			'severity': 'Mild','mode': 'Any','used': false,'aspect': ''},{
			'severity': 'Moderate','mode': 'Any','used': false,'aspect': ''},{
			'severity': 'Severe','mode': 'Any','used': false,'aspect': ''},{
			'severity': 'Extreme','mode': 'Any','used': false,'aspect': 'Replace permanent'}],
		'totals': {
			'power_level': 'Submerged','base_refresh': 10,'skill_cap': 5,'skills_total': 35,'fate_points': 0},
		'skills': {
			'5': [],'4': [],'3': [],'2': [],'1': []},
		'powers': []
	};

	global.log('Attempting character creation');
	var connection = mysql.createConnection( global.config.database );
	connection.query('INSERT INTO Characters SET created_on=NOW(), ?;',
		{'canonical_name': req.body.canon_name, 'name': req.body.name, 'owner': req.session.user,
			'concept': req.body.concept, 'info': JSON.stringify(toon)},
		function(err,rows,fields)
		{
			if( err ){
				global.error('MySQL error:', err);
				res.render('newtoon', {message: 'You are already using that short name'})(req,res);
			}
			else {
				global.log('Creation successful');
				var url = '/'+req.session.user+'/'+req.body.canon_name;
				res.redirect(url);
			}
			connection.end();
		}
	);
}


exports.servePage = servePage;
exports.serveJson = serveJson;
exports.pushJson = pushJson;
exports.newCharacterPage = newCharacterPage;
exports.newCharacterRequest = newCharacterRequest;

