var User = require( '../models/user' )
    BaseController = require( './base' );

var UserController = module.exports = function() {
    BaseController.apply( this, arguments );
};

UserController.prototype = Object.create( BaseController.prototype );

UserController.prototype.Model = User;

UserController.prototype.authorize = true;