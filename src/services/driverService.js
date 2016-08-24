const sql = require( 'mssql' );
const detran = require( '../config/detran' );

const SP_DADOS_CNH = detran.sit.SPDadosCNH;
const SP_INFRACOES = detran.sit.SPInfracoes;
const config = detran.sit.sqlConnectionConfig;

module.exports = () => {
    const sitService = new Object();
    const connection = new sql.Connection( config );

    sitService.getDadosGeraisCNH = function( cpf, cnh, cedula ) {
        return connection.connect()
            .then( conn => {
                return conn.query`${SP_DADOS_CNH} ${cpf}`;
            } )
            .then( recordsets => {
                connection.close();
                return recordsets[ 0 ];
            } )
            .catch( err => {
                console.error( err );
                connection.close();
                return Promise.reject( err );
            } );
    };

    sitService.getInfracoes = function( cpf, cnh, cedula ) {
        return connection.connect()
            .then( conn => {
                return conn.query`${SP_INFRACOES} ${cpf}`;
            } )
            .then( recordsets => {
                connection.close();
                return recordsets;
            } )
            .catch( err => {
                console.error( err );
                connection.close();
                return Promise.reject( err );
            } );
    };

    return sitService;
};
