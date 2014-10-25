var Agent = require( '../models/agent' ),
    NotAuthorizedError = require( '../errors/not-authorized' );

module.exports = function( req, res, next ) {
    if ( 'string' !== typeof req.body.secret ) {
        throw new NotAuthorizedError( 'The `secret` parameter was missing from the request' );
    }

    new Agent()
        .where({ secret: req.body.secret })
        .fetch({ require: true })
        .then(function( agent ) {
            req.body.agent_id = agent.id;
            next();
        })
        .catch(function() {
            next( new NotAuthorizedError( 'The `secret` parameter was invalid' ) );
        });
};