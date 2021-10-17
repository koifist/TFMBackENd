const express = require("express");
const routers = require("./routes");

module.exports.init = function (expressApp) {
  let router = express.Router();
  routers.userRouter.init(expressApp);
  routers.assetRouter.init(expressApp);
  routers.incidentRouter.init(expressApp);
  routers.dashboardRouter.init(expressApp);
  expressApp.use("/", router);
};
