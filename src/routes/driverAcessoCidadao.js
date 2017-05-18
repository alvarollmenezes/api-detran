const acessoCidadao = require( '../config/acesso-cidadao' );

const validateScope = ( scope ) => {

    return ( req, res, next ) => {
        const scopes = [].concat( req.decodedToken.scope );
        if ( scopes.findIndex( ( s => s === scope ) ) !== -1 ) {
            return next();
        } else {
            const err = new Error( 'Usuário não possui escopo necessário.' );
            err.status = 498;
            err.userMessage = err.message;
            err.handled = true;
            throw err;
        }
    };
};

module.exports = app => {

    const driverController = require( '../controllers/driverController' )();

    app.get( '/driver/data/:cpf', validateScope( acessoCidadao.getDadosScope ), driverController.getDadosCondutor );
};
