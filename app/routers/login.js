var jwt = require( 'jwt-simple' ),
    Promise = require( 'bluebird' ),
    bcrypt = Promise.promisifyAll( require( 'bcrypt' ) ),
    BaseRouter = require( './base' ),
    User = require( '../models/user' ),
    NotAuthorizedError = require( '../errors/not-authorized' ),
    config = require( '../config' );

var LoginRouter = module.exports = function() {
    this.routes = { store: BaseRouter.defaultRoutes.store };

    BaseRouter.apply( this, arguments );
};

LoginRouter.prototype = Object.create( BaseRouter.prototype );

LoginRouter.prototype.Model = User;

LoginRouter.prototype.store = function( body, options ) {
    var user = BaseRouter.prototype.show.call( this, null, { id: body.email });

    return user.then(function( user ) {
        return bcrypt.compareAsync( body.password, user.get( 'password' ) );
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
                exp: expires
            }, config.auth.jwtSecretKey ),
            expires: expires,
            user: user.value().toJSON()
        };
    });
};