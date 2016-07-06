const key = process.env.DETRAN_KEY || '';
const url = process.env.DETRAN_SERVICE_URL || 'https://renach2.es.gov.br/WebServices/PortalCidadao/PortalCidadao.asmx';

module.exports = {
    service_url: url,
    service_key: key
};
