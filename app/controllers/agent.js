var Agent = require( '../models/agent' ),
    BaseRouter = require( './base' ),
    agentDaemon = require( '../helpers/agent-daemon' );

var AgentRouter = module.exports = function() {
    BaseRouter.apply( this, arguments );
};

AgentRouter.prototype = Object.create( BaseRouter.prototype );

AgentRouter.prototype.Model = Agent;

AgentRouter.prototype.store = function( body, options ) {
    return BaseRouter.prototype.store.apply( this, arguments )
        .then(function( provider ) {
            agentDaemon.start( provider );

            return provider;
        });
};