var Myact = require( '../app/' ),
    TestScaffolder = require( './db/scaffold' ),
    options = require( './db/config' );

describe( 'myact-api', function() {
    before(function( done ) {
        new TestScaffolder( options ).scaffold()
            .then( new Myact( options ).start )
            .then(function( app ) {
                this.app = app;
                this.server = app.listen( 0 );
                this.address = this.server.address();
                this.root = 'http://' + this.address.address + ':' + this.address.port;

                done();
            }.bind( this ) );
    });

    require( './specs/activity' );
});