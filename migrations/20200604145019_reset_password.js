exports.up = async knex => {
    await knex.schema.dropTableIfExists('reset_password');
    await knex.schema.createTable('reset_password', table => {
        table.integer('user_id').notNullable();
        table.string('key').notNullable();
        table.date('expiration').notNullable();
    });
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('reset_password');
};