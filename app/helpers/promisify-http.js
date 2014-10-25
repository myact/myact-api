var _ = require( 'lodash' ),
    Promise = require( 'bluebird' ),
    BaseError = require( '../errors/base' ),
    UnknownError = require( '../errors/unknown' );

module.exports = function( handler ) {
    return function( req, res, next ) {
        var object = req.body,
            options = _.extend({}, req.files, req.query, req.params );

        return handler( object, options )
            .then(function( result ) {
                res.send( result );
            })
            .catch(function( err ) {
                next( err );
            });
    };
};