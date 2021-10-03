try {
    const expressService = require('./services/core/express-service');
    const mongooseService = require('./services/core/mongoose-service');
    mongooseService.init().then(function () {
        expressService.init();
    });

} catch (Exception) {
    console.error('================================================================================\n' + 'GENERAL ERROR API', Exception);
}
