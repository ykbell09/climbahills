
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users')
    .where({ email: 'climbahills@gmail.com' })
    .update({
      setter: true, admin: true
    })
  };
