var Promise = require( 'bluebird' ),
    request = Promise.promisifyAll( require( 'supertest' ) );

module.exports = function() {
    return request( this.app )
        .post( '/login' )
        .send({ email: 'admin@example.com', password: 'not-so-secret' })
        .endAsync()
        .then(function( res ) {
            return res.body.token;
        });
};