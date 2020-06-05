import bcrypt from 'bcrypt';
import knex from '../database';
import nodemailer from 'nodemailer';

const saltRounds = 10;
export const hashPass = async rawPass =>
    await bcrypt.hash(rawPass, saltRounds);
;

export const compareHash = async (rawPass, hashedPass) =>
    await bcrypt.compare(rawPass, hashedPass);

/**
 * Generates a random 28 characther alphanumeric key to use in password reset.
 */
const generateRandomKey = () => {
    const allCapsAlpha = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
    const allLowerAlpha = [..."abcdefghijklmnopqrstuvwxyz"];
    const allNumbers = [..."0123456789"];
    const base = [...allCapsAlpha, ...allNumbers, ...allLowerAlpha];
    return [...Array(28)]
        .map(i => base[Math.random() * base.length | 0])
        .join('');
};

/**
 * Generates an expiration date 24 hours from now.
 */
const generateExpiration = () => {
    const date = new Date();
    const today = date.getDate();
    date.setDate(today+1);
    return date;    
};

// const transport = nodemailer.createTransport({

// })

// const emailPasswordReset = (user_id, key) => {

// };


export const resetPassword = async user_id => {
    const key = generateRandomKey();
    const expiration = generateExpiration();
    await knex('reset_password')
        .insert({ user_id, key, expiration });
    // emailPasswordReset(user_id, key);
    
    return test;
};

// const [{ expires, key }] = await Knex('reset_password')
//     .select('key')
//     .where({ userId });

// if (hasExpired(expires)) throw new Error();
// if (key !== userKey) throw new Error();