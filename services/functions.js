import knex from '../database.js';

// RETURNS AND ARRAY OF OBJECTS
// export const getAllProblems = async () => {
//     return await knex('problems')
//         .returning('date_set', 'name', 'userid', 'grade', 'notes');
// };

// NEW USER FUNCTION -- returns ['Name']
export const addNewUser = async(username, email, password) => {
    return await knex('users')
        .insert({ username, email, password })
        .returning('username');
};