var request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    helpers = require( '../../helpers/' );

describe( 'setting controller', function() {
    describe( 'index', function() {
        var token;

        before(function( done ) {
            helpers.authenticate( this.root, function( err, _token ) {
                token = _token;
                done( err );
            });
        });

        before(function( done ) {
            request
                .post( this.root + '/setting' )
                .set( 'Authorization', 'JWT ' + token )
                .send({ name: 'test', value: 'ok' })
                .end(function() {
                    done();
                });
        });

        it( 'should respond with unauthorized if unauthorized', function( done ) {
            request
                .get( this.root + '/setting' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 401 );

                    done();
                });
        });

        it( 'should respond with a set of key-value pairs', function( done ) {
            request
                .get( this.root + '/setting' )
                .set( 'Authorization', 'JWT ' + token )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body ).to.be.an( 'object' );
                    expect( res.body.test ).to.equal( 'ok' );

                    done();
                });
        });
    });
});