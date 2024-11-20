
import pg from 'pg'
import { CreateAttemptInput, CreateQuestionInput, EditQuestionInput, GetByIdInput } from '../../shared/typings/queryInputs.ts';
import { toNullableString } from './utils.ts';
import { Attempt, AttemptWithoutQuestion, LastAttempt, Question, QuestionWithAttempts, QuestionWithLastAttempt } from '../../shared/typings/model.ts';
import { GetQuestionsWithAttemptQueryResult } from '../../shared/typings/queryResults.ts';
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

export async function getQuestionsWithLastAttempt(): Promise<QuestionWithLastAttempt[]> {
    const data = await db.query<GetQuestionsWithAttemptQueryResult>(`
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
        console.log('dataRowdsfsdfd: ', dataRow)
        const question = {
            id: dataRow.id,
            title: dataRow.title,
            time: dataRow.time,
            type: dataRow.type,
            importance: dataRow.importance,
            url: dataRow.url,
            notes: dataRow.notes,
        }
        let lastAttempt = null;
        if (dataRow.attempt_id) {
            const newDate = new Date(dataRow.date) 
            lastAttempt = {
                id: dataRow.attempt_id,
                date: newDate,
                timeTaken: dataRow.time_taken, 
                performance: dataRow.performance,
                suggestedWaitDuration: dataRow.suggested_wait_duration,
            }

        }


        return {
            question,
            lastAttempt
        }
    })

    return questionsAttemptData;
}

export async function createQuestion({title, time, type, importance, url} : CreateQuestionInput): Promise<Question> {
    const queryResult = await db.query<Question>('INSERT INTO questions (title, time, type, importance, url) VALUES($1, $2, $3, $4, $5) RETURNING *', 
        [title, time, type, importance, url])

    return queryResult.rows[0];
}

export async function getQuestionsByIdWithAttempts({id}: GetByIdInput): Promise<QuestionWithAttempts> {
    console.log('id: ', id)
    const queryResult = await db.query<GetQuestionsWithAttemptQueryResult>(`
        SELECT q.*, a.id as attempt_id, a.date, a.time_taken, a.performance, a.suggested_wait_duration
        FROM questions q 
        LEFT JOIN attempts as a ON q.id = a.question_id 
        WHERE q.id = $1`, [id]
    );

    const dataDataRows = queryResult.rows
    const dataRowsFirstElem = dataDataRows?.[0] || [];

    const questionData = {
        id: dataRowsFirstElem?.id,
        title: dataRowsFirstElem?.title,
        time: dataRowsFirstElem?.time,
        type: dataRowsFirstElem?.type,
        importance: dataRowsFirstElem?.importance,
        url: dataRowsFirstElem?.url,
        notes: dataRowsFirstElem?.notes
    }

    const attemptsData = new Array<AttemptWithoutQuestion>();
    dataDataRows.forEach(({attempt_id, date, time_taken, performance, suggested_wait_duration}) => {
        // If no attempt_id, then there is no attempt on the question 
        if (attempt_id) {
            attemptsData.push({
                id: attempt_id,
                date: new Date(date),
                timeTaken: time_taken, 
                performance: performance,
                suggestedWaitDuration: suggested_wait_duration,
            })
        }
    })
    console.log('question by id: ',  queryResult.rows)

    return {
        question: questionData,
        attempts: attemptsData,
    };
}

export async function deleteQuestion({id}: GetByIdInput): Promise<Question> {
    const queryResult = await db.query<Question>('DELETE FROM questions WHERE id= $1 RETURNING *',
        [id]
    );

    return queryResult.rows[0];
}

export async function createAttempts({date, timeTaken, performance, questionId, suggestedWaitDuration}: CreateAttemptInput): Promise<Attempt> {
    const queryResult = 
        await db.query<Attempt>('INSERT INTO attempts (date, time_taken, performance, question_id, suggested_wait_duration) VALUES($1, $2, $3, $4, $5) RETURNING *',
            [date, timeTaken, performance, questionId, suggestedWaitDuration]
        );

    console.log("queryResult: ", queryResult.rows);
    return queryResuetlt.rows[0];
}

export async function deleteAttempts({id}: GetByIdInput): Promise<Attempt> {
    const queryResult = await db.query<Attempt>('DELETE FROM attempts WHERE id=$1 RETURNING *',
        [id]
    );

    return queryResult.rows[0];
}

// export async function editQuestion(inputs: EditQuestionInput, fullQuery: string, arguements: (string | number)[]) {
export async function editQuestion(fullQuery: string, arguements: (string | number)[]) {
    const result =  await db.query<Question>(fullQuery, arguements);
    console.log('result row: ', result.rows[0]);
    return result.rows[0];
}
