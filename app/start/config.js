var _ = require( 'lodash' ),
    config = require( '../config' );

module.exports = function( app, options ) {
    _.extend( config, options );
};