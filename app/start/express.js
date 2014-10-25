var BaseError = require( '../errors/base' ),
    UnknownError = require( '../errors/unknown' ),
    InvalidRequestError = require( '../errors/invalid-request' );

module.exports.upstream = function( app ) {
    app.use( require( 'compression' )() );
    app.use( require( 'cors' )() );
    app.use( require( 'body-parser' ).json() );
};

module.exports.downstream = function( app ) {
    app.use(function( error, req, res, next ) {
        if ( error instanceof SyntaxError ) {
            error = new InvalidRequestError();
        }

        if ( ! ( error instanceof BaseError ) ) {
            console.error( error.stack );
            error = new UnknownError();
        }

        res.status( error.code ).send({
            code: error.code,
            type: error.type,
            message: error.message
        });
    });
}