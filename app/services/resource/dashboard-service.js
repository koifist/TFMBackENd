const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const Promise = require("bluebird");
const Incident = require("../../model/incident");
const Asset = require("../../model/asset");
const _ = require("lodash");
const moment = require("moment");

/**
 * Function to find incident
 * @param params
 * @param user
 * @returns {Promise}
 */
module.exports.getDashboardInfo = function (param, user) {
  return new Promise(function (resolve, reject) {
    let promiseArray = [];
    promiseArray.push(getDateIncidents());
    promiseArray.push(getIncidentAssetType());
    promiseArray.push(getAssetsOutOfService());
    Promise.all(promiseArray)
      .then((data) => {
        let response = {
          incidentesMonth: data[0],
          incidentsAssetType: data[1],
          assetsDisabled: data[2],
        };
        resolve(response);
      })
      .catch((err) => {
        reject(env.errCodes.SERVER);
      });
  });
};
function getDateIncidents() {
  return new Promise(function (resolve, reject) {
    const dateInit = moment().subtract(30, "day");
    Incident.find({ active: true, dateInit: { $gte: dateInit } })
      .select(env.mongo.select.default)
      .then(function (elem) {
        let incidentList = _.map(elem, (incident) => {
          incident._doc.dateInit = moment(incident.dateInit).format(
            "YYYY/MM/DD"
          );
          return incident;
        });
        incidentList = _.groupBy(incidentList, "_doc.dateInit");
        const listReturn = [];
        for (let i = 0; i <= 30; i++) {
          const aux = {
            label: moment(dateInit).format("YYYY/MM/DD"),
            value: incidentList[moment(dateInit).format("YYYY/MM/DD")]
              ? incidentList[moment(dateInit).format("YYYY/MM/DD")].length
              : 0,
          };
          listReturn.push(aux);
          dateInit.add(1, "day");
        }
        resolve(listReturn);
      })
      .catch(function (err) {
        logger.info("[incident-services]findIncident Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
}
function getIncidentAssetType() {
  return new Promise(function (resolve, reject) {
    Incident.find({ active: true })
      .select(env.mongo.select.default)
      .populate({
        path: "asset",
        select: env.mongo.select.default,
        populate: [{ path: "assetType", select: env.mongo.select.default }],
      })
      .then(function (elem) {
        let listReturn = [];
        let incidentList = _.groupBy(
          elem,
          "_doc.asset._doc.assetType._doc.name"
        );
        _.forEach(incidentList, (value, key) => {
          const aux = {
            label: key,
            value: value ? value.length : 0,
          };
          listReturn.push(aux);
        });
        resolve(_.orderBy(listReturn, ['value', 'label'], ['desc', 'asc']));
      })
      .catch(function (err) {
        logger.info("[incident-services]findIncident Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
}

function getAssetsOutOfService() {
  return new Promise(function (resolve, reject) {
    Incident.find({ active: true, dateEnd: { $exists: false }, availability: true })
      .populate({
        path: "asset",
        select: env.mongo.select.default,
        populate: [{ path: "assetType", select: env.mongo.select.default }]
      })
      .select(env.mongo.select.default)
      .then(function (elem) {
        resolve(elem);
      })
      .catch(function (err) {
        logger.info("[dashboard-services]getAssetsOutOfService Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
}
