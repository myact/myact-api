exports.up = function( knex, Promise ) {
    return knex.schema.createTable( 'users', function( table ) {
        table.string( 'email' ).primary();
        table.string( 'password' ).notNullable().defaultTo( '' );
        table.dateTime( 'created_at' ).notNullable();
    });
};

exports.down = function( knex, Promise ) {
    return knex.schema.dropTable( 'users' );
};
