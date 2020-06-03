import knex from '../database.js';
import { hashPass, compareHash } from './auth.js';

/**
 * Adds a new user to the database.
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @returns {string} username or null
 */
export const addNewUser = async (username, email, rawPass) => {
    const hashedPass = await hashPass(rawPass);
    const user = await knex('users')
        .insert({ username, email, password: hashedPass })
        .returning('username')
        .catch(function () {
            return null;
        });
    if (user == null) return null;
    return user[0];
};

/**
 * Checks provided password against database.
 * @param {string} email 
 * @param {string} password 
 * @returns {object} user or null
 */
export const checkPassHash = async (email, password) => {
    const [user] = await knex('users')
        .select('username', 'password', 'setter')
        .where({ email })
        .returning('username', 'password', 'setter');
    if (user == null) return null;
    const matches = await compareHash(password, user.password);
    delete user.password;
    return matches ? user : null;
};
