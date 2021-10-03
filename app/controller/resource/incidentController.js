const loggerService = require("../../services/core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const error = require("../../services/core/error-service");
const incidentService = require("../../services/resource/incident-service");
