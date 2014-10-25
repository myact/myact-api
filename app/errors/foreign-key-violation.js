var BaseError = require( './base' );

var ForeignKeyViolationError = module.exports = function( message ) {
    BaseError.call( this, message );
};

ForeignKeyViolationError.prototype = Object.create( BaseError.prototype );

ForeignKeyViolationError.prototype.code = 400;

ForeignKeyViolationError.prototype.name = 'missing_relation';