exports.seed = function( knex, Promise ) {
    return knex( 'users' ).insert({
        email: 'admin@example.com',
        password: '$2a$10$YNjBiLn7/eyU7L7EP5l6ruAaeWv.KND1ntxiqiX1gn/07nhLLxGnG',
        created_at: Date.now()
    });
};