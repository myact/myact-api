require( '../../start/db' )();

var Provider = require( '../../models/provider' ),
    Agent = require( '../../models/agent' );

exports.seed = function( knex, Promise ) {
    return new Provider().save({
        name: 'myact-provider-rss',
        package: require( '../../../node_modules/myact-provider-rss/package.json' )
    }).then(function( provider ) {
        return new Agent({
            name: 'Andrew Duthie RSS',
            provider_id: provider.id,
            config: {
                url: 'http://www.andrewduthie.com/feed.xml'
            }
        }).save();
    });
};