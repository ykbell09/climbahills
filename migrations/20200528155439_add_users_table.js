
exports.up = async knex => {
    await knex.schema.dropTableIfExists('users');
    await knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('username', 20).unique().notNullable();
        table.string('email', 30).unique().notNullable();
        table.string('password').notNullable();
        table.timestamp('joined').defaultTo(knex.fn.now()).notNullable();
        table.boolean('setter').defaultTo('false').notNullable();
    });
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('users');
};