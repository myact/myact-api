var Agent = require( '../models/agent' ),
    BaseController = require( './base' ),
    pubsub = require( '../pubsub' );

var AgentController = module.exports = function() {
    BaseController.apply( this, arguments );
};


AgentController.prototype = Object.create( BaseController.prototype );

AgentController.prototype.Model = Agent;

AgentController.prototype.authorize = [ 'store', 'update', 'patch', 'delete' ];

AgentController.prototype.store = function( body, options ) {
    return BaseController.prototype.store.apply( this, arguments )
        .then(function( res ) {
            return res.agent.load([ 'provider' ]);
        })
        .then(function( agent ) {
            pubsub.emit( 'boot-agent', agent );
            return agent;
        })
        .then( BaseController.prototype.generateResponse.bind( this ) );
};