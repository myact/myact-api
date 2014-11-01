var Promise = require( 'bluebird' ),
    npm = Promise.promisifyAll( require( 'npm' ) ),
    _ = require( 'lodash' ),
    Provider = require( '../models/provider' ),
    BaseController = require( './base' ),
    InvalidRequestError = require( '../errors/invalid-request' );

var ProviderController = module.exports = function() {
    BaseController.apply( this, arguments );
};

ProviderController.prototype = Object.create( BaseController.prototype );

ProviderController.prototype.Model = Provider;

ProviderController.prototype.authorize = [ 'store', 'update', 'patch', 'delete' ];

ProviderController.prototype.store = function( body, options ) {
    var provider;

    return BaseController.prototype.store.apply( this, arguments )
        .then(function( _provider ) {
            provider = _provider;
            return npm.loadAsync({ loglevel: 'silent' });
        })
        .then(function() {
            if ( 'undefined' !== typeof options.async ) {
                return Promise.resolve();
            } else {
                return Promise.promisify( npm.commands.install )([ body.name ])
                    .then(function( results ) {
                        // Update package details
                        var location = _.first( _.keys( results[1] ) ),
                            pkg = require( __dirname + '/../../' + location + '/package.json' );

                        return provider.provider.save({ package: pkg });
                    });
            }
        })
        .then(function() {
            return provider;
        })
        .catch( Promise.OperationalError, function( err ) {
            if ( 'undefined' !== typeof provider ) {
                // Destroy provider record if one was created
                provider.provider.destroy();
            }

            return Promise.reject( new InvalidRequestError( 'The package could not be installed' ) );
        });
};