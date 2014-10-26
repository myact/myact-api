var BaseModel = require( './base' );

var Setting = module.exports = BaseModel.extend({
    tableName: 'settings',

    idAttribute: 'name',

    rules: {
        name: [ 'required' ],
        value: [ 'required' ]
    }
});