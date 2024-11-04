
import pg from 'pg'
import { CreateAttemptInput, CreateQuestionInput, EditQuestionInput, GetByIdInput } from '../../shared/typings/queryInputs.ts';
import { toNullableString } from './utils.ts';
import { Attempt, Question } from '../../shared/typings/model.ts';
// import { Client } from "pg";
const ClientObj = pg.Client;

let db: pg.Client;
// let db: Client;

export function connectToDb() {
    console.log('made db')
    db = new ClientObj({
        user: 'postgres',
        host: 'localhost',
        database: 'question_notes',
        password: '1234',
        port: 5432
    });
    
    db.connect();
}

// app.get('/questions', async (req, res) => {
//     console.log('in questions')
//     const data = await db.query('SELECT * FROM questions');
//     console.log('getting the main page')
    
//     res.status(200).json({
//         data: data.rows
//     })
// });

export async function getQuestions() {
    const data = await db.query('SELECT * FROM questions');
    console.log('getting the main page')
    
    return data.rows;

}

export async function getQuestionsWithLastAttempt() {
    const data = await db.query(`
        SELECT q.*, ranked_attempts.id as attempt_id, ranked_attempts.date, ranked_attempts.time_taken, ranked_attempts.performance, ranked_attempts.suggested_wait_duration
        FROM questions q 
        LEFT JOIN (
            SELECT *,
                ROW_NUMBER() OVER(PARTITION BY question_id ORDER BY date DESC) AS attempt_rank
            FROM attempts

        ) AS ranked_attempts ON q.id = ranked_attempts.question_id
        WHERE ranked_attempts.attempt_rank = 1 OR ranked_attempts.attempt_rank IS NULL;
    `)

    const questionsAttemptData = data.rows.map((dataRow) => {

        return {
            id: dataRow.id,
            title: dataRow.title,
            time: dataRow.time,
            type: dataRow.type,
            importance: dataRow.importance,
            url: dataRow.url,
            notes: dataRow.notes,
            attemptId: dataRow.attempt_id,
            date: dataRow.date,
            timeTaken: dataRow.time_taken, 
            performance: dataRow.performance,
            suggestedWaitDuration: dataRow.suggested_wait_duration,

        }
    })

    return questionsAttemptData;
}

export async function createQuestion({title, time, type, importance, url} : CreateQuestionInput): Promise<Question> {
    const queryResult = await db.query<Question>('INSERT INTO questions (title, time, type, importance, url) VALUES($1, $2, $3, $4, $5) RETURNING *', 
        [title, time, type, importance, url])

    return queryResult.rows[0];
}

export async function getQuestionsByIdWithAttempts({id}: GetByIdInput) {
    console.log('id: ', id)
    const queryResult = await db.query(`
        SELECT q.*, a.id as attempt_id, a.date, a.time_taken, a.performance, a.suggested_wait_duration
        FROM questions q 
        LEFT JOIN attempts as a ON q.id = a.question_id 
        WHERE q.id = $1`, [id]
    );

    console.log('question by id: ',  queryResult.rows)

    return queryResult;
}

export async function createAttempts({date, timeTaken, performance, questionId, suggestedWaitDuration}: CreateAttemptInput): Promise<Attempt> {
    const queryResult = 
        await db.query('INSERT INTO attempts (date, time_taken, performance, question_id, suggested_wait_duration) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [date, timeTaken, performance, questionId, suggestedWaitDuration]
        );

    console.log("queryResult: ", queryResult.rows);
    return queryResult.rows[0];

}

// export async function editQuestion(inputs: EditQuestionInput, fullQuery: string, arguements: (string | number)[]) {
    export async function editQuestion(fullQuery: string, arguements: (string | number)[]) {
    const result =  await db.query(fullQuery, arguements);
    console.log('result row: ', result.rows[0]);
    return result.rows[0];
}