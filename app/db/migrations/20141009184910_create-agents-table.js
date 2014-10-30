exports.up = function( knex, Promise ) {
    return knex.schema.createTable( 'agents', function( table ) {
        table.increments( 'id' ).primary();
        table.string( 'name' ).notNullable().defaultTo( '' );
        table.integer( 'provider_id', 10 ).unsigned().notNullable().references( 'id' ).inTable( 'providers' );
        table.string( 'secret' ).notNullable();
        table.json( 'config' ).notNullable();
        table.dateTime( 'created_at' ).notNullable();
        table.dateTime( 'last_run' );
    });
};

exports.down = function( knex, Promise ) {
    return knex.schema.dropTable( 'agents' );
};
