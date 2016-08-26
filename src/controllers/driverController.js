const authorization = require( '../services/authorization' );
const driverService = require( '../services/driverService' );

module.exports = () => {
    var driverController = new Object();

    driverController.getData = ( req, res, next ) => {
        const authHeader = req.get( 'Authorization' );

        return fetchData( authHeader, driverService().getDadosGeraisCNH )
        .then( data => {
            return res.json( {
                status: +data.SituacaoCNH,
                blockMotive: data.MotivoBloqueio,
                expirationDate: data.DataVencimento,
                hasTickets: data.ExistemInfracoesPontuadas === 'true',
                acquiringLicense: data.ExisteProcessoHabilitacaoAberto === 'true',
                hasAdministrativeIssues: data.ExisteProcessoAdmAberto === 'true'
            } );
        } )
        .catch( err => {
            if ( err.number == 999999 ) {
                err.status = 404;
            }
            next( err );
        } );
    };

    driverController.getTickets = ( req, res, next ) => {
        const authHeader = req.get( 'Authorization' );

        return fetchData( authHeader, driverService().getInfracoes )
        .then( data => {
            const resp = data.map( a => {
                return {
                    description: a.desctipoinfracao,
                    classification: a.descclassificacaoinfracao,
                    points: +a.pontuacao,
                    place: a.localinfracao,
                    district: a.municipioinfracao,
                    date: a.datahora,
                    plate: a.placa,
                    warning: a.Advertencia === 'true'
                };
            } );

            return res.json( resp );
        } )
        .catch( err => {
            if ( err.number == 99999 ) {
                err.status = 404;
            }
            next( err );
        } );
    };

    function fetchData( authHeader, detranMethod ) {
        return authorization().fetchUserInfo( authHeader )
        .then( userInfo => {
            return detranMethod( userInfo.cpf, userInfo.cnhNumero, userInfo.cnhCedula );
        } );
    }

    return driverController;
};

