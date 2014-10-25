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

ActivityController.prototype.authorize = [ 'store', 'update', 'patch', 'delete' ];

ActivityController.prototype.getRoutes = function() {
    var routes = BaseController.prototype.getRoutes.apply( this, arguments );

    [ 'store', 'update', 'patch', 'delete' ].forEach(function( route ) {
        routes[ route ].middlewares.unshift( interpretAgent );
    });

    return routes;
};