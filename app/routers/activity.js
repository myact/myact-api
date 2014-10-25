var _ = require( 'lodash' ),
    Promise = require( 'bluebird' ),
    Activity = require( '../models/activity' ),
    DuplicateEntityError = require( '../errors/duplicate-entity' ),
    BaseRouter = require( './base' ),
    interpretAgent = require( '../middlewares/interpret-agent' );

var ActivityRouter = module.exports = function() {
    var routes = _.cloneDeep( BaseRouter.defaultRoutes );
    [ 'store', 'update', 'patch', 'delete' ].forEach(function( route ) {
        routes[ route ].middlewares.unshift( interpretAgent );
    });
    this.routes = routes;

    BaseRouter.apply( this, arguments );
};

ActivityRouter.prototype = Object.create( BaseRouter.prototype );

ActivityRouter.prototype.Model = Activity;

// @TODO: Index by provider_id