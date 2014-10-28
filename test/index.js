var Myact = require( '../app/' ),
    TestScaffolder = require( './db/scaffold' ),
    options = require( './db/config' );

describe( 'myact-api', function() {
    before(function( done ) {
        new TestScaffolder( options ).scaffold()
            .then(function() {
                return new Myact( options ).start();
            })
            .then(function( app ) {
                this.app = app;
                this.server = app.listen( 0 );
                this.address = this.server.address();
                this.root = 'http://' + this.address.address + ':' + this.address.port;

                done();
            }.bind( this ) );
    });

    require( './specs/controllers/base' );
    require( './specs/controllers/login' );
    require( './specs/controllers/setting' );
    require( './specs/controllers/agent' );
    require( './specs/helpers/random-string' );
});