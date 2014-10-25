var Agent = require( '../models/agent' ),
    NotAuthorizedError = require( '../errors/not-authorized' );

module.exports = function( req, res, next ) {
    if ( 'string' !== typeof req.body.secret ) {
        require( './auth' )( req, res, next );
    } else {
        new Agent()
            .where({ secret: req.query.secret })
            .fetch({ require: true })
            .then(function( agent ) {
                req.body.agent_id = agent.id;
                next();
            })
            .catch(function() {
                next( new NotAuthorizedError( 'The `secret` parameter was invalid' ) );
            });
    }
};