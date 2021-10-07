const loggerService = require("../core/logger-service");
let logger = loggerService.getLogger();
const env = require("../../config/env");
const Promise = require("bluebird");
const bcrypt = require("bcryptjs");
const User = require("../../model/user");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

/**
 * Function to signIn user and return a token with login information
 * @param body.username
 * @param body.password
 * @returns {Promise} Session token
 */
module.exports.signIn = function (body) {
  return new Promise(function (resolve, reject) {
    if (!body.username || !body.password) {
      reject(env.errCodes.ERR400);
    } else {
      User.findOne({ username: body.username, active: true })
        .select(env.mongo.select.default)
        .exec(function (err, elem) {
          if (err) {
            logger.info("[user-services]signIn mongo error");
            reject(env.errCodes.SERVER);
          } else if (!elem) {
            logger.info("[user-services]signIn user dont exist");
            reject(env.errCodes.ERR405);
          } else {
            logger.info("[user-services]signIn user found");
            bcrypt.compare(body.password, elem.password).then(function (res) {
              if (res) {
                logger.info("[user-services]signIn bcrypt pass match");
                jwt.sign(
                  {
                    username: body.username,
                  },
                  env.security.PRIVATE_TOKEN,
                  { expiresIn: env.security.TTL_TOKEN },
                  function (err, token) {
                    if (err) {
                      logger.info("[user-services]signIn jwt error");
                      reject(env.errCodes.SERVER);
                    } else {
                      delete elem._doc.password;
                      logger.info("[user-services]signIn jwt succes", token);
                      resolve({ token: token, currentUser: elem });
                    }
                  }
                );
              } else {
                logger.info("[user-services]signIn bcrypt pass dont match");
                reject(env.errCodes.ERR405);
              }
            });
          }
        });
    }
  });
};

/**
 * Function to signUp user. Store in database and return a token.
 * @param body.username
 * @param body.password
 * @returns {Promise}
 */
module.exports.signUp = function (body) {
  return new Promise(function (resolve, reject) {
    if (!body.username || !body.password) {
      reject(env.errCodes.ERR400);
    } else {
      bcrypt
        .hash(body.password, env.security.ROUND_BCRYPT)
        .then(function (hash) {
          logger.info("[user-services]signUp bcrypt hash success");
          User.create({ username: body.username, password: hash })
            .then(function (data) {
              logger.info("[user-services]signUp mongo success");
              jwt.sign(
                {
                  username: body.username,
                },
                env.security.PRIVATE_TOKEN,
                { expiresIn: env.security.TTL_TOKEN },
                function (err, token) {
                  if (err) {
                    logger.info("[user-services]signIn jwt error");
                    reject(env.errCodes.SERVER);
                  } else {
                    delete data._doc.password;
                    logger.info("[user-services]signIn jwt succes", token);
                    resolve({ token: token, currentUser: data });
                  }
                }
              );
            })
            .catch(function (err) {
              logger.info("[user-services]signUp mongo error");
              reject(env.errCodes.ERR400);
            });
        })
        .catch(function (err) {
          logger.info("[user-services]signUp bcrypt hash error");
          reject(env.errCodes.SERVER);
        });
    }
  });
};

/**
 * Function to update password of user
 * @param user
 * @param body.password
 * @returns {Promise}
 */
module.exports.updatePass = function (body, user) {
  return new Promise(function (resolve, reject) {
    bcrypt
      .hash(body.password, env.security.ROUND_BCRYPT)
      .then(function (hash) {
        logger.info("[user-services]signUp bcrypt hash success");
        User.findByIdAndUpdate(user._id, { password: hash }).exec(function (
          err,
          data
        ) {
          if (err) {
            logger.info("[userService] updatePass error");
            reject(env.errCodes.SERVER);
          } else {
            logger.info("[userService] updatePass success");
            resolve(env.errCodes.SUCCESS);
          }
        });
      })
      .catch(function (err) {
        logger.info("[user-services]signUp bcrypt hash error");
        reject(env.errCodes.SERVER);
      });
  });
};

/**
 * Function to update user role
 * @param user
 * @param {Object} body.role
 * @returns {Promise}
 */
module.exports.updateRole = function (body, params, user) {
  return new Promise(function (resolve, reject) {
    User.findOneAndUpdate(
      { _id: params._id, role: { $nin: [env.services.roles.admin] } },
      { role: body.role }
    ).exec(function (err, data) {
      if (err) {
        logger.info("[userService] updateRole error");
        reject(env.errCodes.SERVER);
      } else {
        logger.info("[userService] updateRole success");
        resolve(env.errCodes.SUCCESS);
      }
    });
  });
};

/**
 * Function to delete user
 * @param body._id
 * @returns {Promise}
 */
module.exports.deleteUser = function (body, user) {
  return new Promise(function (resolve, reject) {
    User.findOneAndUpdate(
      { _id: body._id, role: { $nin: [env.services.roles.admin] } },
      {
        active: false,
        role: env.services.roles.consultant,
      }
    ).exec(function (err, data) {
      if (err) {
        logger.info("[userService] deleteUser error");
        reject(env.errCodes.SERVER);
      } else {
        logger.info("[userService] deleteUser success");
        resolve(env.errCodes.SUCCESS);
      }
    });
  });
};

/**
 * Function to activate user
 * @param body._id
 * @returns {Promise}
 */
module.exports.activateUser = function (body, user) {
  return new Promise(function (resolve, reject) {
    User.findOneAndUpdate(
      { _id: body._id, role: { $nin: [env.services.roles.admin] } },
      { active: true }
    ).exec(function (err, data) {
      if (err) {
        logger.info("[userService] activateUser error");
        reject(env.errCodes.SERVER);
      } else {
        logger.info("[userService] activateUser success");
        resolve(env.errCodes.SUCCESS);
      }
    });
  });
};

/**
 * Function to get user
 * @returns {Promise}
 */
module.exports.findUser = function (user) {
  return new Promise(function (resolve, reject) {
    User.find({ role: { $nin: [env.services.roles.admin] } })
      .select("_id username role active")
      .sort("username")
      .exec(function (err, data) {
        if (err) {
          logger.info("[userService] getUser error");
          reject(env.errCodes.SERVER);
        } else {
          logger.info("[userService] getUser success");
          resolve(data);
        }
      });
  });
};
