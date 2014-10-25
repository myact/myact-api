var Knex = require( 'knex' ),
    Promise = require( 'bluebird' ),
    request = Promise.promisifyAll( require( 'supertest' ) ),
    fs = Promise.promisifyAll( require( 'fs' ) ),
    Myact = require( '../app/' ),
    config = require( './config' ),
    knex = Knex( config.db );

describe( 'myact-api', function() {
    before(function( done ) {
        // Delete existing test database
        fs.unlinkAsync( config.db.connection.filename ).then(function() {
            // Re-create test database as empty file
            return fs.openAsync( config.db.connection.filename, 'w' );
        }).then(function() {
            // Run database migrations
            return knex.migrate.latest( config.db.migrations );
        }).then(function( user ) {
            // Start app
            return new Myact( config ).start();
        }).then(function( app ) {
            this.server = app;

            // Create test user
            return knex.seed.run( config.db.seeds );
        }.bind( this ) ).then(function() {
            return request( this.server )
                .post( '/login' )
                .send({ email: 'admin@example.com', password: 'not-so-secret' })
                .endAsync();
        }.bind( this ) ).then(function( res ) {
            this.token = res.body.token;

            // Begin tests
            done();
        }.bind( this ) );
    });

    require( './specs/activity' );
});