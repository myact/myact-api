var Setting = require( '../models/setting' ),
    BaseController = require( './base' );

var SettingController = module.exports = function() {
    BaseController.apply( this, arguments );
};

SettingController.prototype = Object.create( BaseController.prototype );

SettingController.prototype.Model = Setting;