var Provider = require( '../models/provider' ),
    BaseController = require( './base' );

var ProviderController = module.exports = function() {
    BaseController.apply( this, arguments );
};

ProviderController.prototype = Object.create( BaseController.prototype );

ProviderController.prototype.Model = Provider;