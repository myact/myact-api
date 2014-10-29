var request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    helpers = require( '../../helpers/' );

describe( 'login controller', function() {
    describe( 'store', function() {
        it( 'should respond with unauthorized if non-existent user', function( done ) {
            request
                .post( this.root + '/login' )
                .send({ email: 'non-existent-user@example.com', password: 'not-so-secret' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 401 );
                    expect( res.body.type ).to.equal( 'unauthorized' );
                    expect( res.body.message ).to.equal( 'Incorrect email and password combination' );

                    done();
                });
        });

        it( 'should respond with unauthorized if incorrect password', function( done ) {
            request
                .post( this.root + '/login' )
                .send({ email: 'admin@example.com', password: 'wrong-password' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 401 );
                    expect( res.body.type ).to.equal( 'unauthorized' );
                    expect( res.body.message ).to.equal( 'Incorrect email and password combination' );

                    done();
                });
        });

        it( 'should respond with token if correct username and password', function( done ) {
            request
                .post( this.root + '/login' )
                .send({ email: 'admin@example.com', password: 'not-so-secret' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.token ).to.be.a( 'string' );
                    expect( res.body.expires ).to.be.a( 'number' );
                    expect( res.body.user ).to.be.an( 'object' );
                    expect( res.body.user.email ).to.equal( 'admin@example.com' );
                    expect( res.body.user.created_at ).to.be.a( 'number' );
                    expect( res.body.user.password ).to.be.undefined;

                    done();
                });
        });
    });

    describe( 'verify', function() {
        var token;

        before(function( done ) {
            helpers.authenticate( this.root, function( err, _token ) {
                token = _token;
                done( err );
            });
        });

        it( 'should respond with unauthorized if token is invalid', function( done ) {
            request
                .post( this.root + '/login/verify' )
                .send({ token: 'invalid-token' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 401 );
                    expect( res.body.type ).to.equal( 'unauthorized' );
                    expect( res.body.message ).to.equal( 'You are not authorized to view the requested resource' );

                    done();
                });
        });

        it( 'should respond with expired if token is expired', function( done ) {
            var root = this.root,
                config = require( '../../../app/config' ),
                currentTokenDurationDays = config.auth.tokenDurationDays;

            config.auth.tokenDurationDays = -1;

            helpers.authenticate( root, function( err, token ) {
                request
                    .post( root + '/login/verify' )
                    .send({ token: token })
                    .end(function( err, res ) {
                        expect( err ).to.be.null;
                        expect( res.status ).to.equal( 401 );
                        expect( res.body.type ).to.equal( 'unauthorized' );
                        expect( res.body.message ).to.equal( 'Token is expired' );

                        config.auth.tokenDurationDays = currentTokenDurationDays;
                        done();
                    });
            });
        });

        it( 'should respond with token details if token is valid', function( done ) {
            request
                .post( this.root + '/login/verify' )
                .send({ token: token })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.token ).to.be.a( 'string' );
                    expect( res.body.expires ).to.be.a( 'number' );
                    expect( res.body.user ).to.be.an( 'object' );
                    expect( res.body.user.email ).to.equal( 'admin@example.com' );
                    expect( res.body.user.created_at ).to.be.a( 'number' );
                    expect( res.body.user.password ).to.be.undefined;

                    done();
                });
        });
    });
});