var mongoose = require('mongoose');

var name = "candidate";

function makeSchema() {
	var schema = mongoose.Schema({
		name: { 
			type: String,
			required: true
		},
		value: {
			type: Number, 
			required: true
		},
        electionId: { 
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },
		votes: [mongoose.model('vote').schema]
	});
    schema.virtual('links').get(function () {
        /* TODO: These should be absolute URIs */
        return [
            {
                "rel": "self",
                "href": "/candidates/" + this._id
            },
            {
                "rel": "votes",
                "href": "/candidates/" + this._id + "/votes"
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
