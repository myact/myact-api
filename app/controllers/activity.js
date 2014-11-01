var _ = require( 'lodash' ),
    Promise = require( 'bluebird' ),
    Checkit = require( 'checkit' ),
    Activity = require( '../models/activity' ),
    DuplicateEntityError = require( '../errors/duplicate-entity' ),
    CheckitValidationError = require( '../errors/checkit-validation' ),
    BaseController = require( './base' ),
    interpretAgent = require( '../middlewares/interpret-agent' );

var ActivityController = module.exports = function() {
    BaseController.apply( this, arguments );
};

ActivityController.prototype = Object.create( BaseController.prototype );

ActivityController.prototype.Model = Activity;

ActivityController.prototype.getRoutes = function() {
    var routes = BaseController.prototype.getRoutes.apply( this, arguments );

    [ 'store', 'update', 'patch', 'delete' ].forEach(function( route ) {
        routes[ route ].middlewares.unshift( interpretAgent );
    });

    return routes;
};

ActivityController.prototype.store = function( body, options ) {
    var self = this,
        args = arguments,
        model = new Activity();

    return model
        .where({ key: body.key })
        .fetch()
        .then(function( resource ) {
            if ( null === resource ) {
                return BaseController.prototype.store.apply( self, args );
            } else {
                var toUnset = _.omit( resource.attributes, Object.keys( body ), model.idAttribute );

                return resource
                    .set( toUnset, { unset: true })
                    .save( body, { method: 'update' })
                    .then( self.generateResponse.bind( self ) )
                    .catch( Checkit.Error, function( validation ) {
                        return Promise.reject( new CheckitValidationError( undefined, validation.errors ) );
                    });
            }
        });
};