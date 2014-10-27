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
    return { store: routes.store };
};

LoginController.prototype.Model = User;

LoginController.prototype.store = function( body, options ) {
    var user = BaseController.prototype.show.call( this, null, { id: body.email }).error( new Function() );

    return user.then(function( user ) {
        if ( 'undefined' === typeof user ) {
            return false;
        }

        return bcrypt.compareAsync( body.password, user.login.get( 'password' ) );
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
                iss: user.value().id,
                exp: expires.valueOf()
            }, config.auth.jwtSecretKey ),
            expires: expires.valueOf(),
            user: user.value().login.toJSON()
        };
    });
};