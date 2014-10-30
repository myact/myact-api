module.exports = function( app ) {
    [
        'activity',
        'provider',
        'setting',
        'agent',
        'user',
        'login'
    ].forEach(function( module ) {
        var Controller = require( '../controllers/' + module );
        app.use( '/' + module, new Controller( app, module ).router );
    });
};