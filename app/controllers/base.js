var Promise = require( 'bluebird' ),
    Checkit = require( 'checkit' ),
    express = require( 'express' ),
    _ = require( 'lodash' ),
    NotFoundError = require( '../errors/not-found' ),
    InvalidRequestError = require( '../errors/invalid-request' ),
    bookshelf = require( 'bookshelf' ).bookshelf,
    http = require( '../helpers/promisify-http' ),
    auth = require( '../middlewares/auth' );

var BaseController = module.exports = function() {
    this.routes = this.getRoutes();
    this.injectAuthMiddleware();
    this.assignRouteHandlers();
};

BaseController.prototype.getRoutes = function() {
    return {
        index: { method: 'GET', path: '/', middlewares: [] },
        show: { method: 'GET', path: '/:id', middlewares: [] },
        store: { method: 'POST', path: '/', middlewares: [] },
        update: { method: 'PUT', path: '/:id', middlewares: [] },
        patch: { method: 'PATCH', path: '/:id', middlewares: [] },
        delete: { method: 'DELETE', path: '/:id', middlewares: [] }
    };
};

BaseController.prototype.Model = bookshelf.Model;

BaseController.prototype.authorize = false;

BaseController.prototype.injectAuthMiddleware = function() {
    if ( true === this.authorize ) {
        this.authorize = Object.keys( this.routes );
    }

    if ( this.authorize instanceof Array ) {
        var routes = this.routes;
        this.authorize.forEach(function( route ) {
            routes[ route ].middlewares.unshift( auth );
        });
    }
};

BaseController.prototype.assignRouteHandlers = function() {
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

BaseController.prototype.index = function() {
    return this.Model.fetchAll();
};

BaseController.prototype.show = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError( 'The requested resource does not exist' ) );
        });
};

BaseController.prototype.store = function( body, options ) {
    return new this.Model()
        .save( body )
        .catch( Checkit.Error, function() {
            return Promise.reject( new InvalidRequestError( 'The request syntax was malformed' ) );
        });
};

BaseController.prototype.update = function( body, options ) {
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

BaseController.prototype.patch = function( body, options ) {
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

BaseController.prototype.delete = function( body, options ) {
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