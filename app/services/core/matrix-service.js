const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const Promise = require("bluebird");
const Tactic = require("../../model/tactic");
const Technique = require("../../model/technique");
const _ = require("lodash");
const matrix = require("../../assets/matrix.json");

module.exports.createMatrix = function () {
  new Promise(function (full) {
    Tactic.count()
      .then((data) => {
        if (data === 0) {
          full();
        } else {
          logger.info("[matrix-service]TacticCount matrix exists");
        }
      })
      .catch((err) => {
        logger.info("[matrix-service]TacticCount Mongo error");
      });
  })
    .then((data) => {
      _.forEach(matrix, (tactic) => {
        const techniquesPromises = [];
        _.forEach(tactic.techniques, (technique) => {
          techniquesPromises.push(createTechnique(technique));
        });
        Promise.all(techniquesPromises).then((techniques) => {
          tactic.techniques = techniques;
          Tactic.create(tactic)
            .then((data) => {
              logger.info("[matrix-service]Tacic creation success");
            })
            .catch((err) => {
              logger.info("[matrix-service]Tacic creation Mongo error");
            });
        });
      }).catch((err) => {
        logger.info("[matrix-service]Technique array creation error");
      });
    })
    .catch((err) => {
      logger.info("[matrix-service]Tacic creation Mongo error");
    });
};

function createTechnique(technique) {
  return new Promise(function (fulfill, reject) {
    Technique.create(technique)
      .then((data) => {
        logger.info("[matrix-service]Technique creation success");
        fulfill(data.id);
      })
      .catch((err) => {
        logger.info("[matrix-service]Technique Creation Mongo error");
        reject(env.errCodes.SERVER);
      });
  });
}
