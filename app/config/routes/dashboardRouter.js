const authentication = require("../../services/core/authentication-service");
const controller = require("../../controller/index");
const express = require("express");
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
  let router = express.Router();
  
  /**
   * Route that returns the dashboard information
   * @param {Object} req.user User token info
   * @return {Array} Array of Tactics
   */
   router.get(
    "/dashboard",
    authentication.init,
    controller.dashboardController.getDashboardInfo
  );
  expressApp.use("/", router);
};
