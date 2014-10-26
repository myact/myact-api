var request = require( 'supertest' ),
    expect = require( 'chai' ).expect;

describe( 'activity', function() {
    it( 'should respond with a list of activities', function( done ) {
        request( this.app )
            .get( '/activity' )
            .end(function( err, res ) {
                expect( err ).to.be.null;
                expect( res.status ).to.equal( 200 );
                expect( res.body.activities ).to.be.instanceof( Array );

                done();
            });
    });
})