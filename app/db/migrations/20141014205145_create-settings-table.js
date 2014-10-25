exports.up = function( knex, Promise ) {
    return knex.schema.createTable( 'settings', function( table ) {
        table.string( 'name' ).primary();
        table.string( 'value' ).notNullable().defaultTo( '' );
        table.integer( 'provider_id', 10 ).unsigned().references( 'id' ).inTable( 'providers' );
    });
};

exports.down = function( knex, Promise ) {
    return knex.schema.dropTable( 'settings' );
};
