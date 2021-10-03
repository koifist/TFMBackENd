const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const Promise = require("bluebird");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
