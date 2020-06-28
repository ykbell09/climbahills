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


export const resetPasswordEmail = async (username, user_id, email) => {
    const key = generateRandomKey();
    const expiration = generateExpiration();
    await knex('reset_password')
        .insert({ user_id, key, expiration });
    
    // WORK ON THIS
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
        text: `Hi there, ${username}!
    
    We got your request to reset your password. CLICK HERE to set a new password using this key (${key}) to verify your identity. Hurry, because the key expires soon! If you didn't request this password change, you can ignore this message.
    
    Thanks!
    The A-Hills Team`
    };

    const info = await transport.sendMail(mailOptions);
    console.log(info.messageId);
    resetPasswordEmail().catch(console.error);
};
    



// const [{ expires, key }] = await Knex('reset_password')
//     .select('key')
//     .where({ userId });

// if (hasExpired(expires)) throw new Error();
// if (key !== userKey) throw new Error();