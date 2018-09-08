var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var scriptSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    xml: String,
    python: String,
    mode: String,
    isPublic: Boolean,
    ownerEmail:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var Script = mongoose.model('script', scriptSchema);

module.exports = Script;