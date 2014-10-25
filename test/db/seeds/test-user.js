var User = require( '../../../app/models/user' );

exports.seed = function( knex, Promise ) {
    return new User().save({
        email: 'admin@example.com',
        password: 'not-so-secret'
    });
};