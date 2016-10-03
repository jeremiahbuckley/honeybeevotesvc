var mongoose = require('mongoose');
var configdb = require('../config/db');
var fs = require('fs');
var path = require('path');

mongoose.connect(configdb.url);
var db = mongoose.connection;

var model = {};
	
db.on('error', console.error);
db.once('open', function() {
	console.log('connection open!');

	fs
	.readdirSync(__dirname)
	.filter(function(file) {
		return (file.indexOf('.js') > 0) && (file != 'index.js');
	})
	.forEach(function(file) {

		var x = require(path.join(__dirname, file));
		var name = file.substring(0, file.indexOf("."));

		console.log("loading model: " + name);
		model[name] = {};
		model[name]["schema"] = x.makeSchema();
		//console.log("schema only")
		//console.log(JSON.stringify(model[name]));
		model[name]["model"] = x.makeModel(db, model[name]["schema"]);
		//console.log("schema and model")
		//console.log(JSON.stringify(model[name]));
		console.log("loaded model: " + name);
	});

	console.log('finished require!');
});



module.exports = { 
	db: db,
	model: model 
}