var Checkit = require( 'checkit' ),
    _ = require( 'lodash' ),
    Promise = require( 'bluebird' ),
    bookshelf = require( 'bookshelf' ).bookshelf,
    DuplicateEntityError = require( '../errors/duplicate-entity' );

var BaseModel = module.exports = bookshelf.Model.extend({
    json: [],

    hidden: [],

    fillable: null,

    guarded: null,

    rules: {},

    uniques: [],

    initialize: function() {
        this.on( 'saving', this.validate, this );
    },

    validate: function( model, attrs, options ) {
        return this.validateUniques().then(function() {
            if ( ! options.force ) {
                this.removeNonFillable();
            }

            if ( 'insert' === options.method ) {
                return Checkit( this.rules ).run( this.attributes );
            }
        }.bind( this ) );
    },

    validateUniques: function() {
        var changedUniques = this.uniques.filter(function( unique ) {
            return this.hasChanged( unique );
        }.bind( this ) );

        if ( 0 === changedUniques.length ) {
            return Promise.resolve();
        }

        return new this.constructor().query(function( qb ) {
            for ( var u = 0, ul = changedUniques.length; u < ul; u++ ) {
                var unique = changedUniques[ u ],
                    comparator = ( 0 === u ) ? 'where' : 'orWhere';

                qb[ comparator ]( unique, '=', this.attributes[ unique ] );
            }
        }.bind( this ) ).fetch().then(function( model ) {
            if ( null !== model ) {
                return Promise.reject( new DuplicateEntityError() );
            }
        });
    },

    parse: function( attrs ) {
        attrs = this.parseJson( attrs );
        return attrs;
    },

    format: function( attrs ) {
        attrs = this.formatJson( attrs );
        return attrs;
    },

    parseJson: function( attrs ) {
        this.json.forEach(function( attr ) {
            if ( 'string' === typeof attrs[ attr ] ) {
                attrs[ attr ] = JSON.parse( attrs[ attr ] );
            }
        });

        return attrs;
    },

    formatJson: function( attrs ) {
        this.json.forEach(function( attr ) {
            if ( 'object' === typeof attrs[ attr ] ) {
                attrs[ attr ] = JSON.stringify( attrs[ attr ] );
            }
        });

        return attrs;
    },

    removeNonFillable: function( attrs ) {
        if ( this.fillable instanceof Array ) {
            this.attributes = _.pick( this.attributes, this.fillable.concat( this.hasTimestamps || [] ) );
        }

        if ( this.guarded instanceof Array ) {
            this.attributes = _.omit( this.attributes, this.guarded );
        }
    }
});