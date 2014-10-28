var expect = require( 'chai' ).expect,
    randomString = require( '../../../app/helpers/random-string' );

describe( 'random string', function() {
    it( 'should default to 32 characters long', function() {
        var value = randomString();
        expect( value ).to.be.a( 'string' );
        expect( value.length ).to.equal( 32 );
    });

    it( 'should accept a length parameter', function() {
        var value = randomString( 40 );
        expect( value ).to.be.a( 'string' );
        expect( value.length ).to.equal( 40 );
    });

    it( 'should be reasonably random', function() {
        var values = {};

        for ( var i = 0; i < 20; i++ ) {
            values[ randomString() ] = true;
        }

        expect( Object.keys( values ).length ).to.equal( 20 );
    });
});