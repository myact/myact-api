module.exports = {
    db: {
        client: 'sqlite3',
        connection: { filename: __dirname + '/data/mon-api-test.sqlite' },
        migrations: { directory: 'app/db/migrations' },
        seeds: { directory: 'test/db/seeds' }
    }
};