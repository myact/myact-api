var Activity = require( '../models/activity' );

var AgentDaemon = module.exports = function( options ) {
    this.options = options;
};

AgentDaemon.prototype.intervals = {};

AgentDaemon.prototype.save = function( agent, item ) {
    item.agent_id = agent.id;

    new Activity()
        .where({ key: item.key })
        .fetch()
        .then(function( activity ) {
            // Only save activity if entry doesn't already exist
            if ( null === activity ) {
                new Activity( item ).save();
            }
        });
};

AgentDaemon.prototype.start = function( agent ) {
    var provider = agent.related( 'provider' ),
        ProviderHandler = require( provider.get( 'name' ) );

    // Start listening to events on handler
    var handler = new ProviderHandler({ agent: agent });
    handler.on( 'item', this.save.bind( this, agent ) );
    handler.invoke();

    // Schedule interval to repeat invocation
    if ( true === handler.interval ) handler.interval = this.options.interval;
    if ( 'number' === typeof handler.interval ) {
        clearInterval( this.intervals[ agent.id ] );
        this.intervals[ agent.id ] = setInterval( handler.invoke, handler.interval );
    }
};