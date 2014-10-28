exports.up = function( knex, Promise ) {
    return knex.schema.table( 'agents', function( table ) {
        table.dateTime( 'last_run' );
    });
};

exports.down = function( knex, Promise ) {
    return knex.schema.table( 'agents', function( table ) {
        table.dropColumn( 'last_run' );
    });
};