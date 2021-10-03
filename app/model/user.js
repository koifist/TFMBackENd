const extendSchema = require('mongoose-extend-schema');
const commonModel = require('./commonModel');
const mongooseService = require('../services/core/mongoose-service');
const env = require('../config/env');

const userSchema = extendSchema(commonModel.schema, {
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: env.services.roles.consultant
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
userSchema.virtual('isAdmin').get(function () {
    return (this.role === 'ADM');
});
userSchema.virtual('isRseg').get(function () {
    return (this.role === 'RSE');
});
userSchema.virtual('isRsis').get(function () {
    return (this.role === 'RSI');
});
userSchema.virtual('isConsultant').get(function () {
    return (this.role === 'CON');
});
module.exports = mongooseService.newModel('User', userSchema);
