const _identityServerUrl = process.env.IDENTITY_SERVER_URL || 'https://acessocidadao.es.gov.br/is/';
const _userInfoUrl = process.env.USER_INFO_URL || `${_identityServerUrl}connect/userinfo`;

module.exports = {
    identityServerUrl: _identityServerUrl,
    userInfoUrl: _userInfoUrl,
    getDadosScope: process.env.GET_DADOS_SCOPE || 'SCOPE'
};
