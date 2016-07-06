module.exports = app => {

    const homeController = require( '../controllers/homeController' )();

    app.get( '/driverData', homeController.getDriverData );

    app.get( '/tickets', homeController.getTickets );

    return app;
};
