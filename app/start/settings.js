var _ = require( 'lodash' ),
    Setting = require( '../models/setting' );

var interpret = function( value ) {
    if ( /^\d+$/.test( value ) ) {
        return parseInt( value, 10 ) || value;
    }

    return value;
};

module.exports = function( app ) {
    return Setting.where({ provider_id: null }).fetchAll().then(function( collection ) {
        var models = collection ? collection.models : [],
            settings = _.reduce( models, function( memo, setting ) {
                var value = setting.get( 'value' );
                memo[ setting.get( 'name' ) ] = interpret( value );
                return memo;
            }, {});

        app.set( 'settings', settings );
    });
};