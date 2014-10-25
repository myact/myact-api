var User = require( '../models/user' )
    BaseRouter = require( './base' );

var UserRouter = module.exports = function() {
    BaseRouter.apply( this, arguments );
};

UserRouter.prototype = Object.create( BaseRouter.prototype );

UserRouter.prototype.Model = User;

UserRouter.prototype.authorize = true;