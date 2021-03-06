var Knex = require( 'knex' ),
    Bookshelf = require( 'bookshelf' ),
    config = require( '../config' );

module.exports = function() {
    var knex = Knex.knex = Knex( config.db ),
        bookshelf = Bookshelf.bookshelf = Bookshelf( knex );

    bookshelf.plugin( 'visibility' );
};