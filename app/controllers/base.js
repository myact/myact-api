var Promise = require( 'bluebird' ),
    Checkit = require( 'checkit' ),
    express = require( 'express' ),
    _ = require( 'lodash' ),
    NotFoundError = require( '../errors/not-found' ),
    InvalidRequestError = require( '../errors/invalid-request' ),
    bookshelf = require( 'bookshelf' ).bookshelf,
    http = require( '../helpers/promisify-http' ),
    auth = require( '../middlewares/auth' );

var BaseController = module.exports = function( module ) {
    this.module = module;
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

    this.router = express.Router();

    for ( var route in this.routes ) {
        var routeOptions = this.routes[ route ],
            method = routeOptions.method.toLowerCase();

        routeOptions.middlewares.push( http( this[ route ].bind( this ) ) );
        this.router[ method ].apply( this.router, [ routeOptions.path ].concat( routeOptions.middlewares ) );
    }
};

BaseController.prototype.generateResponse = function( response ) {
    var responseKey;
    if ( response instanceof bookshelf.Collection ) {
        responseKey = this.Model.prototype.tableName;
    } else {
        responseKey = this.module;
    }

    return _.object([ [ responseKey, response ] ])
};

BaseController.prototype.index = function() {
    return this.Model.fetchAll().then( this.generateResponse.bind( this ) );
};

BaseController.prototype.show = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .then( this.generateResponse.bind( this ) )
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError() );
        });
};

BaseController.prototype.store = function( body, options ) {
    return new this.Model()
        .save( body )
        .then( this.generateResponse.bind( this ) )
        .catch( Checkit.Error, function() {
            return Promise.reject( new InvalidRequestError() );
        });
};

BaseController.prototype.update = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .then(function( resource ) {
            var toUnset = _.omit( resource.attributes, Object.keys( body ), model.idAttribute );

            return resource
                .set( body )
                .set( toUnset, { unset: true })
                .save();
        })
        .then( this.generateResponse.bind( this ) )
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError() );
        })
        .catch( Checkit.Error, function() {
            return Promise.reject( new InvalidRequestError() );
        });
};

BaseController.prototype.patch = function( body, options ) {
    var model = new this.Model();

    return model
        .query( 'where', model.idAttribute, '=', options.id )
        .fetch({ require: true })
        .then(function( resource ) {
            return resource.save( body );
        })
        .then( this.generateResponse.bind( this ) )
        .catch( this.Model.NotFoundError, function() {
            return Promise.reject( new NotFoundError() );
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
            return Promise.reject( new NotFoundError() );
        });
};