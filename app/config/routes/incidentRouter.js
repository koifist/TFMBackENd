const authentication = require("../../services/core/authentication-service");
const controller = require("../../controller/index");
const express = require("express");
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
  let router = express.Router();
  
  /**
   * Route that returns the matrix
   * @param {Object} req.user User token info
   * @return {Array} Array of Tactics
   */
   router.get(
    "/matrix",
    authentication.init,
    controller.incidentController.getMatrix
  );

  /**
   * Route that returns a list of incident
   * @param {Object} req.user User token info
   * @return {Array} Array of incidents
   */
  router.get(
    "/incident",
    authentication.init,
    controller.incidentController.findIncident
  );

  /**
   * Route that returns a list of incident
   * @param {Object} req.user User token info
   * @return {Object} Array of incidents
   */
  router.get(
    "/incidentOpen",
    authentication.init,
    controller.incidentController.findIncidentOpen
  );

  /**
   * Route that create a incident
   * @param {Object} req.user User token info
   * @return {Array} Array of incidents
   */
  router.post(
    "/createIncident",
    authentication.init,
    controller.incidentController.createIncident
  );

  /**
   * Route that update a incident
   * @param {Object} req.user User token info
   * @return {Array} Array of incidents
   */
  router.put(
    "/updateIncident/:_id*",
    authentication.init,
    controller.incidentController.updateIncident
  );

  /**
   * Route that remove a incident
   * @param {Object} req.user User token info
   * @return {Array} Array of incidents
   */
  router.delete(
    "/deleteIncident/:_id*",
    authentication.init,
    controller.incidentController.deleteIncident
  );

  /**
   * Route that close a incident
   * @param {Object} req.user User token info
   * @return {Array} Array of incidents
   */
  router.put(
    "/closeIncident/:_id*",
    authentication.init,
    controller.incidentController.closeIncident
  );
  expressApp.use("/", router);
};
