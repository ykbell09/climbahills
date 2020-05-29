import { expect } from 'chai';
import knex from '../database';
import { addNewUser, getUserByEmail } from '../services/functions';

// describe('problem functions', () => {

//     describe('getAllProblems', () => {
//         it('gets an array of all problems', async () => {
//             const allProblems = await getAllProblems();
//             console.log(allProblems);
//             expect(allProblems).to.have.lengthOf(4);

//         });
//     });


// });

describe('user functions', () => {

    // DELETES CREATED MEMBER DATA
    afterEach(async () => {
        await knex('users')
            .where({ username: 'testUser' })
            .orWhere({ username: 'testUser2' })
            .del();
    });

    describe('addNewUser', () => {
        it('inserts a recored and returns the username in an array', async () => {
            
            const username = 'testUser';
            const email = 'testUser@test.com';
            const password = 'test';
            const result = await addNewUser(username, email, password);
            expect(result).to.equal(username);
            
        });
    });

    describe('getUserByEmail', () => {
        it('returns the logged in username', async () => {
            
            const username = 'testUser2';
            const email = 'testUser2@test.com';
            const password = 'test2';
            await addNewUser(username, email, password);
            const result = await getUserByEmail(email);
            expect(result).to.equal(username);

        });
    });

})