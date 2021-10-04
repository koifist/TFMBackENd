const loggerService = require("../../services/core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const error = require("../../services/core/error-service");
const assetService = require("../../services/resource/asset-service");

/**
 * Method that find assetTypes
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.findAssetType = function (req, res) {
  logger.info("[assetController] findAssetType Start");
  assetService
    .findAssetType(req.body, req.user)
    .then(function (data) {
      logger.info("[assetController] findAssetType Success");
      res.json(data);
    })
    .catch(function (err) {
      logger.error("[assetController] findAssetType Error", err);
      error.sendError(err, res);
    });
};

/**
 * Method that create AssetType
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.createAssetType = function (req, res) {
  logger.info("[assetController] createAssetType Start");
  if (!req.user.isAdmin) {
    logger.info("[assetController] createAssetType Not RSIS");
    error.sendError(env.errCodes.ERR401, res);
  } else {
    assetService
      .createAssetType(req.body, req.user)
      .then(function (data) {
        logger.info("[assetController] createAssetType Success");
        res.json(data);
      })
      .catch(function (err) {
        logger.error("[assetController] createAssetType Error", err);
        error.sendError(err, res);
      });
  }
};

/**
 * Method that find Asset
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.findAsset = function (req, res) {
  logger.info("[assetController] createAsset Start");
    assetService
      .findAsset(req.body, req.user)
      .then(function (data) {
        logger.info("[assetController] createAsset Success");
        res.json(data);
      })
      .catch(function (err) {
        logger.error("[assetController] createAsset Error", err);
        error.sendError(err, res);
      });
};

/**
 * Method that create Asset
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.createAsset = function (req, res) {
  logger.info("[assetController] createAsset Start");
  if (!req.user.isAdmin && !req.user.isRsis) {
    logger.info("[assetController] createAsset Not RSIS");
    error.sendError(env.errCodes.ERR401, res);
  } else {
    assetService
      .createAsset(req.body, req.user)
      .then(function (data) {
        logger.info("[assetController] createAsset Success");
        res.json(data);
      })
      .catch(function (err) {
        logger.error("[assetController] createAsset Error", err);
        error.sendError(err, res);
      });
  }
};

/**
 * Method that update Asset
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.updateAsset = function (req, res) {
  logger.info("[assetController] updateAsset Start");
  if (!req.user.isAdmin && !req.user.isRsis) {
    logger.info("[assetController] updateAsset Not RSIS");
    error.sendError(env.errCodes.ERR401, res);
  } else {
    assetService
      .updateAsset(req.body, req.user, req.params)
      .then(function (data) {
        logger.info("[assetController] updateAsset Success");
        res.json(data);
      })
      .catch(function (err) {
        logger.error("[assetController] updateAsset Error", err);
        error.sendError(err, res);
      });
  }
};

/**
 * Method that delete Asset
 * @param {Object} req
 * @param {Object} res
 * @return {Promise}
 */
module.exports.deleteAsset = function (req, res) {
  logger.info("[assetController] deleteAsset Start");
  if (!req.user.isAdmin && !req.user.isRsis) {
    logger.info("[assetController] deleteAsset Not RSIS");
    error.sendError(env.errCodes.ERR401, res);
  } else {
    assetService
      .deleteAsset(req.body, req.user, req.params)
      .then(function (data) {
        logger.info("[assetController] deleteAsset Success");
        res.json(data);
      })
      .catch(function (err) {
        logger.error("[assetController] deleteAsset Error", err);
        error.sendError(err, res);
      });
  }
};
