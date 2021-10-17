const loggerService = require("../../services/core/logger-service");
let logger = loggerService.getLogger();
const error = require("../../services/core/error-service");
const dashboardService = require("../../services/resource/dashboard-service");

/**
 * Method that return dashboard info
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.getDashboardInfo = function (req, res) {
  logger.info("[dashboardController] getDashboardInfo Start");
  dashboardService
    .getDashboardInfo(req.body, req.user)
    .then(function (data) {
      logger.info("[dashboardController] getDashboardInfo Success");
      res.json(data);
    })
    .catch(function (err) {
      logger.error("[dashboardController] getDashboardInfo Error", err);
      error.sendError(err, res);
    });
};
