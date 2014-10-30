var expect = require( 'chai' ).expect,
    randomString = require( '../../../app/helpers/random-string' );

describe( 'settings start', function() {
    it( 'should save all Setting model into app as a hash', function() {
        var settings = this.app.get( 'settings' );
        expect( settings ).to.be.an( 'object' );
        expect( Object.keys( settings ).length ).to.be.at.least( 1 );
    });

    it( 'should automatically convert numeric values to numbers', function() {
        expect( this.app.get( 'settings' ).resultsPerPage ).to.be.a( 'number' );
    });
});