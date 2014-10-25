var Promise = require( 'bluebird' ),
    jwt = require( 'jwt-simple' ),
    NotAuthorizedError = require( '../errors/not-authorized' ),
    User = require( '../models/user' ),
    config = require( '../config' );

module.exports = function( req, res, next ) {
    return Promise.resolve( req.get( 'Authorization' ) )
        .then(function( authHeader ) {
            var rxJwt = /^JWT\s+/;
            if ( ! rxJwt.test( authHeader ) ) throw new NotAuthorizedError( 'Authorization header is missing' );
            var token = authHeader.replace( rxJwt, '' );
            return jwt.decode( token, config.auth.jwtSecretKey );
        })
        .then(function( decoded ) {
            if ( decoded.exp <= Date.now() ) throw new NotAuthorizedError( 'Token is expired' );
            return new User({ email: decoded.iss }).fetch()
        })
        .then(function( user ) {
            req.user = user;
            next();
        })
        .catch(function( err ) {
            if ( ! ( err instanceof NotAuthorizedError ) ) {
                err = new NotAuthorizedError();
            }

            next( err );
        });
};