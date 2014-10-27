var request = require( 'superagent' ),
    expect = require( 'chai' ).expect;

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
});