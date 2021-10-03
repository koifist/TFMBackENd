const authentication = require("../../services/core/authentication-service");
const controller = require("../../controller/index");
const express = require("express");
/**
 * Method to run routes
 */
module.exports.init = function (expressApp) {
  let router = express.Router();

  /**
   * Route that returns a list of assetTypes
   * @param {Object} req.user User token info
   * @return {Array} Array of assets
   */
  router.get(
    "/assetType",
    authentication.init,
    controller.assetController.findAssetType
  );

  /**
   * Route that create a assetType
   * @param {Object} req.user User token info
   * @return {Array} Array of assets
   */
  router.post(
    "/createAssetType",
    authentication.init,
    controller.assetController.createAssetType
  );

  /**
   * Route that returns a list of asset
   * @param {Object} req.user User token info
   * @return {Array} Array of assets
   */
  router.get(
    "/asset",
    authentication.init,
    controller.assetController.findAsset
  );

  /**
   * Route that create a asset
   * @param {Object} req.user User token info
   * @return {Array} Array of assets
   */
  router.post(
    "/createAsset",
    authentication.init,
    controller.assetController.createAsset
  );

  /**
   * Route that update a asset
   * @param {Object} req.user User token info
   * @return {Array} Array of assets
   */
  router.put(
    "/updateAsset/:_id*",
    authentication.init,
    controller.assetController.updateAsset
  );

  /**
   * Route that remove a asset
   * @param {Object} req.user User token info
   * @return {Array} Array of assets
   */
  router.delete(
    "/deleteAsset/:_id*",
    authentication.init,
    controller.assetController.deleteAsset
  );
  expressApp.use("/", router);
};
