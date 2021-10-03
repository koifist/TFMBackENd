const env = require('../../config/env');

/**
 * Method that send an error to client.
 * @param {Object} error
 * @param {Object} res
 */
module.exports.sendError = function (error, res) {
    if (error.status && error.msg) {
        res.status(error.status).send({error: error.msg});
    } else {
        res.status(env.errCodes.SERVER.status);
        res.send(env.errCodes.SERVER.msg);
    }
};
