var _ = require( 'lodash' ),
    Setting = require( '../models/setting' ),
    BaseController = require( './base' ),
    resetSettings = require( '../start/settings' );

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

SettingController.prototype.reset = function( method, args ) {
    return BaseController.prototype[ method ].apply( this, args )
        .then(function( res ) {
            return resetSettings( this.app ).then(function() {
                return res;
            });
        }.bind( this ) );
};

SettingController.prototype.store = function() {
    return this.reset( 'store', arguments );
};

SettingController.prototype.update = function() {
    return this.reset( 'update', arguments );
};

SettingController.prototype.patch = function() {
    return this.reset( 'patch', arguments );
};

SettingController.prototype.delete = function() {
    return this.reset( 'delete', arguments );
};