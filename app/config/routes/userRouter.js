const authentication = require('../../services/core/authentication-service');
const controller = require('../../controller/index');
const express = require('express');
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
    let router = express.Router();

    /**
     * Route that returns a list of users
     * @param {Object} req.user User token info
     * @return {Array} Array of users
     */
    router.get('/user', authentication.init, controller.userController.getUser);

    /**
     * Route that returns a token to the user.
     * @param {String} req.body.username Username
     * @param {String} req.body.password Password
     * @return {String} Token from user
     */
    router.post('/createSession', controller.userController.signIn);

    /**
     * Route that create a public user
     * @param {String} req.body.username Username
     * @param {String} req.body.password Password
     * @return {status} Status of response
     */
    router.post('/createUser', controller.userController.signUp);

    /**
     * Route that change user password
     * @param {String} req.body.password Password
     * @return {status} Status of response
     */
    router.post('/updatePass', authentication.init, controller.userController.updatePass);

    /**
     * @param {String} req.params._id Id of user to delete
     * @param {Object} req.user User token info
     * @return {status} Status of response
     */
    router.delete('/deleteUser/:_id*?', authentication.init, controller.userController.deleteUser);

    /**
     * Route that activate User.
     * @param {String} req.params._id Id of user to activate
     * @param {Object} req.user User token info
     * @return {status} Status of response
     */
    router.post('/activateUser/:_id*', authentication.init, controller.userController.activateUser);

    /**
     * Route that update user role.
     * @param {String} req.params._id Id of user to update
     * @param {Object} req.user User token info
     * @return {status} Status of response
     */
    router.post('/updateRole/:_id*', authentication.init, controller.userController.updateRole);

    expressApp.use('/', router);
};
