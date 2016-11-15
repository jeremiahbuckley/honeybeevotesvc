var mongoose = require('mongoose');

var name = "candidateElection";

function makeSchema() {
	var schema = mongoose.Schema({
        electionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true
        },
		value: {
			type: Number, 
			required: true
		},
		votes: [mongoose.model('vote').schema]
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
