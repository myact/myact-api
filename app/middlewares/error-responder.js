var BaseError = require( '../errors/base' ),
    UnknownError = require( '../errors/unknown' ),
    InvalidRequestError = require( '../errors/invalid-request' );

module.exports = function( error, req, res, next ) {
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
        message: error.message,
        extra: error.extra
    });
};