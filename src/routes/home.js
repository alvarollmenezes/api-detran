module.exports = app => {

    const homeController = require( '../controllers/homeController' )();

    app.get( '/driverData', homeController.getDriverLicenseData );

    app.get( '/tickets', homeController.getTickets );

    return app;
};
