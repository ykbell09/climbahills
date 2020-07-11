exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('problems').del()
    .then(function () {
      // Inserts seed entries
      return knex('problems').insert([
        { name: 'Test Problem', fa: 'Rachel', setter: 'Yvette', grade: 2, tape_color: 'blue', notes: 'big moves, use your tall' },
        { name: 'Test Problem 2', fa: 'Rini', setter: 'Rachel', grade: 3, plus_minus: '+', tape_color: 'orange', notes: 'heel hook mandatory' }
      ]);
    });
};