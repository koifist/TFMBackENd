const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const Promise = require("bluebird");
const Incident = require("../../model/incident");
const Tactic = require("../../model/tactic");
const _ = require("lodash");
const assetService = require("./asset-service");
const moment = require("moment");
/**
 * Function to form incidentBody
 * @param  Incident body
 * @returns {Object} Incident formatted
 */
function incidentFormatter(incident) {
  const incidentReturn = {};
  if (incident.name) {
    incidentReturn.name = incident.name;
  }
  if (incident.asset) {
    incidentReturn.asset = incident.asset;
  }
  if (incident.hasOwnProperty("confidentiality")) {
    incidentReturn.confidentiality = !!incident.confidentiality;
  }
  if (incident.hasOwnProperty("integrity")) {
    incidentReturn.integrity = incident.integrity;
  }
  if (incident.hasOwnProperty("availability")) {
    incidentReturn.availability = incident.availability;
  }
  if (incident.techniques) {
    incidentReturn.techniques = incident.techniques;
  }
  if (incident.description) {
    incidentReturn.description = incident.description;
  }

  return incidentReturn;
}

/**
 * Function to find incident
 * @param params
 * @param user
 * @returns {Promise}
 */
module.exports.findIncident = function (param, user) {
  return new Promise(function (resolve, reject) {
    Incident.find({ active: true })
      .populate({
        path: "asset",
        select: env.mongo.select.default,
        populate: [
          { path: "assetType", select: env.mongo.select.default },
          { path: "userResponsible", select: env.mongo.select.defaultUser },
        ],
      })
      .populate({ path: "techniques", select: env.mongo.select.default })
      .populate({
        path: "userResponsible",
        select: env.mongo.select.defaultUser,
      })
      .select(env.mongo.select.default)
      .then(function (elem) {
        resolve(elem);
      })
      .catch(function (err) {
        logger.info("[incident-services]findIncident Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to find incident
 * @param params
 * @param user
 * @returns {Promise}
 */
module.exports.findIncidentOpen = function (params, user) {
  return new Promise(function (resolve, reject) {
    Incident.findOne({
      asset: params.asset,
      dateEnd: { $exists: false },
      active: true,
    })
      .populate({
        path: "asset",
        select: env.mongo.select.default,
        populate: [
          { path: "assetType", select: env.mongo.select.default },
          { path: "userResponsible", select: env.mongo.select.defaultUser },
        ],
      })
      .populate({ path: "techniques", select: env.mongo.select.default })
      .populate({
        path: "userResponsible",
        select: env.mongo.select.defaultUser,
      })
      .select(env.mongo.select.default)
      .then(function (elem) {
        resolve(elem);
      })
      .catch(function (err) {
        logger.info("[incident-services]findIncidentOpen Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to create a incident
 * @param body
 * @param user
 * @returns {Promise}
 */
module.exports.createIncident = function (body, user) {
  return new Promise(function (resolve, reject) {
    new Promise(function (full) {
      const incident = incidentFormatter(body);
      incident.dateInit = moment().utc();
      incident.userResponsible = user.id;
      if (!body.asset) {
        reject(env.errCodes.ERR400);
      } else {
        Incident.count({
          asset: body.asset,
          dateEnd: { $exists: false },
          active: true,
        })
          .then(function (elem) {
            if (elem === 0) {
              full(incident);
            } else {
              reject(env.errCodes.ERR405);
            }
          })
          .catch(function (err) {
            logger.info("[incident-services]createIncident Mongo error");
            reject(env.errCodes.SERVER);
          });
      }
    })
      .then((data) => {
        Incident.create(data)
          .then(function (elem) {
            if (elem.availability) {
              assetService
                .disableAsset(elem.asset)
                .then(() => {
                  resolve(env.errCodes.SUCCESS);
                })
                .catch((err) => {
                  reject(env.errCodes.SERVER);
                });
            } else {
              assetService
                .availableAsset(elem.asset)
                .then(() => {
                  resolve(env.errCodes.SUCCESS);
                })
                .catch((err) => {
                  reject(env.errCodes.SERVER);
                });
            }
          })
          .catch(function (err) {
            logger.info("[incident-services]createIncident Mongo error");
            reject(env.errCodes.SERVER);
          });
      })
      .catch((err) => {
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to update a incident
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.updateIncident = function (body, user, params) {
  return new Promise(function (resolve, reject) {
    const incident = incidentFormatter(body);
    Incident.findOneAndUpdate(
      { _id: params._id, dateEnd: { $exists: false }, active: true },
      incident,
      { new: true }
    )
      .then(function (elem) {
        if (elem.availability) {
          assetService
            .disableAsset(elem.asset)
            .then(() => {
              resolve(env.errCodes.SUCCESS);
            })
            .catch((err) => {
              reject(env.errCodes.SERVER);
            });
        } else {
          assetService
            .availableAsset(elem.asset)
            .then(() => {
              resolve(env.errCodes.SUCCESS);
            })
            .catch((err) => {
              reject(env.errCodes.SERVER);
            });
        }
      })
      .catch(function (err) {
        logger.info("[incident-services]updateIncident Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to delete a incident
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.deleteIncident = function (body, user, params) {
  return new Promise(function (resolve, reject) {
    Incident.findOneAndUpdate(
      { _id: params._id, dateEnd: { $exists: false } },
      { active: false }
    )
      .then(function (elem) {
        assetService
          .availableAsset(elem.asset)
          .then(() => {
            resolve(env.errCodes.SUCCESS);
          })
          .catch((err) => {
            reject(env.errCodes.SERVER);
          });
      })
      .catch(function (err) {
        logger.info("[incident-services]deleteIncident Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to close incident
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.closeIncident = function (body, user, params) {
  return new Promise(function (resolve, reject) {
    const dateEnd = moment().utc();
    Incident.findOneAndUpdate(
      { _id: params._id, dateEnd: { $exists: false }, active: true },
      { dateEnd: dateEnd }
    )
      .then(function (elem) {
        assetService
          .availableAsset(elem.asset)
          .then(() => {
            resolve(env.errCodes.SUCCESS);
          })
          .catch((err) => {
            reject(env.errCodes.SERVER);
          });
      })
      .catch(function (err) {
        logger.info("[incident-services]closeIncident Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to get MITRE matrix
 * @param body
 * @param user
 * @param params
 * @returns {Promise}
 */
module.exports.getMatrix = function (body, user, params) {
  return new Promise(function (resolve, reject) {
    Tactic.find({})
      .populate({ path: "techniques", select: env.mongo.select.default })
      .select(env.mongo.select.default)
      .then(function (elem) {
        resolve(elem);
      })
      .catch(function (err) {
        logger.info("[incident-services]getMatrix Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
};
