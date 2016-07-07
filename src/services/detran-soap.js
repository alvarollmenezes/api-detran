const rp = require( 'request-promise' );
const parseString = require( 'xml2js' ).parseString;

const detran = require( '../config/detran' );

module.exports = () => {
    const detranService = new Object();

    detranService.getDadosGeraisCNH = function( cpf ) {
        const soapBody = `<GetDadosGeraisCNH xmlns="http://renach2.es.gov.br/PortalCidadao">
                          	  <cpf>${cpf}</cpf>
                          </GetDadosGeraisCNH>`;

        const soapAction = '"http://renach2.es.gov.br/PortalCidadao/GetDadosGeraisCNH"';

        return getJsonResponseBody( soapBody, soapAction )
        .then( json => {
            const data = json.GetDadosGeraisCNHResponse[ 0 ].GetDadosGeraisCNHResult[ 0 ];

            return {
                SituacaoCNH: data.SituacaoCNH[ 0 ],
                MotivoBloqueio: data.MotivoBloqueio[ 0 ],
                DataVencimento: data.DataVencimento[ 0 ],
                ExistemInfracoesPontuadas: data.ExistemInfracoesPontuadas[ 0 ],
                ExisteProcessoHabilitacaoAberto: data.ExisteProcessoHabilitacaoAberto[ 0 ],
                ExisteProcessoAdmAberto: data.ExisteProcessoAdmAberto[ 0 ]
            };

        } );
    };

    detranService.getPontuacao = function( cpf ) {
        const soapBody = `<GetPontuacao xmlns="http://renach2.es.gov.br/PortalCidadao">
                              <cpf>${cpf}</cpf>
                          </GetPontuacao>`;

        const soapAction = '"http://renach2.es.gov.br/PortalCidadao/GetPontuacao"';

        return getJsonResponseBody( soapBody, soapAction )
        .then( json => {
            const element = json.GetPontuacaoResponse[ 0 ].GetPontuacaoResult[ 0 ][ 'diffgr:diffgram' ][ 0 ].DocumentElement;

            if ( !element || element.length <= 0 ) {
                return [];
            }

            const data = element[ 0 ].dtInfracoes;

            return data.map( a => {
                return {
                    desctipoinfracao: a.desctipoinfracao[ 0 ],
                    descclassificacaoinfracao: a.descclassificacaoinfracao[ 0 ],
                    pontuacao: a.pontuacao[ 0 ],
                    localinfracao: a.localinfracao[ 0 ],
                    municipioinfracao: a.municipioinfracao[ 0 ],
                    datahora: a.datahora[ 0 ],
                    placa: a.placa[ 0 ],
                    Advertencia: a.Advertencia[ 0 ]
                };
            } );
        } );
    };

    detranService.getProcessoAdministrativo = function( cpf ) {
        const soapBody = `<GetProcessoAdministrativo xmlns="http://renach2.es.gov.br/PortalCidadao">
                              <cpf>${cpf}</cpf>
                          </GetProcessoAdministrativo>`;

        const soapAction = '"http://renach2.es.gov.br/PortalCidadao/GetProcessoAdministrativo"';

        return getJsonResponseBody( soapBody, soapAction );
    };

    detranService.getProcessoHabilitacao = function( cpf ) {
        const soapBody = `<GetProcessoHabilitacao xmlns="http://renach2.es.gov.br/PortalCidadao">
                              <cpf>${cpf}</cpf>
                          </GetProcessoHabilitacao>`;

        const soapAction = '"http://renach2.es.gov.br/PortalCidadao/GetProcessoHabilitacao"';

        return getJsonResponseBody( soapBody, soapAction );
    };

    return detranService;
};

function getJsonResponseBody( soapBody, soapAction ) {
    return getResponse( soapBody, soapAction )
    .then( xml => {
        let resp = '';

        parseString( xml, ( err, res ) => {
            if ( err ) {
                console.log( err );
                return err.message;
            }

            resp = res[ 'soap:Envelope' ][ 'soap:Body' ][ 0 ];
        } );

        return resp;
    } );
}

function getResponse( soapBody, soapAction ) {
    var options = {
        method: 'POST',
        uri: detran.service_url,
        body: getBody( soapBody ),
        headers: {
            'User-Agent': 'api-espm-prodest',
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': soapAction
        }
    };

    return rp( options );
}

function getBody( soapBody ) {
    return `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
                ${getHeader()}
                ${getSoapBody( soapBody )}
            </soap:Envelope>`;
}

function getHeader() {
    return `<soap:Header>
                <PortalCidadaoSoapHeader xmlns="http://renach2.es.gov.br/PortalCidadao">
                <ChavePortalCidadao>${detran.service_key}</ChavePortalCidadao>
                </PortalCidadaoSoapHeader>
            </soap:Header>`;
}

function getSoapBody( soapBody ) {
    return `<soap:Body>
                ${soapBody}
            </soap:Body>`;
}
