
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'Rachel', email: 'test1@test.com', password: '1', setter: false},
        {username: 'Pat', email: 'test2@test.com', password: '2', setter: false},
        {username: 'Yvettte', email: 'test3@test.com', password: '3', setter: true}
      ]);
    });
};
