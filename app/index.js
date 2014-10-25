var express = require( 'express' );

var Myact = module.exports = function( options ) {
    this.options = options;
};

Myact.prototype.start = function() {
    var app = express();

    require( './start/config' )( app, this.options );
    require( './start/db' )( app );

    return require( './start/settings' )( app ).then(function() {
        require( './start/express' ).upstream( app );
        require( './start/routes' )( app );
        require( './start/providers' )( app );
        require( './start/express' ).downstream( app );

        return app;
    });
};