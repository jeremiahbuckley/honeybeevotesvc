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


});

sm.schema = {};
sm.model = {};

fs
.readdirSync(__dirname)
.filter(function(file) {
	return (file.indexOf('.js') > 0) && (file != 'index.js');
})
.forEach(function(file) {

	var x = require(path.join(__dirname, file));
	var name = x.name;

	console.log("loading model: " + name);
	var schema = x.makeSchema();
	x.makeModel(db, schema);
	console.log("loaded model: " + name);

});

console.log('finished require!');
