module.exports.upstream = function( app ) {
    app.use( require( 'compression' )() );
    app.use( require( 'cors' )() );
    app.use( require( 'body-parser' ).json() );
    app.use( require( 'method-override' )() );
};

module.exports.downstream = function( app ) {
    app.use( require( '../middlewares/error-responder' ) );
}