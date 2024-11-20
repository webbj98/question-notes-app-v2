import express, {ErrorRequestHandler} from 'express';
import cors from 'cors';
// import {Client} from 'pg';
import { connectToDb, getQuestionsWithLastAttempt } from './dbManager';
import {API_ROUTES} from '../../shared/routes.js'
import { CreateAttemptInput, CreateQuestionInput } from '../../shared/typings/queryInputs.ts';
import { createAttempts, createQuestion, deleteAttempts, deleteQuestion, editQuestion, getQuestionsByIdWithAttempts } from './dbManager.ts';
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

app.get('/questions/:id/with-attempts', async (req, res) => {
    const id = req.params.id;
    // const data = await db.query('SELECT * FROM questions q INNER JOIN attempts ON q.id = attempts.question_id WHERE q.id = $1;', [id]);
    const data = await getQuestionsByIdWithAttempts({id: Number(id)})

    res.status(200).json({
        data
        
    })
})

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

        const importanceSegment = `importance = $${argNum}`;
        if (args.importance) {
            arguements.push(args.importance);
            updateSegments.push(importanceSegment);
            argNum++;
        }

        const urlSegment = `url = $${argNum}`;
        if (args.url) {
            arguements.push(args.url);
            updateSegments.push(urlSegment);
            argNum++;
        }

        const notesSegment = `notes = $${argNum}`;
        if (args.notes) {
            arguements.push(args.notes);
            updateSegments.push(notesSegment);
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

app.delete('/questions/:id', async (req, res) => {
    const id = Number(req.params.id);
    const data = await deleteQuestion({id});

    res.status(200).json({
        data
    });
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

app.delete('/attempts/:id', async (req, res) => {
    const id = Number(req.params.id);
    const data = await deleteAttempts({id});

    res.status(200).json({
        data
    });
})

app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
  });

app.use(errorHandler);
app.listen(port, () => {
    console.log('Listing on port 3000323')
})