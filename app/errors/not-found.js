var BaseError = require( './base' );

var NotFoundError = module.exports = function( message ) {
    BaseError.call( this, message );
};

NotFoundError.prototype = Object.create( BaseError.prototype );

NotFoundError.prototype.code = 404;

NotFoundError.prototype.name = 'not_found';