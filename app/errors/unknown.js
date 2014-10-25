var BaseError = require( './base' );

var UnknownError = module.exports = function( message ) {
    BaseError.call( this, message );
};

UnknownError.prototype = Object.create( BaseError.prototype );

UnknownError.prototype.code = 500;

UnknownError.prototype.name = 'unknown_error';