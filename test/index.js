var Promise = require( 'bluebird' ),
    request = Promise.promisifyAll( require( 'supertest' ) ),
    Myact = require( '../app/' ),
    TestScaffolder = require( './db/scaffold' ),
    options = require( './db/config' );

describe( 'myact-api', function() {
    before(function( done ) {
        new TestScaffolder( options ).scaffold().then(function() {
            return new Myact( options ).start();
        }).then(function( app ) {
            this.app = app;
            return request( this.app )
                .post( '/login' )
                .send({ email: 'admin@example.com', password: 'not-so-secret' })
                .endAsync();
        }.bind( this ) ).then(function( res ) {
            this.token = res.body.token;
            done();
        }.bind( this ) )
    });

    require( './specs/activity' );
});