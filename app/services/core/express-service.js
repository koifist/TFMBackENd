const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const express = require("express");
const bodyParser = require("body-parser");
const Promise = require("bluebird");
const env = require("../../config/env");
const router = require("../../config/router-config");
const cors = require("cors");
const moment = require("moment");

module.exports.init = function () {
  let app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.set("port", env.app.port);
  loggerService.init(app).then(function () {
    logger.info("Logger start");
    moment().locale("es");
    router.init(app);
    let resolver = Promise.defer();
    app.listen(app.get("port"), function () {
      resolver.resolve();
      logger.info("Express running at port " + env.app.port);
    });
  });
};
