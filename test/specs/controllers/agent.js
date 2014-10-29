var request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    retrieveToken = require( '../../db/helpers/retrieve-token' );

describe( 'agent controller', function() {
    describe( 'store', function() {
        var token, provider;

        before(function( done ) {
            retrieveToken( this.root, function( err, auth ) {
                token = auth;
                done( err );
            });
        });

        before(function( done ) {
            request
                .post( this.root + '/provider' )
                .set( 'Authorization', 'JWT ' + token )
                .send({
                    name: 'myact-provider-rss',
                    package: {}
                })
                .end(function( err, res ) {
                    provider = res.body.provider;
                    done( err );
                });
        });

        it( 'should immediately trigger an agent run', function( done ) {
            var root = this.root,
                now = Date.now();

            request
                .post( root + '/agent' )
                .set( 'Authorization', 'JWT ' + token )
                .send({
                    provider_id: provider.id,
                    config: { url: 'http://www.andrewduthie.com/feed.xml' }
                })
                .end(function( err, res ) {
                    request
                        .get( root + '/agent/' + res.body.agent.id )
                        .set( 'Authorization', 'JWT ' + token )
                        .end(function( err, res ) {
                            expect( new Date( res.body.agent.last_run ) ).to.be.at.least( now );

                            done( err );
                        });
                });
        });
    });
});