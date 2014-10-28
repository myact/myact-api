var BaseModel = require( './base' ),
    randomString = require( '../helpers/random-string' );

var Agent = module.exports = BaseModel.extend({
    tableName: 'agents',

    json: [ 'config' ],

    fillable: [ 'name', 'provider_id', 'secret', 'config' ],

    rules: {
        provider_id: [ 'required' ]
    },

    hasTimestamps: [ 'created_at' ],

    defaults: function() {
        this.set( 'secret', randomString( 64 ) );
        this.set( 'config', {} );
    },

    provider: function() {
        var Provider = require( './provider' );
        return this.belongsTo( Provider );
    }
});