var _ = require( 'lodash' ),
    Promise = require( 'bluebird' ),
    Activity = require( '../models/activity' ),
    DuplicateEntityError = require( '../errors/duplicate-entity' ),
    BaseRouter = require( './base' ),
    interpretAgent = require( '../middlewares/interpret-agent' );

var ActivityRouter = module.exports = function() {
    BaseRouter.apply( this, arguments );
};

ActivityRouter.prototype = Object.create( BaseRouter.prototype );

ActivityRouter.prototype.getRoutes = function() {
    var routes = BaseRouter.prototype.getRoutes.apply( this, arguments );

    [ 'store', 'update', 'patch', 'delete' ].forEach(function( route ) {
        routes[ route ].middlewares.unshift( interpretAgent );
    });

    return routes;
};

ActivityRouter.prototype.Model = Activity;