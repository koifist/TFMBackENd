const loggerService = require('../../services/core/logger-service');
let logger = loggerService.getLogger();
const env = require('../../config/env');
const error = require('../../services/core/error-service');
const userService = require('../../services/resource/user-service');

/**
 * Method that return all active users
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.getUser = function (req, res) {
    logger.info('[userController] start getUser');
    if (req.user.role !== env.services.roles.admin) {
        logger.info('[brokerController] getUser Not ADM');
        error.sendError(env.errCodes.ERR401, res)
    } else {
        userService.getUser(req.user).then(function (data) {
            logger.info('[userController] getUser success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] getUser error', err);
            error.sendError(err, res);
        });
    }
};

/**
 * Method that return a token to user
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.signIn = function (req, res) {
    logger.info('[userController] start signIn');
        userService.signIn(req.body).then(function (data) {
            logger.info('[userController] signIn success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] signIn error', err);
            error.sendError(err, res);
        });
};

/**
 * Method that create user
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.signUp = function (req, res) {
    logger.info('[userController] SignUp Start');
    userService.signUp(req.body).then(function (data) {
        logger.info('[userController] SignUp success');
        res.json(data);
    }).catch(function (err) {
        logger.error('[userController] signUp error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that update user password
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.updatePass = function (req, res) {
    logger.info('[userController] updatePass Start');
    userService.updatePass(req.body, req.user).then(function (data) {
        logger.info('[userController] updatePass success');
        res.json(data);
    }).catch(function (err) {
        logger.error('[userController] updatePass error', err);
        error.sendError(err, res);
    });
};

/**
 * Method that update user Role [Administrator only]
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.updateRole = function (req, res) {
    logger.info('[userController] updateRole Start');
    if (req.user.role !== env.services.roles.admin) {
        logger.info('[brokerController] updateRole Not ADM');
        error.sendError(env.errCodes.ERR401, res)
    } else {
        userService.updateRole(req.body, req.params, req.user).then(function (data) {
            logger.info('[userController] updateRole success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] updateRole error', err);
            error.sendError(err, res);
        });
    }
};

/**
 * Method that delete user
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.deleteUser = function (req, res) {
    logger.info('[userController] deleteUser Start');
    if (req.user.role === env.services.roles.admin && req.params._id) {
        userService.deleteUser(req.params, req.user).then(function (data) {
            logger.info('[brokerController] deleteUser Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] deleteUser ADM error', err);
            error.sendError(err, res);
        });
    } else if (!req.params._id) {
        userService.deleteUser(req.user, req.user).then(function (data) {
            logger.info('[brokerController] deleteUser Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] deleteUser error', err);
            error.sendError(err, res);
        });
    } else {
        logger.info('[userController] deleteUser error', env.errCodes.ERR400);
        error.sendError(env.errCodes.ERR400, res);
    }
};

/**
 * Method that activate user
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.activateUser = function (req, res) {
    logger.info('[userController] activateUser Start');
    if (req.user.role === env.services.roles.admin) {
        userService.activateUser(req.params, req.user).then(function (data) {
            logger.info('[brokerController] activateUser Success');
            res.json(data);
        }).catch(function (err) {
            logger.error('[userController] activateUser ADM error', err);
            error.sendError(err, res);
        });
    } else {
        logger.info('[userController] activateUser error', env.errCodes.ERR400);
        error.sendError(env.errCodes.ERR400, res);
    }
};
