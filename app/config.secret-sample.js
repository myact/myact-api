module.exports = {
    db: {
        client: 'sqlite3',
        connection: {
            filename: __dirname + '/db/data/mon-api.sqlite'
        }
    }
};