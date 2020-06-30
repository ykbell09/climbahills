import { expect } from 'chai';
import knex from '../database';
import { addNewUser, checkPassHash, sendPassResetEmail, getUserIdByEmail, getUserKeyAndExpiration, compareDates, compareKeys, updateUserPassword, deleteResetRecord } from '../services/functions';

describe('user functions', () => {

    const username = 'testUser';
    const email = 'climbahills@gmail.com';
    const password = 'test';
    const badEmail = 'badEmail@email.com';

    before(async () => {
        await knex('users')
            .where({ username: username })
            .del();
    });

    before(async () => {
        await knex('reset_password').truncate();
    });

    describe('addNewUser', () => {

        it('adds new user to database', async () => {

            const result = await addNewUser(username, email, password);
            expect(result.username).to.equal(username);

        });

        it('tries to add a duplicate value', async () => {

            const result = await addNewUser(username, email, password);
            expect(result).to.be.null;

        });

    });

    describe('checkPassHash', () => {

        it('checks provided password against database', async () => {

            const result = await checkPassHash(email, password);
            expect(result.username).to.equal(username);

        });

        it('user email not in database', async () => {

            const result = await checkPassHash(badEmail, password);
            expect(result).to.be.null;

        });

        it('password doesn\'t match', async () => {

            const badPass = 'badPassword';
            const result = await checkPassHash(email, badPass);
            expect(result).to.be.null;

        });
    });

    describe('sendPassResetEmail', () => {

        it('returns an email confirmation object', async () => {

            const result = await sendPassResetEmail(email);
            expect(result).to.be.an('object');

        });

        it('requests pw reset with a bad email', async () => {

            const result = await sendPassResetEmail(badEmail);
            expect(result).to.be.null;

        });

    });

    describe('getUserIdByEmail', () => {

        it('returns the user id when provided with an email', async () => {

            const result = await getUserIdByEmail(email);
            expect(result).to.be.an('object');

        });

    });

    describe('getsUserKeyAndExpiration', () => {

        it('returns the key and expiration when user requests a password reset', async () => {

            const result = await getUserKeyAndExpiration(email);
            expect(result).to.be.an('object');

        });

        it('returns null if the user provides an email that doesn\'t exist', async () => {

            const result = await getUserKeyAndExpiration(badEmail);
            expect(result).to.be.null;

        });

    });

    describe('compareDates', () => {

        it('compares a given date to today', () => {

            const expiration = new Date(2020, 7, 1, 12, 0, 0);
            console.log('the test expiration is: ' + expiration);
            const result = compareDates(expiration);
            expect(result).to.be.false;

        });

    });

    describe('compareKeys', () => {

        it('compares the user\'s incorrect key to the key that matches the user Id', async () => {

            const userKey = 'XDKDvXhGmVJjMAf7YBmIAppQ9ZTC';
            const userInfo = await getUserKeyAndExpiration(email);
            const result = compareKeys(userInfo.key, userKey);
            expect(result).to.be.false;

        });
        
        it('compares two identical keys', () => {

            const userKey = 'XDKDvXhGmVJjMAf7YBmIAppQ9ZTC';
            const testKey = 'XDKDvXhGmVJjMAf7YBmIAppQ9ZTC';
            const result = compareKeys(testKey, userKey);
            expect(result).to.be.true;

        });
    });
    
    describe('updateUserPassword', async () => {

        it('updates the user password in the user table', async () => {

            const userId = await getUserIdByEmail(email);
            const newPassword = 'updatedPassword';
            const result = await updateUserPassword(userId.id, newPassword);
            expect(result).to.equal(username);

        });
        
    });
    
    describe('deleteResetRecord', async () => {

        it('deletes a record in the reset_password table', async () => {

            const user = await getUserIdByEmail(email);
            const result = await deleteResetRecord(user.id);
            expect(result).to.equal(1);

        });
        
    });


})