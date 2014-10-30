module.exports = {
    db: {
        client: 'sqlite3',
        connection: { filename: __dirname + '/data/mon-api-test.sqlite' },
        migrations: { directory: 'app/db/migrations' },
        appSeeds: { directory: 'app/db/seeds' },
        testSeeds: { directory: 'test/db/seeds' }
    }
};