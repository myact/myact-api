var expect = require( 'chai' ).expect,
    http = require( 'http' ),
    request = require('supertest'),
    Myact = require( '../app/' );

describe( '/activity', function() {
    var server;

    before(function( done ) {
        new Myact().start().then(function( app ) {
            server = app;
            done();
        });
    });

    it( 'should respond with a list of activities', function( done ) {
        request( server )
            .get( '/activity' )
            .end(function( err, res ) {
                expect( err ).to.be.null;
                expect( res.status ).to.equal( 200 );
                expect( res.body ).to.be.instanceof( Array );

                done();
            });
    });
});