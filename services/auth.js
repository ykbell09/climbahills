import bcrypt from 'bcrypt';
import knex from '../database';
import nodemailer from 'nodemailer';
import _ from '../env';

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
    date.setDate(today + 1);
    return date;
};

/**
 * WIP
 * @param {string} username 
 * @param {integer} user_id 
 * @param {string} email 
 */
export const resetPasswordEmail = async (username, user_id, email) => {
    await knex('reset_password')
        .where({ user_id })
        .del();

    const key = generateRandomKey();
    const expiration = generateExpiration();
       
    await knex('reset_password')
        .insert({ user_id, key, expiration });
    
    const transport = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Climb A-Hills Password Reset',
        html: `<p>Hi there, ${username}!</p>
    
    <p>We got your request to reset your password. <a href="http://www.climbahills.com/static/reset.html">CLICK HERE</a> to set a new password using this key (${key}) to verify your identity. Hurry, because the key expires soon! If you didn't request this password change, you can ignore this message.</p>
    
    <p>Thanks!<br />
    The A-Hills Team </p>`
    };

    const info = await transport.sendMail(mailOptions);
    resetPasswordEmail().catch(function () {
        return null;
    });
    return info;
};

// if (hasExpired(expires)) throw new Error();
// if (key !== userKey) throw new Error();