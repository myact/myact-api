var bcrypt = require( 'bcrypt' ),
    BaseModel = require( './base' ),
    config = require( '../config' );

var User = module.exports = BaseModel.extend({
    tableName: 'users',

    idAttribute: 'email',

    fillable: [ 'email', 'password' ],

    rules: {
        email: [ 'required', 'email' ],
        password: [ 'required' ]
    },

    uniques: [ 'email' ],

    hidden: [ 'password' ],

    hasTimestamps: [ 'created_at' ],

    format: function( attrs ) {
        if ( this.hasChanged( 'password' ) ) {
            var salt = bcrypt.genSaltSync( config.passwordHashFactor );
            attrs.password = bcrypt.hashSync( attrs.password, salt );
        }

        return attrs;
    }
});