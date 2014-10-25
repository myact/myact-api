var Promise = require( 'bluebird' ),
    Checkit = require( 'checkit' ),
    express = require( 'express' ),
    NotFoundError = require( '../errors/not-found' ),
    InvalidRequestError = require( '../errors/invalid-request' ),
    bookshelf = require( 'bookshelf' ).bookshelf,
    http = require( '../helpers/promisify-http' );

var BaseRouter = module.exports = function() {
    if ( 'undefined' === typeof this.routes ) {
        this.routes = BaseRouter.defaultRoutes;
    }

    this.assignRouteHandlers();
};

BaseRouter.prototype.Model = bookshelf.Model;

BaseRouter.defaultRoutes = {
    index: { method: 'GET', path: '/', middlewares: [] },
    show: { method: 'GET', path: '/:id', middlewares: [] },
    store: { method: 'POST', path: '/', middlewares: [] },
    update: { method: 'PUT', path: '/:id', middlewares: [] },
    patch: { method: 'PATCH', path: '/:id', middlewares: [] },
    delete: { method: 'DELETE', path: '/:id', middlewares: [] }
};

BaseRouter.prototype.assignRouteHandlers = function() {
    var _this = this;

    this.dispatcher = express.Router();

    for ( var route in this.routes ) {
        var routeOptions = this.routes[ route ],
            method = routeOptions.method.toLowerCase();

        var middlewares = routeOptions.middlewares.map(function( middleware ) {
            return middleware.bind( _this );
        });

        middlewares.push( http( this[ route ].bind( this ) ) );
        this.dispatcher[ method ].apply( this.dispatcher, [ routeOptions.path ].concat( middlewares ) );
    }
};

BaseRouter.prototype.index = function() {
    // @TODO: Filtering (skip, take)
    // @TODO: Return response as property array (i.e. { users: [] } )

    return this.Model.fetchAll();
};

BaseRouter.prototype.show = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError( 'The requested resource does not exist' ) );
        });
};

BaseRouter.prototype.store = function( body, options ) {
    return new this.Model()
        .save( body )
        .catch( Checkit.Error, function() {
            return Promise.reject( new InvalidRequestError( 'The request syntax was malformed' ) );
        });
};

BaseRouter.prototype.update = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .then(function( resource ) {
            return resource.save( body );
        })
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError( 'The requested resource does not exist' ) );
        });
};

BaseRouter.prototype.patch = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .then(function( resource ) {
            return resource.save( body, { patch: true });
        })
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError( 'The requested resource does not exist' ) );
        });
};

BaseRouter.prototype.delete = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .then(function( resource ) {
            return resource.destroy();
        })
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError( 'The requested resource does not exist' ) );
        });
};