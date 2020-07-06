import knex from '../database.js';
import { hashPass, compareHash, resetPasswordEmail } from './auth.js';

const userObject = ['id', 'username', 'password', 'setter', 'admin']

/**
 * Adds a new user to the database.
 * @param {string} username 
 * @param {string} email 
 * @param {string} password 
 * @returns {object} user or null
 */
export const addNewUser = async (username, email, rawPass) => {
    const hashedPass = await hashPass(rawPass);
    const user = await knex('users')
        .insert({ username, email, password: hashedPass })
        .returning(userObject)
        .catch(function () {
            return null;
        });
    if (user == null) return null;
    delete user[0].password;
    return user[0];
};

/**
 * Checks provided password against database.
 * @param {string} email 
 * @param {string} password 
 * @returns {object} user or null
 */
export const checkPassHash = async (email, password) => {
    const user = await knex('users')
        .select()
        .where({ email })
        .returning(userObject)
        .catch(function () {
            return null;
        });
    if (user[0] == null) return null;
    const matches = await compareHash(password, user[0].password);
    delete user[0].password;
    return matches ? user[0] : null;
};

/**
 * Sends an email to a user provided email with password reset infomration.
 * @param {string} email 
 * @returns {object} sentEmail or null
 */
export const sendPassResetEmail = async (email) => {
    const [user] = await knex('users')
        .select('id', 'username')
        .where({ email })
        .returning('id', 'username')
        .catch(function () {
            return null;
        });
    if (user == undefined) return null;
    const sentEmail = await resetPasswordEmail(user.username, user.id, email);
    return sentEmail;
};

/**
 * Gets a user object with an id property when given an email.
 * @param {string} email 
 * @returns {object} user object or null
 */
export const getUserIdByEmail = async (email) => {
    const [user] = await knex('users')
        .select('id')
        .where({ email })
        .returning('id')
        .catch(function () {
            return null;
        });
    if (user == undefined) return null;
    return user;
};

/**
 * Gets associated key and expiration date when a user requests a password reset.
 * @param {string} email 
 * @returns {object} key & expiration properties or null
 */
export const getUserKeyAndExpiration = async (email) => {
    const user = await getUserIdByEmail(email);
    if (user == null) return null;
    const [userInfo] = await knex('reset_password')
        .select('user_id', 'key', 'expiration')
        .where({ user_id: user.id })
        .returning('user_id', 'key', 'expiration')
        .catch(function () {
            return null;
        });
    if (userInfo == undefined) return null;
    return userInfo;
};

/**
 * Checks to see if a key in the reset_password table is expired.
 * @param {date} expiration 
 * @returns {boolean} true is expired
 */
export const compareDates = (expiration) => {
    const today = new Date();
    const expired = expiration < today;
    return expired;
};

/**
 * Compares a user privided key with the key in the reset_password table.
 * @param {string} key 
 * @param {string} userKey 
 * @returns {boolean} false - keys don't match
 */
export const compareKeys = (key, userKey) => {
    if (key !== userKey) return false;
    return true;
};

/**
 * Updates the user password in the users table. 
 * @param {string} id 
 * @param {string} password 
 * @returns {string} username
 */
export const updateUserPassword = async (id, password) => {
    const hashedPass = await hashPass(password);
    const [userName] = await knex('users')
        .where({ id })
        .update({ password: hashedPass })
        .returning('username');
    return userName;
};

/**
 * Deletes a record in the reset_password table, to be used to delete the record after the password has been changed.
 * @param {integer} id 
 * @returns {integer} number of records deleted
 */
export const deleteResetRecord = async (user_id) => {
    const result = await knex('reset_password')
    .where({ user_id })
    .del();
    return result;
};

/**
 * Updates the admin or setter status of a user when provided with an email address. 
 * @param {string} email 
 * @param {boolean} setter 
 * @param {boolean} admin 
 * @returns {boolean} true if updated, false if error
 */
export const updateUserStatus = async (email, setter, admin) => {
    const result = await knex('users')
    .where({ email })
    .update({ setter, admin })
    // .returning( 'email', 'setter', 'admin' )
    .catch(function () {
        return false;
    });
    if (result === 0) return false;
    return true;
};

/**
 * Deletes a user record when provided with an email address.
 * @param {string} email 
 * @returns {boolean} true if updated, false if error
 */
export const deleteUserRecord = async (email) => {
    const result = await knex('users')
    .where({ email })
    .del()
    .catch(function () {
        return false;
    });
    if (result === 0) return false;
    return true;
};