var Provider = require( '../models/provider' ),
    BaseRouter = require( './base' );

var ProviderRouter = module.exports = function() {
    BaseRouter.apply( this, arguments );
};

ProviderRouter.prototype = Object.create( BaseRouter.prototype );

ProviderRouter.prototype.Model = Provider;