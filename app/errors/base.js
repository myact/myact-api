var BaseError = module.exports = function( message ) {
    Error.call( this, message );
    this.message = message;
    this.type = this.name;
}

BaseError.prototype = Object.create( Error.prototype );