import { expect } from 'chai';
import knex from '../database';
import { addNewUser, checkPassHash } from '../services/functions';

describe('user functions', () => {

    const username = 'testUser';
    const email = 'testUser@test.com';
    const password = 'test';

    before(async () => {
        await knex('users')
            .where({ username: username })
            .del();
    });

    describe('addNewUser', () => {

        it('add new user to database', async () => {
            
            const result = await addNewUser(username, email, password);
            expect(result).to.equal(username);
            
        });
        
        // it('tries to add a duplicate value', async () => {
            
        //     const result = await addNewUser(username, email, password);
        //     expect(result).to.throw();
            
        // });

    });

    describe('checkPassHash', () => {

        it('checks provided password against database', async () => {
            
            const result = await checkPassHash(email, password);
            expect(result).to.equal(username);

        });

        it('user email not in database', async () => {
            
            const badEmail = 'badEmail@email.com';
            const result = await checkPassHash(badEmail, password);
            expect(result).to.be.null;

        });

        it('password doesn\'t match', async () => {
            
            const badPass = 'badPassword';
            const result = await checkPassHash(email, badPass);
            expect(result).to.be.null;

        });
    });

})