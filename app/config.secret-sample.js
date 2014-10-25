module.exports = {
    jwtKey: '<replace this with a very secret key>',
    db: {
        client: 'sqlite3',
        connection: {
            filename: __dirname + '/db/data/mon-api.sqlite'
        }
    }
};