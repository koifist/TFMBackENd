const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const Promise = require("bluebird");
const Asset = require("../../model/asset");
const AssetType = require("../../model/assetType");
const _ = require("lodash");

/**
 * Function to form assetBody
 * @param asset Asset body
 * @returns {Object} Asset formatted
 */
function assetFormatter(asset) {
  const assetReturn = {};
  if (asset.assetType) {
    assetReturn.assetType = asset.assetType;
  }
  if (asset.criticality) {
    assetReturn.criticality = parseInt(asset.criticality);
  }
  if (asset.mtd) {
    assetReturn.mtd = parseInt(asset.mtd);
  }
  if (asset.rto) {
    assetReturn.rto = parseInt(asset.rto);
  }
  if (asset.description) {
    assetReturn.description = asset.description;
  }
  return assetReturn;
}

/**
 * Function to find assetTypes
 * @param params
 * @param user
 * @returns {Promise}
 */
module.exports.findAssetType = function (params, user) {
  return new Promise(function (resolve, reject) {
    AssetType.find({ active: true })
      .select(env.mongo.select.default)
      .then(function (elem) {
        resolve(elem);
      })
      .catch(function (err) {
        logger.info("[asset-services]findAssetType Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to create a assetType
 * @param body
 * @param user
 * @returns {Promise}
 */
module.exports.createAssetType = function (body, user) {
  return new Promise(function (resolve, reject) {
    AssetType.create(body)
      .then(function (elem) {
        resolve(env.errCodes.SUCCESS);
      })
      .catch(function (err) {
        logger.info("[asset-services]createAssetType Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to find asset
 * @param params
 * @param user
 * @returns {Promise}
 */
module.exports.findAsset = function (param, user) {
  return new Promise(function (resolve, reject) {
    Asset.find({ active: true })
      .populate({ path: "assetType", select: env.mongo.select.default })
      .populate({ path: "userResponsible", select: env.mongo.select.defaultUser })
      .select(env.mongo.select.default)
      .then(function (elem) {
        resolve(elem);
      })
      .catch(function (err) {
        logger.info("[asset-services]findAsset Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};
/**
 * Function to create a asset
 * @param body
 * @param user
 * @returns {Promise}
 */
module.exports.createAsset = function (body, user) {
  return new Promise(function (resolve, reject) {
    const asset = assetFormatter(body);
    asset.userResponsible = user.id;
    if (!asset.mtd || !asset.rto || asset.rto > asset.mtd) {
      reject(env.errCodes.ERR405);
    } else {
      Asset.create(asset)
        .then(function (elem) {
          resolve(env.errCodes.SUCCESS);
        })
        .catch(function (err) {
          logger.info("[asset-services]createAsset Mongo error");
          reject(env.errCodes.SERVER);
        });
    }
  });
};

/**
 * Function to update a asset
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.updateAsset = function (body, user, params) {
  return new Promise(function (resolve, reject) {
    const asset = assetFormatter(body);
    if (!asset.mtd || !asset.rto || asset.rto > asset.mtd) {
      reject(env.errCodes.ERR405);
    } else {
      Asset.findByIdAndUpdate(params._id, asset)
        .then(function (elem) {
          resolve(env.errCodes.SUCCESS);
        })
        .catch(function (err) {
          logger.info("[asset-services]updateAsset Mongo error");
          reject(env.errCodes.SERVER);
        });
    }
  });
};

/**
 * Function to delete a asset
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.deleteAsset = function (body, user, params) {
  return new Promise(function (resolve, reject) {
    Asset.findByIdAndUpdate(params._id, { active: false })
      .then(function (elem) {
        resolve(env.errCodes.SUCCESS);
      })
      .catch(function (err) {
        logger.info("[asset-services]deleteAsset Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};


/**
 * Function to available a asset
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
 module.exports.availableAsset = function (assetId) {
  return new Promise(function (resolve, reject) {
      Asset.findByIdAndUpdate(assetId, {status: true})
        .then(function (elem) {
          resolve(env.errCodes.SUCCESS);
        })
        .catch(function (err) {
          logger.info("[asset-services]updateAsset Mongo error");
          reject(env.errCodes.SERVER);
        });
  });
};

/**
 * Function to disable a asset
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.disableAsset = function (assetId) {
  return new Promise(function (resolve, reject) {
    Asset.findByIdAndUpdate(assetId, {status: false})
      .then(function (elem) {
        resolve(env.errCodes.SUCCESS);
      })
      .catch(function (err) {
        logger.info("[asset-services]updateAsset Mongo error");
        reject(env.errCodes.SERVER);
      });
});
};