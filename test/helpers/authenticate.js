var Promise = require( 'bluebird' ),
    request = Promise.promisifyAll( require( 'superagent' ) );

module.exports = function( root, done ) {
    return request
        .post( root + '/login' )
        .send({ email: 'admin@example.com', password: 'not-so-secret' })
        .endAsync()
        .then(function( res ) {
            done( null, res.body.token );
        });
};