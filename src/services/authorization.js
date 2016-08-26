const rp = require( 'request-promise' );

const acessoCidadao = require( '../config/acesso-cidadao' );

module.exports = () => {
    const authorizationService = new Object();

    authorizationService.fetchUserInfo = function( authorizationHeader ) {
        /**
         * Exemplo do objeto user retornado pelo IdentityServer do Acesso Cidadão
         * {
         *      celularValidado: "False"
         *      cpf: "05490226781"
         *      dateofbirth: "13/07/1984"
         *      emailaddress: "vizeke@gmail.com"
         *      homephone: "27 3636 7224"
         *      mobilephone: ""
         *      name: "Vinícius Salomão Barbosa"
         *      nomemae: "Dalgiza Salomão"
         *      nomepai: "Jair Barbosa"
         *      sid: "9239"
         * }
         */
        var options = {
            method: 'GET',
            uri: acessoCidadao.userInfoUrl,
            headers: {
                'User-Agent': 'api-espm-prodest',
                'Authorization': authorizationHeader
            }
        };

        return rp( options )
        .then( resp => {
            return JSON.parse( resp );
        } );
    };

    return authorizationService;
};
