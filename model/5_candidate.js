var mongoose = require('mongoose');

var name = "candidate";

function makeSchema() {
	var schema = mongoose.Schema({
		name: { 
			type: String,
			required: true
		},
		candidateElections: [mongoose.model('candidateElection').schema]
	});
    schema.virtual('links').get(function () {
        /* TODO: These should be absolute URIs */
        return [
            {
                "rel": "self",
                "href": "/candidates/" + this._id
            },
            {
                "rel": "elections",
                "href": "/candidates/" + this._id + "/elections"
            },
        ];
    });
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
