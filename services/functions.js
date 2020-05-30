import knex from '../database.js';
import { hashPass, compareHash } from './auth.js';

/**
 * 
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @returns {string} username or null
 */
export const addNewUser = async (username, email, password) => {
    const [user] = await knex('users')
        .insert({ username, email, password: await hashPass(password) })
        .returning('username');
    // ADD ERROR IF DUPLICATE USERNAME OR EMAIL
    // https://knexjs.org/#Interfaces-query-error
    return user;
};

/**
 * Checks provided password with database.
 * @param {string} email 
 * @param {string} password 
 * @returns {string} username or null
 */
export const checkPassHash = async (email, password) => {
    const [user] = await knex('users')
        .select('username', 'password')
        .where({ email })
        .returning('username', 'password');
    if (user == null) return null;
    const matches = await compareHash(password, user.password);
    return matches ? user.username : null;
};
