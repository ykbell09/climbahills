
exports.up = async knex => {
    await knex.schema.dropTableIfExists('problems');
    await knex.schema.createTable('problems', table => {
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.string('fa', 30);
        table.string('setter', 30).notNullable();
        table.integer('grade');
        table.string('plus_minus', 1);
        table.date('date_set').notNullable().defaultTo(knex.fn.now());
        table.timestamp('date_removed');
        table.string('tape_color', 10);
        table.string('notes');
    });
};

exports.down = async knex => {
    await knex.schema.dropTableIfExists('problems');
};
