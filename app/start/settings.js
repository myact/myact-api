var _ = require( 'lodash' ),
    Setting = require( '../models/setting' );

module.exports = function( app, options ) {
    return Setting.where({ provider_id: null }).fetch().then(function( collection ) {
        var models = collection ? collection.models : [],
            settings = _.reduce( models, function( memo, setting ) {
                if ( ! ( setting.get( 'name' ) in memo ) ) {
                    memo[ setting.get( 'name' ) ] = setting.get( 'value' );
                }

                return memo;
            }, options || {});

        app.set( 'settings', settings );
    });
};