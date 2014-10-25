exports.up = function( knex, Promise ) {
    return knex.schema.createTable( 'providers', function( table ) {
        table.increments( 'id' ).primary();
        table.string( 'name' ).notNullable().unique();
        table.json( 'package' ).notNullable();
        table.dateTime( 'created_at' ).notNullable();
    });
};

exports.down = function( knex, Promise ) {
    return knex.schema.dropTable( 'providers' );
};
