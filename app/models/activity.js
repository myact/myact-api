var BaseModel = require( './base' );

var Activity = module.exports = BaseModel.extend({
    tableName: 'activities',

    hasTimestamps: [ 'created_at' ],

    json: [ 'data' ],

    fillable: [ 'key', 'agent_id', 'data' ],

    rules: {
        key: [ 'required' ],
        agent_id: [ 'required' ],
        data: [ 'required' ]
    },

    uniques: [ 'key' ],

    agent: function() {
        var Agent = require( './agent' );
        return this.belongsTo( Agent );
    }
});