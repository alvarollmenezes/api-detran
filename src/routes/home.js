module.exports = app => {

    const homeController = require( '../controllers/homeController' )();

    app.get( '/driverLicenseData', homeController.getDriverLicenseData );

    app.get( '/tickets', homeController.getTickets );

    return app;
};
