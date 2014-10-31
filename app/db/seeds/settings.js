exports.seed = function( knex, Promise ) {
    return knex( 'settings' ).insert([
        { name: 'defaultInterval', value: 60000 },
        { name: 'resultsPerPage', value: 20 }
    ]);
};