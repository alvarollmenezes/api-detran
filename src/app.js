const config = require( './config/app' );
if ( config.env === 'production' ) {
    require( 'newrelic' );
}
const apiMiddleware = require( 'node-mw-api-prodest' ).middleware;
const express = require( 'express' );

let app = express();

app.use( apiMiddleware( {
    compress: true,
    cors: true,
    authentication: {
        jwtPublicKey: config.jwtPublicKey
    },
    limit: {
        max: 300,
        duration: 10 * 60 * 1000,
        perSecond: false,
        redisUrl: config.redisUrl,
        apiId: 'api-detran'
    }
} ) );

app.use( apiMiddleware( {
    limit: {
        max: 10,
        duration: 10 * 1000,
        perSecond: false,
        redisUrl: config.redisUrl,
        apiId: 'api-detran-2'
    }
} ) );

// load our routes
require( './routes/driver' )( app );
require( './routes/vehicle' )( app );

app.use( apiMiddleware( {
    error: {
        notFound: true,
        debug: config.env === 'development'
    }
} ) );

let pathApp = express();

let path = config.path;
pathApp.use( path, app );

module.exports = pathApp;
