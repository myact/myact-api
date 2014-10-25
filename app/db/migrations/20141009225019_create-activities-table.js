exports.up = function( knex, Promise ) {
    return knex.schema.createTable( 'activities', function( table ) {
        table.increments( 'id' ).primary();
        table.string( 'key' ).unique().notNullable();
        table.integer( 'agent_id', 10 ).unsigned().notNullable().references( 'id' ).inTable( 'agents' );
        table.json( 'data' ).notNullable();
        table.dateTime( 'created_at' ).notNullable().index();
    });
};

exports.down = function( knex, Promise ) {
    return knex.schema.dropTable( 'activities' );
};
