import knex from '../database.js';
import { hashPass, compareHash } from './auth.js';
import session from 'express-session';


// RETURNS AND ARRAY OF OBJECTS
// export const getAllProblems = async () => {
//     return await knex('problems')
//         .returning('date_set', 'name', 'userid', 'grade', 'notes');
// };

// ADD NEW USER FUNCTION & RETURN USERNAME
export const addNewUser = async (username, email, password) => {
    const user = await knex('users')
        .insert({ username, email, password: await hashPass(password) })
        .returning('username');
    return user[0];
};

// LOG IN EXISTING USER & RETURN USERNAME
export const getUserByEmail = async email => {
    const user = await knex('users')
        .select('username', 'password')
        .where({ email })
        .returning('username', 'password');
    return user[0].username;
};

export const loginUser = async (email, password, { session }) => {
    
    // THIS NEEDS WORK!
    
    
    const userPass = await getUserByEmail(email);
    const matches = await compareHash(password, userPass);
    session.user = matches ? user : null;
    console.log(session);
    return session;
};