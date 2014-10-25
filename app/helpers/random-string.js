var crypto = require( 'crypto' ),
    defaultCharacters = '!@$^&*()0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz';

module.exports = function( length, characters ) {
    if ( 'number' !== typeof length ) {
        length = 32;
    }

    if ( 'string' !== typeof characters ) {
        characters = defaultCharacters;
    }

    characters = characters.slice( 0, 256 );

    var randomBytes = crypto.randomBytes( length ),
        string = '';

    var cursor = 0;
    for ( var i = 0; i < length; i++ ) {
        cursor += randomBytes[ i ];
        string += characters[ cursor % characters.length ];
    };

    return string;
}