var Agent = require( '../models/agent' ),
    BaseController = require( './base' ),
    agentDaemon = require( '../helpers/agent-daemon' );

var AgentController = module.exports = function() {
    BaseController.apply( this, arguments );
};


AgentController.prototype = Object.create( BaseController.prototype );

AgentController.prototype.Model = Agent;

AgentController.prototype.store = function( body, options ) {
    return BaseController.prototype.store.apply( this, arguments )
        .then(function( provider ) {
            agentDaemon.start( provider );

            return provider;
        });
};