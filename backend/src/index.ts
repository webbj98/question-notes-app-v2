import express, {ErrorRequestHandler} from 'express';
import cors from 'cors';
// import {Client} from 'pg';
import { toNullableString } from './utils.js';
import { connectToDb, getQuestionsWithLastAttempt } from './dbManager';
import {API_ROUTES} from '../../shared/routes.js'
import { CreateAttemptInput, CreateQuestionInput } from '../../shared/typings/queryInputs.ts';
import { createAttempts, createQuestion, editQuestion, getQuestionsByIdWithAttempts } from './dbManager.ts';
import { Attempt } from '../../shared/typings/model.ts';
const app = express();
const port = 3000;

// const db = new Client({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'question_notes',
//     password: '1234',
//     port: 5432
// });

// db.connect();

app.use(cors())
// middleware that parses json for us
app.use(express.json())

connectToDb();
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {

    console.log('err: ', err)
    // console.log('errdsf: ', err/4)
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack, // Hide error details in production
    })

    // message: err.message || 'Internal Server Error',
}




//TODO: should I make separte filel for queries
// app.get('/questions', async (req, res) => {
//     console.log('in questions')
//     const data = await db.query('SELECT * FROM questions');
//     console.log('getting the main page')
    
//     res.status(200).json({
//         data: data.rows
//     })
// });

app.post('/questions', async (req, res, next) => {
    try {
        console.log('req: ', req.body)

        const createQuestionInput: CreateQuestionInput = req.body;
        const question = createQuestion(createQuestionInput);
        // const data = await db.query('SELECT ')
        // console.log('queryResult: ', queryResult)
        res.status(200).json({
            question
        })
    } catch (error) {
        next(error)
    }
    
});

// IF BUG HAPPENS CHANGING route won't don anything unless restart server
// questions/with-last-attempt
// has something to do with code getting confused on which route is which 
app.get(`${API_ROUTES.questions}/with-last-attempt`, async (req, res, next) => {
    try {
        // API_ROUTES.questions
        const questionsAttemptData = await getQuestionsWithLastAttempt()
        console.log('db query done')
        // throw new Error('test error throw')

        res.status(200).json({
            questionsLastAttempt: questionsAttemptData,
        })


    } catch (error) {
        console.log('got the error')
        next(error)
        // throw new Error('Error from server: ' +  error)
    }

    // res.status(200).json({message: 'mm'})
})


// app.get('/questions/:id', async (req, res) => {
//     const id = req.params.id;
//     const data = await db.query("SELECT * from questions q WHERE q.id = $1", [id]);
//     res.status(200).json({
//         data: data
//     })
// })

app.get('/questions/:id/with-attempts', async (req, res) => {
    const id = req.params.id;
    // const data = await db.query('SELECT * FROM questions q INNER JOIN attempts ON q.id = attempts.question_id WHERE q.id = $1;', [id]);
    const data = await getQuestionsByIdWithAttempts({id: Number(id)})

    const dataRows = data.rows;
    const dataRowsFirstElem = dataRows[0];

    const questionData = {
        id: dataRowsFirstElem?.id,
        title: dataRowsFirstElem?.title,
        time: dataRowsFirstElem?.time,
        type: dataRowsFirstElem?.type,
        importance: dataRowsFirstElem?.importance,
        url: dataRowsFirstElem?.url,
        notes: dataRowsFirstElem?.notes
    }

    const attemptsData = new Array<Attempt>();
    dataRows.forEach(({attempt_id, date, time_taken, performance, question_id, suggested_wait_duration}) => {
        // If no attempt_id, then there is no attempt on the question 
        if (attempt_id) {
            attemptsData.push({
                id: attempt_id,
                date: date,
                timeTaken: time_taken, 
                performance: performance,
                questionId: question_id,
                suggestedWaitDuration: suggested_wait_duration,
            })
        }
        

    })
    console.log('attemptsdata: ', attemptsData)

    res.status(200).json({
        questionData: questionData,
        attemptsData: attemptsData,
        
    })
})

// app.get('/questions/:id/with-last-attempt', async (req, res) => {
//     console.log('in here')
//     const id  = req.params.id;

//     try {
//         const data = await db.query(`
//             SELECT q.*, a.id as attempt_id, a.date, a.time_taken, a.performance, a.suggested_wait_duration
//             FROM questions q 
//             INNER JOIN attempts as a ON q.id = a.question_id 
//             WHERE q.id = $1
//             ORDER BY a.date DESC LIMIT 1`
//             , [id]
//         );

//         const dataRow = data.rows[0];


//         const questionData = {
//             id: dataRow.id,
//             title: dataRow.title,
//             time: dataRow.time,
//             type: dataRow.type,
//             importance: dataRow.importance,
//             url: dataRow.url,
//             notes: dataRow.notes
//         }

//         const attemptData = {
//             id: dataRow.attempt_id,
//             date: dataRow.date,
//             timeTaken: dataRow.time_taken, 
//             performance: dataRow.performance,
//             suggestedWaitDuration: dataRow.suggested_wait_duration,
//         }
//         res.status(200).json({
//             questionData: questionData,
//             attemptData: attemptData,
//         })


//     } catch (error) {
//         throw new Error('Error from server: ' +  error)
//     }
// })



app.patch('/questions/:id', async (req, res) => {
    const id = Number(req.params.id);
    const args = req.body;
    let argNum = 1;
    const buildQuery = ['UPDATE questions SET'];
    const updateSegments: string[] = [];
    const arguements: (string | number)[] = [];
    console.log('args: ', args)
    try {
        const titleSegment = `title = $${argNum}`;
        if (args.title) {
            arguements.push(args.title);
            updateSegments.push(titleSegment);
            argNum++;
        }

        const timeSegment = `time = $${argNum}`;
        if (args.time) {
            arguements.push(args.time);
            updateSegments.push(timeSegment);
            argNum++;
        }

        const typeSegment = `type = $${argNum}`;
        if (args.type) {
            arguements.push(args.type);
            updateSegments.push(typeSegment);
            argNum++;
        }

        const updateSec = updateSegments.join(', ');
        buildQuery.push(updateSec);
        buildQuery.push(`WHERE id=$${argNum} RETURNING *`);
        const fullQuery = buildQuery.join(' ');
        arguements.push(id);
        console.log('full query: ', fullQuery);
        console.log('arguements: ', arguements)

        const result = editQuestion(fullQuery, arguements)
        console.log('result: ', result)
        

        // console.log('attemptInfo: ', attemptInfo);
        res.status(200).json({data: result})
    } catch (error) {
        console.log('update type error: ', error);
        throw error;
    }


})

app.post('/attempts', async (req, res) => {
    const inputs: CreateAttemptInput = req.body
    // console.log('suggestedWaitDuration: ', suggestedWaitDuration)
    // console.log('performance: ', performance)
    const newAttempt = await createAttempts(inputs)
        
    // console.log('queryResult: ', queryResult);
    // console.log('queryResult row count: ', queryResult.rows)
    
    res.status(200).json({newAttempt})  
})

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
  });

app.use(errorHandler);
app.listen(port, () => {
    console.log('Listing on port 3000323')
})