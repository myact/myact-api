var BaseError = require( './base' );

var NotAuthorizedError = module.exports = function( message ) {
    if ( 'string' !== typeof message ) {
        message = 'You are not authorized to view the requested resource';
    }

    BaseError.call( this, message );
};

NotAuthorizedError.prototype = Object.create( BaseError.prototype );

NotAuthorizedError.prototype.code = 401;

NotAuthorizedError.prototype.name = 'unauthorized';