var request = require( 'superagent' ),
    expect = require( 'chai' ).expect;

describe( 'base controller', function() {
    before(function( done ) {
        var BaseController = require( '../../../app/controllers/base' ),
            Setting = require( '../../../app/models/setting' );

        // Create a new dummy controller
        var controller = new BaseController( this.app, 'setting' );
        controller.Model = Setting;
        this.app.use( '/fake', controller.router );

        // Since we've added to the middleware stack, we'll need to add a new error handler too
        this.app.use( require( '../../../app/middlewares/error-responder' ) );

        done();
    });

    describe( 'index', function() {
        it( 'should respond with a list of resources', function( done ) {
            request
                .get( this.root + '/fake' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.settings ).to.be.instanceof( Array );

                    done();
                });
        });
    });

    describe( 'show', function() {
        before(function( done ) {
            request
                .post( this.root + '/fake' )
                .send({ name: 'test-show', value: 'ok' })
                .end(function() {
                    done();
                });
        });

        it( 'should respond with not found if resource doesn\'t exist', function( done ) {
            request
                .get( this.root + '/fake/non-existent-resource' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 404 );
                    expect( res.body.code ).to.equal( 404 );
                    expect( res.body.type ).to.equal( 'not_found' );
                    expect( res.body.message ).to.equal ( 'The requested resource does not exist' );

                    done();
                });
        });

        it( 'should respond with resource if it exists', function( done ) {
            request
                .get( this.root + '/fake/test-show' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.setting ).to.be.an( 'object' );
                    expect( res.body.setting.value ).to.equal( 'ok' );

                    done();
                });
        });
    });

    describe( 'store', function() {
        it( 'should respond with malformed request error if not sent required values', function( done ) {
            request
                .post( this.root + '/fake' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 400 );
                    expect( res.body.type ).to.equal( 'invalid_request' );
                    expect( res.body.message ).to.equal( 'The request was malformed and could not be interpreted' );

                    done();
                });
        });

        it( 'should respond with conflict if a primary key violation occurs', function( done ) {
            var url = this.root + '/fake';

            request
                .post( url )
                .send({ name: 'test-store-duplicate', value: 'ok' })
                .end(function() {
                    request
                        .post( url )
                        .send({ name: 'test-store-duplicate', value: 'ok' })
                        .end(function( err, res ) {
                            expect( err ).to.be.null;
                            expect( res.status ).to.equal( 409 );
                            expect( res.body.type ).to.equal( 'duplicate_entity' );
                            expect( res.body.message ).to.equal( 'An error occurred while saving. The specified entity already exists.' );

                            done();
                        });
                });
        });

        it( 'should respond with model if save was successful', function( done ) {
            request
                .post( this.root + '/fake' )
                .send({ name: 'test-store', value: 'ok' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.setting ).to.be.an( 'object' );
                    expect( res.body.setting.value ).to.equal( 'ok' );

                    done();
                });
        });
    });

    describe( 'update', function() {
        before(function( done ) {
            request
                .post( this.root + '/fake' )
                .send({ name: 'test-update', value: 'ok' })
                .end(function() {
                    done();
                });
        });

        it( 'should respond with not found if resource doesn\'t exist', function( done ) {
            request
                .put( this.root + '/fake/non-existent-resource' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 404 );
                    expect( res.body.code ).to.equal( 404 );
                    expect( res.body.type ).to.equal( 'not_found' );
                    expect( res.body.message ).to.equal ( 'The requested resource does not exist' );

                    done();
                });
        });

        it( 'should respond with the updated model', function( done ) {
            request
                .put( this.root + '/fake/test-update' )
                .send({ value: 'still ok' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.setting ).to.be.an( 'object' );
                    expect( res.body.setting.value ).to.equal( 'still ok' );

                    done();
                });
        });

        it( 'should remove any properties that aren\'t included in the request', function( done ) {
            request
                .put( this.root + '/fake/test-update' )
                .send({})
                .end(function( err, res ) {
                    expect( err ).to.be.null;

                    // We check for 400 since value is a required parameter
                    // Ideally, we should also test for non-required parameter saving
                    expect( res.status ).to.equal( 400 );
                    expect( res.body.type ).to.equal( 'invalid_request' );
                    expect( res.body.message ).to.equal( 'The request was malformed and could not be interpreted' );

                    done();
                });
        });
    });

    describe( 'patch', function() {
        before(function( done ) {
            request
                .post( this.root + '/fake' )
                .send({ name: 'test-patch', value: 'ok' })
                .end(function() {
                    done();
                });
        });

        it( 'should respond with not found if resource doesn\'t exist', function( done ) {
            request
                .patch( this.root + '/fake/non-existent-resource' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 404 );
                    expect( res.body.code ).to.equal( 404 );
                    expect( res.body.type ).to.equal( 'not_found' );
                    expect( res.body.message ).to.equal ( 'The requested resource does not exist' );

                    done();
                });
        });

        it( 'should respond with the updated model', function( done ) {
            request
                .patch( this.root + '/fake/test-patch' )
                .send({ value: 'still ok' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.setting ).to.be.an( 'object' );
                    expect( res.body.setting.value ).to.equal( 'still ok' );

                    done();
                });
        });

        it( 'shouldn\'t remove any properties that aren\'t included in the request', function( done ) {
            request
                .patch( this.root + '/fake/test-patch' )
                .send({})
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body.setting ).to.be.an( 'object' );
                    expect( res.body.setting.value ).to.equal( 'still ok' );

                    done();
                });
        });

    });

    describe( 'delete', function() {
        before(function( done ) {
            request
                .post( this.root + '/fake' )
                .send({ name: 'test-delete', value: 'ok' })
                .end(function() {
                    done();
                });
        });

        it( 'should respond with not found if resource doesn\'t exist', function( done ) {
            request
                .del( this.root + '/fake/non-existent-resource' )
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 404 );
                    expect( res.body.code ).to.equal( 404 );
                    expect( res.body.type ).to.equal( 'not_found' );
                    expect( res.body.message ).to.equal ( 'The requested resource does not exist' );

                    done();
                });
        });

        it( 'should respond with empty response if successful', function( done ) {
            request
                .del( this.root + '/fake/test-delete' )
                .send({ value: 'still ok' })
                .end(function( err, res ) {
                    expect( err ).to.be.null;
                    expect( res.status ).to.equal( 200 );
                    expect( res.body ).to.be.empty;

                    done();
                });
        });
    });
});