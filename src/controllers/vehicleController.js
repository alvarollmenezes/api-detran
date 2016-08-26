const vehicleService = require( '../services/vehicleService' );

module.exports = () => {
    var vehicleController = new Object();

    vehicleController.getData = ( req, res, next ) => {
        const plate = req.query.plate;
        const renavam = req.query.renavam;

        return vehicleService().getDadosVeiculo( plate, renavam )
        .then( data => {
            return res.json( {
                model: data.MARCA.trim(),
                color: data.COR.trim()
            } );
        } )
        .catch( err => {
            next( err );
        } );
    };

    vehicleController.getTickets = ( req, res, next ) => {
        const plate = req.query.plate;
        const renavam = req.query.renavam;

        return vehicleService().getInfracoes( plate, renavam )
        .then( data => {
            const resp = data.map( a => {
                return {
                    description: a.DescricaoInfracao.trim(),
                    classification: a.Natureza.trim(),
                    points: +a.Pontos,
                    place: a.LocalInfracao.trim(),
                    district: a.NomeCidadeInfracao.trim(),
                    date: a.DataHoraAutuacao
                };
            } )
            .sort( ( a, b ) => b.date.getTime() - a.date.getTime() );

            return res.json( resp );
        } )
        .catch( err => {
            next( err );
        } );
    };

    return vehicleController;
};

