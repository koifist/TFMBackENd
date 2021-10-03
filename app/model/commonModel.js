let mongoose = require('mongoose');

const commonModel = new mongoose.Schema({
    createdBy: {
        kind: {type: String},
        item: {type: mongoose.Schema.Types.ObjectId}
    },
    updatedBy: {
        kind: {type: String},
        item: {type: mongoose.Schema.Types.ObjectId}
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        kind: {type: String},
        item: {type: mongoose.Schema.Types.ObjectId}
    }
}, {
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
});
module.exports = mongoose.model('commonModel', commonModel);