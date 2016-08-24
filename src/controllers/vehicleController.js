const authorization = require( '../services/authorization' );
const driverService = require( '../services/driverService' );

module.exports = () => {
    var vehicleController = new Object();

    // Needed because of PRODEST's SSL
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    vehicleController.getData = ( req, res, next ) => {
        const authHeader = req.get( 'Authorization' );

        return fetchData( authHeader, driverService().getDadosGeraisCNH )
        .then( () => {
            return res.json( {
                plate: 'ABC1234',
                model: 'BMW 118i',
                color: 'Prata'
            } );
        } )
        .catch( err => {
            console.log( err );
            next( err );
        } );
    };

    vehicleController.getTickets = ( req, res, next ) => {
        const authHeader = req.get( 'Authorization' );

        return fetchData( authHeader, driverService().getPontuacao )
        .then( data => {
            const resp = data.map( a => {
                return {
                    description: a.desctipoinfracao,
                    classification: a.descclassificacaoinfracao,
                    points: +a.pontuacao,
                    place: a.localinfracao,
                    district: a.municipioinfracao,
                    date: a.datahora
                };
            } );

            return res.json( resp );
        } )
        .catch( err => {
            console.log( err );
            next( err );
        } );
    };

    function fetchData( authHeader, detranMethod ) {
        return authorization().fetchUserInfo( authHeader )
        .then( userInfo => {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            return detranMethod( userInfo.cpf );
        } );
    }

    return vehicleController;
};

