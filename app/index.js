var express = require( 'express' );

var Myact = module.exports = function( options ) {
    this.app = express();
    this.options = options;
};

Myact.prototype.start = function() {
    var app = this.app;

    require( './start/db' )( app );

    return require( './start/settings' )( app, this.options ).then(function() {
        require( './start/express' ).upstream( app );
        require( './start/routes' )( app );
        require( './start/providers' )( app );
        require( './start/express' ).downstream( app );

        return app;
    });
};