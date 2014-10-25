var _ = require( 'lodash' ),
    Setting = require( '../models/setting' );

module.exports = function( app ) {
    return Setting.where({ provider_id: null }).fetch().then(function( collection ) {
        var models = collection ? collection.models : [],
            settings = _.reduce( models, function( memo, setting ) {
                memo[ setting.get( 'name' ) ] = setting.get( 'value' );
                return memo;
            }, {});

        app.set( 'settings', settings );
    });
};