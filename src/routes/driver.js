const acessoCidadao = require( '../config/acesso-cidadao' );
const validateAtEndpoint = require( 'node-mw-api-prodest' ).validateAtEndpoint( acessoCidadao.userInfoUrl );

module.exports = app => {

    const driverController = require( '../controllers/driverController' )();

    app.get( '/driver', validateAtEndpoint, driverController.getData );

    app.get( '/driver/tickets', validateAtEndpoint, driverController.getTickets );
};
