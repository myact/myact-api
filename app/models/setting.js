var BaseModel = require( './base' );

var Setting = module.exports = BaseModel.extend({
    tableName: 'settings',

    idAttribute: 'name'

    // @TODO: provider_id for global provider settings
});