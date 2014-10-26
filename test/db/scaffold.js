var Knex = require( 'knex' ),
    Promise = require( 'bluebird' ),
    fs = Promise.promisifyAll( require( 'fs' ) );

var TestScaffolder = module.exports = function( options ) {
    this.options = options;
    this.knex = Knex( options.db );
};

TestScaffolder.prototype.scaffold = function() {
    return this.createTestDatabase()
        .then( this.runTestDatabaseMigrations.bind( this ) )
        .then( this.runTestDatabaseSeeds.bind( this ) );
};

TestScaffolder.prototype.createTestDatabase = function() {
    var options = this.options;

    return fs.existsAsync( options.db.connection.filename ).then(function() {
        // Successful resolution indicates file doesn't exist
        return Promise.resolve();
    }, function() {
        // Delete existing test database
        return fs.unlinkAsync( options.db.connection.filename );
    }).then(function() {
        // Re-create test database as empty file
        return fs.openAsync( options.db.connection.filename, 'w' );
    });
};

TestScaffolder.prototype.runTestDatabaseMigrations = function() {
    return this.knex.migrate.latest( this.options.db.migrations );
};

TestScaffolder.prototype.runTestDatabaseSeeds = function() {
    return this.knex.seed.run( this.options.db.seeds );
};