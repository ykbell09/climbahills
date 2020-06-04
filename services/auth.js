import bcrypt from 'bcrypt';
import Knex from 'knex';

const saltRounds = 10;
export const hashPass = async rawPass => 
    await bcrypt.hash(rawPass, saltRounds);
;

export const compareHash = async (rawPass, hashedPass) =>
    await bcrypt.compare(rawPass, hashedPass);





// export const resetPassword = async userId => {
//     const key = generateRandomKey();
//     await Knex('reset_password')
//         .insert({ expires: generateExpiration(), key, userId });
//     emailPasswordReset(userId, key);
// };

// const [{ expires, key }] = await Knex('reset_password')
//     .select('key')
//     .where({ userId });

// if (hasExpired(expires)) throw new Error();
// if (key !== userKey) throw new Error();