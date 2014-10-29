var Promise = require( 'bluebird' ),
    request = Promise.promisifyAll( require( 'superagent' ) ),
    _ = require( 'lodash' );

var resources = {
    defaults: {
        provider: { name: 'myact-provider-rss', package: {} },
        agent: { config: { url: 'http://www.andrewduthie.com/feed.xml' }, secret: 'not-so-secret' }
    },
    depends: {
        agent: [ 'provider' ]
    },
    cached: {}
};

var fetch = module.exports = function( resource, root, token, properties ) {
    if ( 'undefined' === typeof properties ) {
        properties = {};
    }

    // Return early if we already have a cached resource
    if ( 'undefined' !== typeof resources.cached[ resource ] ) {
        return Promise.resolve( resources.cached[ resource ] );
    }

    // First resolve dependencies
    var dependsResolved;
    if ( 'undefined' !== typeof resources.depends[ resource ] ) {
        dependsResolved = Promise.all( resources.depends[ resource ].map(function( depend ) {
            return fetch( depend, root, token, properties );
        }) );
    } else {
        dependsResolved = Promise.resolve();
    }

    return dependsResolved.spread(function() {
        // Inject depended resource as foreign key ID
        var args = _.toArray( arguments ) || [];
        args.forEach(function( dependResource, i ) {
            if ( 'number' === typeof dependResource.id ) {
                properties[ resources.depends[ resource ][ i ] + '_id' ] = dependResource.id;
            }
        });

        // Extend defaults with custom properties
        properties = _.extend({}, resources.defaults[ resource ], properties );

        // If we've made it this far, create a new resource
        return request
            .post( root + '/' + resource )
            .set( 'Authorization', 'JWT ' + token )
            .send( properties )
            .endAsync()
            .then(function( res ) {
                return resources.cached[ resource ] = res.body[ resource ];
            });
    });
};