var mongoose = require('mongoose');

var name = "voter";

function makeSchema() {
	var schema = mongoose.Schema({
		name: {
			type: String,
			required: true
		}, 
		password: {
			type: String,
			required: true
		}
	});
    schema.virtual('links').get(function () {
        /* TODO: These should be absolute URIs */
        return [{
            "rel": "self",
            "href": "/voters/" + this._id
        }];
    })
    schema.set('toJSON', {
        virtuals: true
    });
    return schema;
}

function makeModel(db, schema) {
	return db.model(name, schema);
}

module.exports = {
	makeSchema: makeSchema,
	makeModel: makeModel,
	name: name
}
