var BaseModel = require( './base' );

var Provider = module.exports = BaseModel.extend({
    tableName: 'providers',

    hasTimestamps: [ 'created_at' ],

    json: [ 'package' ],

    fillable: [ 'name', 'package' ],

    rules: {
        name: [ 'required' ]
    },

    defaults: function() {
        this.set( 'package', {});
    },

    agents: function() {
        var Agent = require( './agent' );
        return this.hasMany( Agent );
    },

    activities: function() {
        var Activity = require( './activity' );
        return this.hasMany( Activity );
    }
});