module.exports = app => {

    const driverController = require( '../controllers/driverController' )();

    app.get( '/driver', driverController.getData );

    app.get( '/driver/tickets', driverController.getTickets );

    return app;
};
