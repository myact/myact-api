var _ = require( 'lodash' ),
    Promise = require( 'bluebird' ),
    Activity = require( '../models/activity' ),
    DuplicateEntityError = require( '../errors/duplicate-entity' ),
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
        args = arguments;

    return new Activity()
        .where({ key: body.key })
        .fetch()
        .then(function( model ) {
            var method = ( null === model ) ? 'store' : 'update';

            if ( 'update' === method ) {
                options.id = model.id;
            }

            return BaseController.prototype[ method ].apply( self, args );
        });
};