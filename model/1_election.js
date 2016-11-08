var mongoose = require('mongoose');

var name = "election";

function makeSchema() {
	var schema = mongoose.Schema({
		name: {
			type: String,
			required: true
		},
		candidateIds: [mongoose.Schema.Types.ObjectId],
		voterIds: [mongoose.Schema.Types.ObjectId]
	});
    schema.virtual('links').get(function () {
        /* TODO: These should be absolute URIs */
        return [{
            "rel": "self",
            "href": "/elections/" + this._id
        }];
    })
    schema.virtual('links').set(function (links) {
        this.links = links;
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
