import knex from '../database.js';

// name, fa, setter, grade, plus_minus, date_set, date_removed, tape_color, notes
// there's got to be a way to make this function cleaner?
/**
 * Inserts a new problem into the problem database and returns success or failure.
 * @param {string} name 
 * @param {string} fa 
 * @param {string} setter 
 * @param {integer} grade 
 * @param {string} plusMinus 
 * @param {date} dateSet 
 * @param {date} dateRemoved 
 * @param {string} tapeColor 
 * @param {string} notes 
 * @returns {boolean} success response
 */
export const addNewProblem = async (
    name,
    fa,
    setter,
    grade,
    plusMinus,
    dateSet,
    dateRemoved,
    tapeColor,
    notes
) => {
    const problem = await knex('problems')
        .insert({
            name: name,
            fa: fa,
            setter: setter,
            grade: grade,
            plus_minus: plusMinus,
            date_set: dateSet,
            date_removed: dateRemoved,
            tape_color: tapeColor,
            notes: notes
        })
        .returning('name')
        .catch(function () {
            return null;
        });
    if (problem == null) return false;
    return true;
};

/**
 * returns all problems without a removal date.
 * @returns {object} array of problem objects
 */
export const getCurrentProblems = async () => {
    return await knex('problems')
        .select()
        .where({ date_removed: null })
        .returning('name', 'fa', 'setter', 'grade', 'plusMinus', 'tapeColor', 'notes')
        .catch(function () {
            return null;
        });
};