const loggerService = require("../../services/core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const error = require("../../services/core/error-service");
const incidentService = require("../../services/resource/incident-service");

/**
 * Method that return matrix
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
 module.exports.getMatrix = function (req, res) {
    logger.info("[incidentController] getMatrix Start");
    incidentService
      .getMatrix(req.body, req.user)
      .then(function (data) {
        logger.info("[incidentController] getMatrix Success");
        res.json(data);
      })
      .catch(function (err) {
        logger.error("[incidentController] getMatrix Error", err);
        error.sendError(err, res);
      });
  };
  
  /**
   * Method that find Incident
   * @param {Object} req
   * @param {Object} res
   * @return {Promise}
   */
  module.exports.findIncident = function (req, res) {
    logger.info("[incidentController] createIncident Start");
      incidentService
        .findIncident(req.body, req.user)
        .then(function (data) {
          logger.info("[incidentController] createIncident Success");
          res.json(data);
        })
        .catch(function (err) {
          logger.error("[incidentController] createIncident Error", err);
          error.sendError(err, res);
        });
  };
  
  /**
   * Method that create Incident
   * @param {Object} req
   * @param {Object} res
   * @return {Promise}
   */
  module.exports.createIncident = function (req, res) {
    logger.info("[incidentController] createIncident Start");
    if (!req.user.isAdmin && !req.user.isRseg) {
      logger.info("[incidentController] createIncident Not RSEG");
      error.sendError(env.errCodes.ERR401, res);
    } else {
      incidentService
        .createIncident(req.body, req.user)
        .then(function (data) {
          logger.info("[incidentController] createIncident Success");
          res.json(data);
        })
        .catch(function (err) {
          logger.error("[incidentController] createIncident Error", err);
          error.sendError(err, res);
        });
    }
  };
  
  /**
   * Method that update Incident
   * @param {Object} req
   * @param {Object} res
   * @return {Promise}
   */
  module.exports.updateIncident = function (req, res) {
    logger.info("[incidentController] updateIncident Start");
    if (!req.user.isAdmin && !req.user.isRseg) {
      logger.info("[incidentController] updateIncident Not RSEG");
      error.sendError(env.errCodes.ERR401, res);
    } else {
      incidentService
        .updateIncident(req.body, req.user, req.params)
        .then(function (data) {
          logger.info("[incidentController] updateIncident Success");
          res.json(data);
        })
        .catch(function (err) {
          logger.error("[incidentController] updateIncident Error", err);
          error.sendError(err, res);
        });
    }
  };
  
  /**
   * Method that delete Incident
   * @param {Object} req
   * @param {Object} res
   * @return {Promise}
   */
  module.exports.deleteIncident = function (req, res) {
    logger.info("[incidentController] deleteIncident Start");
    if (!req.user.isAdmin && !req.user.isRseg) {
      logger.info("[incidentController] deleteIncident Not RSEG");
      error.sendError(env.errCodes.ERR401, res);
    } else {
      incidentService
        .deleteIncident(req.body, req.user, req.params)
        .then(function (data) {
          logger.info("[incidentController] deleteIncident Success");
          res.json(data);
        })
        .catch(function (err) {
          logger.error("[incidentController] deleteIncident Error", err);
          error.sendError(err, res);
        });
    }
  };
  
  /**
   * Method that close Incident
   * @param {Object} req
   * @param {Object} res
   * @return {Promise}
   */
  module.exports.closeIncident = function (req, res) {
    logger.info("[incidentController] closeIncident Start");
    if (!req.user.isAdmin && !req.user.isRseg) {
      logger.info("[incidentController] closeIncident Not RSEG");
      error.sendError(env.errCodes.ERR401, res);
    } else {
      incidentService
        .closeIncident(req.body, req.user, req.params)
        .then(function (data) {
          logger.info("[incidentController] closeIncident Success");
          res.json(data);
        })
        .catch(function (err) {
          logger.error("[incidentController] closeIncident Error", err);
          error.sendError(err, res);
        });
    }
  };
  