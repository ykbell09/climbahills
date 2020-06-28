import { expect } from 'chai';
import knex from '../database';
import { addNewUser, checkPassHash, sendPassResetEmail } from '../services/functions';

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

        it('add new user to database', async () => {
            
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

        it('WIP -- bad email pw reset', async () => {

            const result = await sendPassResetEmail(badEmail);
            expect(result).to.be.null;

        });

    });

})