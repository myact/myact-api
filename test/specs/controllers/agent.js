var request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    helpers = require( '../../helpers/' );

describe( 'agent controller', function() {
    describe( 'store', function() {
        var token, provider;

        before(function( done ) {
            helpers.authenticate( this.root ).then(function( _token ) {
                token = _token;
                done();
            });
        });

        before(function( done ) {
            helpers.resource( 'provider', this.root, token ).then(function( _provider ) {
                provider = _provider;
                done();
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