var secrets = require( './config.secret' );

module.exports = {
    db: {
        client: secrets.db.client,
        connection: secrets.db.connection
    },
    passwordHashFactor: 10
};