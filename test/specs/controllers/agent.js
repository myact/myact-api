var request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    retrieveToken = require( '../../db/helpers/retrieve-token' );

describe( 'agent controller', function() {
    describe( 'store', function() {
        before(function( done ) {
            retrieveToken( this.root, function( err, token ) {
                this.token = token;
                done( err );
            }.bind( this ) );
        });

        before(function( done ) {
            request
                .post( this.root + '/provider' )
                .set( 'Authorization', 'JWT ' + this.token )
                .send({
                    name: 'myact-provider-rss',
                    package: {}
                })
                .end(function( err, res ) {
                    this.providerId = res.body.provider.id;
                    done( err );
                }.bind( this ) );
        });

        it( 'should immediately trigger an agent run', function( done ) {
            var now = Date.now();

            request
                .post( this.root + '/agent' )
                .set( 'Authorization', 'JWT ' + this.token )
                .send({
                    provider_id: this.providerId,
                    config: { url: 'http://www.andrewduthie.com/feed.xml' }
                })
                .end(function( err, res ) {
                    request
                        .get( this.root + '/agent/' + res.body.agent.id )
                        .set( 'Authorization', 'JWT ' + this.token )
                        .end(function( err, res ) {
                            expect( new Date( res.body.agent.last_run ) ).to.be.at.least( now );

                            done( err );
                        });
                }.bind( this ) );
        });
    });
});