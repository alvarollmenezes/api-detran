const sql = require( 'mssql' );
const detran = require( '../config/detran' );

const SP_DADOS_VEICULO = detran.detranNet.SPDadosVeiculo;
const SP_INFRACOES = detran.detranNet.SPInfracoes;
const config = detran.detranNet.sqlConnectionConfig;

module.exports = () => {
    const sitService = new Object();
    const connection = new sql.Connection( config );

    sitService.getDadosVeiculo = function( plate, renavam ) {
        return connection.connect()
            .then( conn => {
                return new sql.Request( conn )
                    .input( 'placa', sql.VarChar( 10 ), plate )
                    .input( 'renavam', sql.BigInt, renavam )
                    .execute( SP_DADOS_VEICULO );
            } )
            .then( recordsets => {
                connection.close();
                return recordsets[ 0 ][ 0 ];
            } )
            .catch( err => {
                connection.close();
                return Promise.reject( err );
            } );
    };

    sitService.getInfracoes = function( plate, renavam ) {
        return connection.connect()
            .then( conn => {
                return new sql.Request( conn )
                    .input( 'placa', sql.VarChar( 10 ), plate )
                    .input( 'renavam', sql.BigInt, renavam )
                    .execute( SP_INFRACOES );
            } )
            .then( recordsets => {
                connection.close();
                return recordsets[ 0 ];
            } )
            .catch( err => {
                connection.close();
                return Promise.reject( err );
            } );
    };

    return sitService;
};
