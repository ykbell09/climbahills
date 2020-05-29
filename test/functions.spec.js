import { expect } from 'chai';
import knex from '../database';
import { addNewUser } from '../services/functions';

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
            .del();
    });

    describe('addNewUser', () => {
        it('inserts a recored and returns the username in an array', async () => {
            
            const username = 'testUser';
            const email = 'testUser@test.com';
            const password = 'test';
            const data = await addNewUser(username, email, password);

            expect(data[0]).to.equal(username);
        });
    });

})