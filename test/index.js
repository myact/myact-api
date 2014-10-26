var Myact = require( '../app/' ),
    TestScaffolder = require( './db/scaffold' ),
    options = require( './db/config' );

describe( 'myact-api', function() {
    before(function( done ) {
        new TestScaffolder( options ).scaffold()
            .then( new Myact( options ).start )
            .then(function( app ) {
                this.app = app;
                done();
            }.bind( this ) );
    });

    require( './specs/activity' );
});