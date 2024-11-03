import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './QuestionsPage.css';
import { getQuestionTypeLabel } from "../../../shared/typings/mappings";
import Alert from "../../components/Alert";
import { AlertTypes } from "../../../shared/typings/model";

const QuestionsPage: React.FC = () => {

    const [questions, setQuestions] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        async function getQuestions() {
            try {
                //TODO: make a home screen and put question here
                const response = await fetch('http://localhost:3000/questions/with-last-attempt', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    console.log('result: ', result)
                    const questionsLastAttemptWithDate = result.questionsLastAttempt.map((questionLastAttempt) => {
                        const dateObj = new Date(questionLastAttempt.date);
                        return {
                            ...questionLastAttempt,
                            date: dateObj
                        }
                    })
                    setQuestions(questionsLastAttemptWithDate);
                } else {
                    const errRes = await response.json()
                    setErrorMsg(errRes.message)
                    console.log('response not ok: ', errRes)
                }
            } catch (error) {
                console.log('error at some point: ', error)
                // setErrorMsg()
            }
        }

        getQuestions()

    }, [])

    // console.log('questinos: ', questions)
    const questionRowDisplay = questions?.map((question) => {
        const copyDate = new Date(question.date)
        copyDate.setDate(question.date.getDate() + question?.suggestedWaitDuration)
        // retakeDate?.setDate(retakeDate.getDate() + question?.suggestedWaitDuration)

        // console.log('question wait time: ', question.suggestedWaitDuration)
        return (
            <tr>
                <td><Link to={`${question.id}`}>{question.title}</Link></td>
                <td>{question.date.toLocaleDateString()}</td>
                <td>{question.timeTaken} / {question.time}</td>
                <td>{getQuestionTypeLabel(question.type)}</td>
                <td>{question.importance}</td>
                <td>{question.url}</td>
                <td>{question.suggestedWaitDuration}</td>
                <td>{copyDate.toLocaleDateString()}</td>
                
            </tr>
        )
    })

    return (
        <div>
            <h1>Questions</h1>

            {errorMsg && <Alert message={errorMsg} type={AlertTypes.Error} />}

            <table>
                <thead>
                    <tr className="table-row">
                        <th>Title</th>
                        <th>Date</th>
                        <th>Time Taken / Total Time (minutes)</th>
                        <th>Type</th>
                        <th>Importance</th>
                        <th>Url</th>
                        <th>Wait Time (days)</th>
                        <th>Retake Date</th>
                        
                    </tr>

                </thead>
                <tbody>
                    {questionRowDisplay}

                </tbody>
            </table>
            <Link to={'new'}>
                <button>Create Question</button>
            </Link>
            
        </div>

    )
}

export default QuestionsPage;

//Move to separatef ile

const QuestionsTable: React.FC = () => {


    return (
        <table>

        </table>
    )
}