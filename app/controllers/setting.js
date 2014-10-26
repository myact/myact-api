var _ = require( 'lodash' ),
    Setting = require( '../models/setting' ),
    BaseController = require( './base' );

var SettingController = module.exports = function() {
    BaseController.apply( this, arguments );
};

SettingController.prototype = Object.create( BaseController.prototype );

SettingController.prototype.Model = Setting;

SettingController.prototype.authorize = true;

SettingController.prototype.index = function() {
    var collection = BaseController.prototype.index.call( this, arguments );

    return collection.then(function( res ) {
        var models = res.settings ? res.settings.models : [],
            settings = _.reduce( models, function( memo, setting ) {
                memo[ setting.get( 'name' ) ] = setting.get( 'value' );
                return memo;
            }, {});

        return settings;
    });
};