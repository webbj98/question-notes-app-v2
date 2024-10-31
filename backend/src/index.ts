import express from 'express';
import cors from 'cors';
import {Client} from 'pg';
import { toNullableString } from './utils';

const app = express();
const port = 3000;

const db = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'question_notes',
    password: '1234',
    port: 5432
});

db.connect();

app.use(cors())
// middleware that parses json for us
app.use(express.json())


//TODO: should I make separte filel for queries
app.get('/', async (req, res) => {
    const data = await db.query('SELECT * FROM questions');
    console.log('getting the main page')
    res.status(200).json({
        data: data.rows
    })
});

app.post('/questions', async (req, res) => {
    console.log('req: ', req.body)

    const {title, time, type, importance, url} = req.body
    const queryResult = 
        await db.query('INSERT INTO questions (title, time, type, importance, url) VALUES($1, $2, $3, $4, $5)', 
            [title, time, type, importance, toNullableString(url)])
    // const data = await db.query('SELECT ')
    console.log('queryResult: ', queryResult)
    
    res.status(200).json({message: 'Created question successfully'})
});

app.get('/questions/:id', async (req, res) => {
    const id = req.params.id;
    // const data = await db.query('SELECT * FROM questions q INNER JOIN attempts ON q.id = attempts.question_id WHERE q.id = $1;', [id]);
    const data = await db.query("SELECT q.*, a.id as attempt_id, a.date, a.time_taken, a.performance, a.suggested_wait_duration FROM questions q INNER JOIN attempts as a ON q.id = a.question_id WHERE q.id = $1", [id]);
    // const data = await db.query('SELECT * FROM questions WHERE id = $1', [id]);
    // console.log('data get: ', data)
    const dataRows = data.rows;
    const dataRowsFirstElem = data.rows[0];

    const questionData = {
        id: dataRowsFirstElem.id,
        title: dataRowsFirstElem.title,
        time: dataRowsFirstElem.time,
        type: dataRowsFirstElem.type,
        importance: dataRowsFirstElem.importance,
        url: dataRowsFirstElem.url,
        notes: dataRowsFirstElem.notes
    }

    const attemptsData = new Array<any>();
    dataRows.forEach(({attempt_id, date, time_taken, performance, suggested_wait_duration}) => {
        attemptsData.push({
            id: attempt_id,
            date: date,
            timeTaken: time_taken, 
            performance: performance,
            suggestedWaitDuration: suggested_wait_duration,
        })

    })

    res.status(200).json({
        questionData: questionData,
        attemptsData: attemptsData,
        
    })
})


app.post('/attempts', async (req, res) => {
    const {date, timeTaken, performance, questionId, suggestedWaitDuration} = req.body
    console.log('performance: ', performance)
    const queryResult = 
        await db.query('INSERT INTO attempts (date, time_taken, performance, question_id, suggested_wait_duration) VALUES($1, $2, $3, $4, $5)',
            [date, timeTaken, performance, questionId, suggestedWaitDuration]
        );
    
    console.log('queryResult: ', queryResult);
    res.status(200).json({message: 'Created attempts successfully'})  
})


app.listen(port, () => {
    console.log('Listing on port 3000323')
})