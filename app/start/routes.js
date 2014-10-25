module.exports = function( app ) {
    [
        'activity',
        'provider',
        'setting',
        'agent',
        'user',
        'login'
    ].forEach(function( module ) {
        var Router = require( '../routers/' + module );
        app.use( '/' + module, new Router( app ).dispatcher );
    });
};