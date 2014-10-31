var jwt = require( 'jwt-simple' ),
    Promise = require( 'bluebird' ),
    bcrypt = Promise.promisifyAll( require( 'bcrypt' ) ),
    BaseController = require( './base' ),
    User = require( '../models/user' ),
    NotAuthorizedError = require( '../errors/not-authorized' ),
    config = require( '../config' );

var LoginController = module.exports = function() {
    BaseController.apply( this, arguments );
};

LoginController.prototype = Object.create( BaseController.prototype );

LoginController.prototype.getRoutes = function() {
    var routes = BaseController.prototype.getRoutes.apply( this, arguments );

    return {
        store: routes.store,
        verify: { method: 'POST', path: '/verify', middlewares: [] }
    };
};

LoginController.prototype.Model = User;

LoginController.prototype.store = function( body, options ) {
    var user = BaseController.prototype.show.call( this, null, { id: body.email }).error( new Function() );

    return user.then(function( res ) {
        if ( 'undefined' === typeof res || 'undefined' === typeof res.login ) {
            return false;
        }

        return bcrypt.compareAsync( body.password, res.login.get( 'password' ) );
    }).then(function( match ) {
        // No match indicates a failed login attempt
        if ( ! match ) {
            return Promise.reject( new NotAuthorizedError( 'Incorrect email and password combination' ) );
        }

        // Calculate expiration
        var expires = new Date();
        expires.setDate( expires.getDate() + config.auth.tokenDurationDays );

        // Return token
        return {
            token: jwt.encode({
                iss: user.value().login.id,
                exp: expires.valueOf()
            }, config.auth.jwtSecretKey ),
            expires: expires.valueOf(),
            user: user.value().login.toJSON()
        };
    });
};

LoginController.prototype.verify = function( body, options ) {
    var exp;

    return Promise.resolve( body.token )
        .then(function( token ) {
            return jwt.decode( token, config.auth.jwtSecretKey );
        })
        .then(function( decoded ) {
            exp = decoded.exp;
            if ( decoded.exp <= Date.now() ) throw new NotAuthorizedError( 'Token is expired' );
            return new User({ email: decoded.iss }).fetch();
        })
        .then(function( user ) {
            return {
                token: body.token,
                expires: exp,
                user: user
            };
        })
        .catch(function( err ) {
            if ( ! ( err instanceof NotAuthorizedError ) ) {
                err = new NotAuthorizedError();
            }

            throw err;
        });
};