import { expect } from 'chai';
import knex from '../database';
import { addNewProblem, getCurrentProblems } from '../services/problems';

describe('problem functions', () => {

    const problem = {
        name: 'test name',
        fa: 'test climber',
        setter: 'test setter',
        grade: 5,
        plus_minus: '',
        date_set: undefined,
        date_removed: undefined,
        tape_color: 'blue',
        notes: 'test problem is problemy'
    };

    before(async () => {
        await knex('problems')
            .where({ name: problem.name })
            .del();
    });

    describe('addNewProblem', () => {

        it('adds new problem to database', async () => {

            const result = await addNewProblem(
                problem.name,
                problem.fa,
                problem.setter,
                problem.grade,
                problem.plus_minus,
                problem.date_set,
                problem.date_removed,
                problem.tape_color,
                problem.notes
            );
            expect(result).to.be.true;
        });

        it('tries to add a duplicate value', async () => {

            const result = await addNewProblem(
                problem.name,
                problem.fa,
                problem.setter,
                problem.grade,
                problem.plus_minus,
                problem.date_set,
                problem.date_removed,
                problem.tape_color,
                problem.notes

            );
            expect(result).to.be.false;

        });

    });

    describe('getCurrentProblems', () => {

        it('gets all current problems', async () => {

            const result = await getCurrentProblems();
            expect(result).to.be.an('array');

        });
    });

})