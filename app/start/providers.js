var Agent = require( '../models/agent' ),
    AgentDaemon = require( '../helpers/agent-daemon' ),
    pubsub = require( '../pubsub' );

module.exports = function( app ) {
    var daemon = new AgentDaemon({
        interval: app.get( 'settings' ).defaultInterval
    });

    pubsub.on( 'boot-agent', function( agent ) {
        daemon.start( agent );
    });

    Agent.fetchAll({
        withRelated: 'provider'
    }).then(function( collection ) {
        return collection.models;
    }).each(function( agent ) {
        pubsub.emit( 'boot-agent', agent );
    });
};