var mongoose = require('mongoose');
var configdb = require('../config/db');
var fs = require('fs');
var path = require('path');

mongoose.connect(configdb.url);
var db = mongoose.connection;

var sm = {};
	
db.on('error', console.error);
db.once('open', function() {
	console.log('connection open!');
	sm.schema = {};
	sm.model = {};

	fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf('.js') > 0) && (file != 'index.js');
	})
	.forEach(function(file) {

		var x = require(path.join(__dirname, file));
		var name = file.substring(0, file.indexOf("."));

		console.log("loading model: " + name);
		sm.schema[name] = {};
		sm.model[name] = {};
		sm.schema[name] = x.makeSchema();
		sm.model[name] = x.makeModel(db, sm.schema[name]);
		console.log("loaded model: " + name);

	});
	//console.log(JSON.stringify(sm));

	console.log('finished require!');
});



module.exports = { 
	db: db,
	sm: sm 
}