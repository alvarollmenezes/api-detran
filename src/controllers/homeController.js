const detran = require( '../services/detran-soap' );
const authorization = require( '../services/authorization' );

module.exports = () => {
    var homeController = new Object();

    // Needed because of PRODEST's SSL
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    homeController.getDriverData = ( req, res ) => {
        const authHeader = req.get( 'Authorization' );

        return fetchData( authHeader, detran().getDadosGeraisCNH )
        .then( data => {
            return res.json( {
                status: data.SituacaoCNH,
                blockMotive: data.MotivoBloqueio,
                expirationDate: data.DataVencimento,
                hasTickets: data.ExistemInfracoesPontuadas,
                acquiringLicense: data.ExisteProcessoHabilitacaoAberto,
                hasAdministrativeIssues: data.ExisteProcessoAdmAberto
            } );
        } )
        .catch( err => {
            console.log( err );
            res.send( err.message );
        } );
    };

    homeController.getTickets = ( req, res ) => {
        const authHeader = req.get( 'Authorization' );

        return fetchData( authHeader, detran().getPontuacao )
        .then( data => {
            const resp = data.map( a => {
                return {
                    description: a.desctipoinfracao,
                    classification: a.descclassificacaoinfracao,
                    points: a.pontuacao,
                    place: a.localinfracao,
                    district: a.municipioinfracao,
                    date: a.datahora,
                    plate: a.placa,
                    warning: a.Advertencia
                };
            } );

            return res.json( resp );
        } )
        .catch( err => {
            console.log( err );
            res.send( err.message );
        } );
    };

    function fetchData( authHeader, detranMethod ) {
        return authorization().fetchUserInfo( authHeader )
        .then( userInfo => {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

            return detranMethod( userInfo.cpf );
        } );
    }

    return homeController;
};

