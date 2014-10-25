var secrets = require( './config.secret' );

module.exports = {
    auth: {
        jwtSecretKey: secrets.jwtKey,
        tokenDurationDays: 30
    },
    db: {
        client: secrets.db.client,
        connection: secrets.db.connection
    },
    passwordHashFactor: 10
};