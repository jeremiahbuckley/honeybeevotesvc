var mongoose = require('mongoose');

function auth(username, password, cb) {
	mongoose.models.voter.findOne( { name: username }, function(error, result) {
		if (error) { 
			return cb(error); 
		}
		if (!result) { 
			return cb(null, false); 
		}
		if (result.password != password) { 
			return cb(null, false); 
		}
		return cb(null, result);
	});
}

module.exports = { auth: auth }