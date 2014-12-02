var Myact = require( './app' ),
    http = require( 'http' );

new Myact().start().then(function( app ) {
    var port = process.env.PORT || 3000;
    http.createServer( app ).listen( port );
    console.log( 'Listening on port %d', port );
});
