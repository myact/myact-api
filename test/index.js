var Knex = require( 'knex' ),
    Promise = require( 'bluebird' ),
    fs = Promise.promisifyAll( require( 'fs' ) ),
    Myact = require( '../app/' ),
    config = require( './config' );

describe( 'myact-api', function() {
    before(function( done ) {
        // Delete existing test database
        fs.unlinkAsync( config.db.connection.filename ).then(function() {
            // Re-create test database as empty file
            return fs.openAsync( config.db.connection.filename, 'w' );
        }).then( function() {
            // Run database migrations
            return Knex( config.db ).migrate.latest( config.db.migrations );
        }).then(function() {
            // Start app
            return new Myact( config ).start();
        }).then(function( app ) {
            // Begin tests
            this.server = app;
            done();
        }.bind( this ) );
    });

    require( './specs/activity' );
});