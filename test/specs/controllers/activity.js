var request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    retrieveToken = require( '../../db/helpers/retrieve-token' );

describe( 'activity controller', function() {
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
                    this.provider = res.body.provider;

                    done( err );
                }.bind( this ) );
        });

        before(function( done ) {
            request
                .post( this.root + '/agent' )
                .set( 'Authorization', 'JWT ' + this.token )
                .send({
                    provider_id: this.provider.id,
                    config: { url: 'http://www.andrewduthie.com/feed.xml' },
                    secret: 'not-so-secret'
                })
                .end(function( err, res ) {
                    this.agent = res.body.agent;

                    done( err );
                }.bind( this ) );
        });

        it( 'shouldn\'t allow unauthenticated requests', function( done ) {
            request
                .post( this.root + '/activity' )
                .send({
                    agent_id: this.agent.id,
                    key: '1',
                    data: {}
                })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 401 );
                    expect( res.body.type ).to.equal( 'unauthorized' );
                    expect( res.body.message ).to.equal( 'Authorization header is missing' );

                    done();
                });
        });

        it( 'shouldn\'t allow an unauthenticated request if an incorrect secret is provided as a query parameter', function( done ) {
            var activity = { agent_id: this.agent.id, key: '1', data: {} };

            request
                .post( this.root + '/activity?secret=not-so-secret-and-not-so-correct' )
                .send( activity )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 401 );
                    expect( res.body.type ).to.equal( 'unauthorized' );
                    expect( res.body.message ).to.equal( 'The secret parameter was invalid' );

                    done();
                });
        });

        it( 'should allow an unauthenticated request if a correct secret is provided as a query parameter', function( done ) {
            var activity = { agent_id: this.agent.id, key: '1', data: {} };

            request
                .post( this.root + '/activity?secret=not-so-secret' )
                .send( activity )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    for ( var prop in activity ) {
                        expect( res.body.activity[ prop ] ).to.eql( activity[ prop ] );
                    }

                    done();
                });
        });

        it( 'should interpret the agent ID based on the secret provided', function( done ) {
            var activity = { key: '2', data: {} };

            request
                .post( this.root + '/activity?secret=not-so-secret' )
                .send( activity )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.activity.agent_id ).to.equal( this.agent.id )

                    done();
                }.bind( this ) );
        });
    });
});