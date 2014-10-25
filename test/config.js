module.exports = {
    db: {
        client: 'sqlite3',
        connection: { filename: __dirname + '/../app/db/data/mon-api-test.sqlite' },
        migrations: { directory: __dirname + '/../app/db/migrations' }
    }
};