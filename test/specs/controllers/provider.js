var Promise = require( 'bluebird' ),
    rimraf = Promise.promisify( require( 'rimraf' ) ),
    request = require( 'superagent' ),
    expect = require( 'chai' ).expect,
    helpers = require( '../../helpers/' );

describe( 'provider controller', function() {
    describe( 'store', function() {
        this.timeout( 10000 );

        var token, provider;

        before(function( done ) {
            helpers.authenticate( this.root ).then(function( _token ) {
                token = _token;
                done();
            });
        });

        before(function( done ) {
            Promise.all([
                rimraf( '../../../node_modules/npmlog' ),
                rimraf( '../../../node_modules/once' )
            ]).then(function() {
                done();
            });
        });

        it( 'should respond with invalid request for a non-existent package', function( done ) {
            request
                .post( this.root + '/provider' )
                .set( 'Authorization', 'JWT ' + token )
                .send({ name: 'a-package-name-that-hopefully-doesnt-exist' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 400 );
                    expect( res.body.type ).to.equal( 'invalid_request' );
                    expect( res.body.message ).to.equal( 'The package could not be installed' );

                    done();
                });
        });

        it( 'should install a valid package', function( done ) {
            request
                .post( this.root + '/provider' )
                .set( 'Authorization', 'JWT ' + token )
                .send({ name: 'npmlog' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.provider.name ).to.equal( 'npmlog' );
                    expect( res.body.provider.package.name ).to.equal( 'npmlog' );
                    var pkg = require( '../../../node_modules/npmlog/package.json' );
                    expect( pkg.name ).to.equal( 'npmlog' );

                    done();
                });
        });

        it( 'should allow asynchronous installation as an option', function( done ) {
            request
                .post( this.root + '/provider?async' )
                .set( 'Authorization', 'JWT ' + token )
                .send({ name: 'once' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.provider.name ).to.equal( 'once' );
                    expect( res.body.provider.package ).to.be.empty;

                    done();
                });
        });
    });
});