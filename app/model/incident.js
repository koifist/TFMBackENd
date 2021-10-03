const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../services/core/mongoose-service');
const env = require('../config/env');

const incidentSchema = extendSchema(commonModel.schema, {
    asset: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    dateInit: {
        type: Date
    },
    dateEnd: {
        type: Date
    },
    confidentiality: {
        type: Boolean,
        required: true
    },
    integrity: {
        type: Boolean,
        required: true
    },
    availability: {
        type: Boolean,
        required: true
    },
    techniques: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Technique',
    }],
    userResponsible: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
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
module.exports = mongooseService.newModel('Incident', incidentSchema);
