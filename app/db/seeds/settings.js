require( '../../start/db' )();

var Setting = require( '../../models/setting' );

exports.seed = function( knex, Promise ) {
    return new Setting().save({
        name: 'defaultInterval',
        value: 60000
    });
};