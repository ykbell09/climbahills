import { expect } from 'chai';
import knex from '../database';
import { addNewUser, checkPassHash } from '../services/functions';
// import { resetPassword } from '../services/auth';

describe('user functions', () => {

    const username = 'testUser';
    const email = 'testUser@test.com';
    const password = 'test';

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

    // describe('resetPassword', () => {

    //     it('WIP - allows user to change password', async () => {

    //         const getTestId = async (email) => {
    //             const id = await knex('users')
    //                 .select('id')
    //                 .where({email})
    //                 .returning('id');
    //             return id;
    //         };

    //         const testId = await getTestId(email);

    //         const result = await resetPassword(testId[0].id);
    //         // expect(result[0].user_id).to.equal(testId[0].id);

    //     });

    // });

})