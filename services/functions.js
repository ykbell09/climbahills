import knex from '../database.js';

// RETURNS AND ARRAY OF OBJECTS
export const getAllProblems = async () => {
    return await knex('problems')
        .returning('date_set', 'name', 'userid', 'grade', 'notes');
};