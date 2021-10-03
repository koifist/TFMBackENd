const winston = require('winston');
require('winston-daily-rotate-file');
const morgan = require('morgan');
const _ = require('lodash');
const expressWinston = require('express-winston');
const envConfig = require('../../config/env');
const path = require('path');
const fs = require('fs');
const logFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({format: 'DD-MM-YYYY HH:MM'}),
    winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}`
    ),
);

let _logger;
const _iniLogger = function () {
    if (_.isUndefined(_logger)) {
        let transportRotate = new (winston.transports.DailyRotateFile)({
            json: true,
            filename: path.join(process.cwd(), 'logs', envConfig.logger.fileName),
            datePattern: 'DD-MM-YYYY',
            handleExceptions: true,
            name: 'filelog',
            level: envConfig.logger.levelFile,
            maxsize: '2k',
            maxFiles: '1d'
        });

        _logger = new (winston.createLogger)({
            transports: [
                new (winston.transports.Console)({
                    format: logFormat,
                    name: 'console',
                    level: envConfig.logger.levelConsole,
                    colorize: true
                }),
                transportRotate
            ]
        });
    }
};

module.exports.init = function (pExpressApp) {
    return new Promise(function (fulfill, reject) {
        return new Promise(function (ful) {
            try {
                fs.statSync('logs');
                ful(true);
            } catch (e) {
                fs.mkdirSync('logs');
                ful(false);
            }
        }).then(function (ok) {
            console.error(ok ? '[*] OK. logger directory exist !' : '[X] Logger directory do not exist. Created ok!');
            pExpressApp.use(expressWinston.errorLogger({
                format: logFormat,
                transports: [
                    new winston.transports.Console({
                        json: true,
                        colorize: true
                    })
                ]
            }));

            let morganLogger = new winston.createLogger({
                transports: [
                    new winston.transports.File({
                        level: 'debug',
                        filename: './logs/RESTFULL.log',
                        handleExceptions: true,
                        maxsize: 5242880, //5MB
                        maxFiles: 5,
                    }),
                    new winston.transports.Console({
                        format: logFormat,
                        level: envConfig.logger.levelConsole,
                        handleExceptions: true,
                    })
                ],
                exitOnError: false
            });

            morganLogger.stream = {
                write: function (message, encoding) {
                    morganLogger.debug(message);
                }
            };
            pExpressApp.use(morgan('combined', {'stream': morganLogger.stream}));

            fulfill(_iniLogger());
        });
    });

};

module.exports.getLogger = function () {
    _iniLogger();
    return _logger;
};