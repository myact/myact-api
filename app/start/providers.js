var Agent = require( '../models/agent' ),
    AgentDaemon = require( '../helpers/agent-daemon' );

module.exports = function( app ) {
    var daemon = new AgentDaemon({
        interval: app.get( 'settings' ).defaultInterval
    });

    Agent.fetchAll({
        withRelated: 'provider'
    }).then(function( collection ) {
        return collection.models;
    }).each(function( agent ) {
        daemon.start( agent );
    });
};