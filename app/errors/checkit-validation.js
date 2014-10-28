var InvalidRequestError = require( './invalid-request' );

var CheckitValidationError = module.exports = function( message, errors ) {
    this.extra = {
        validation: this.getValidationErrorsObject( errors )
    };

    InvalidRequestError.call( this, message );
};

CheckitValidationError.prototype = Object.create( InvalidRequestError.prototype );

CheckitValidationError.prototype.getValidationErrorsObject = function( errors ) {
    var extra = {};

    for ( var field in errors ) {
        extra[ field ] = errors[ field ].message;
    }

    return extra;
};