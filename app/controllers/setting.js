var Setting = require( '../models/setting' ),
    BaseRouter = require( './base' );

var SettingRouter = module.exports = function() {
    BaseRouter.apply( this, arguments );
};

SettingRouter.prototype = Object.create( BaseRouter.prototype );

SettingRouter.prototype.Model = Setting;