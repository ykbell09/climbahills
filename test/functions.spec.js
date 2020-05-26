import { expect } from 'chai';
import knex from '../database';
import { getAllProblems } from '../services/functions';

describe('problem functions', () => {

    describe('getAllProblems', () => {
        it('gets an array of all problems', async () => {
            const allProblems = await getAllProblems();
            console.log(allProblems);
            expect(allProblems).to.have.lengthOf(4);

        });
    });


})