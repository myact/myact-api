var BaseError = require( './base' );

var NotAuthorizedError = module.exports = function( message ) {
    BaseError.call( this, message );
};

NotAuthorizedError.prototype = Object.create( BaseError.prototype );

NotAuthorizedError.prototype.code = 401;

NotAuthorizedError.prototype.name = 'unauthorized';