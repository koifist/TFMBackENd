const mongoose = require('mongoose');
const env = require('../../config/env');

module.exports._models = {};

module.exports.init = function () {
    mongoose.Promise = require('bluebird');
    return mongoose.connect(env.mongo.url);
};
module.exports.newModel = function (pModelName, pModelSchema) {
    let newModel = mongoose.model(pModelName, pModelSchema);
    this._models[pModelName] = newModel;
    return newModel;
};
