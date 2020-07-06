
exports.seed = function (knex) {
  return knex('users')
    .where({ email: 'climbahills@gmail.com' })
    .update({
      setter: true, admin: true
    })
  };
