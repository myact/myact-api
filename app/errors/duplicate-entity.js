var BaseError = require( './base' );

var DuplicateEntityError = module.exports = function( message ) {
    if ( 'string' !== typeof message ) {
        message = 'An error occurred while saving. The specified entity already exists.'
    }

    BaseError.call( this, message );
};

DuplicateEntityError.prototype = Object.create( BaseError.prototype );

DuplicateEntityError.prototype.code = 409;

DuplicateEntityError.prototype.name = 'duplicate_entity';