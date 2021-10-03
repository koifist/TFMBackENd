const authentication = require('../../services/core/authentication-service');
const controller = require('../../controller/index');
const express = require('express');
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
    let router = express.Router();
    expressApp.use('/', router);
};
